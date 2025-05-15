#include "cpython_interface.hpp"

#include "core/protocol_impl.inl"
#include "core/protobuf_protocol_impl.inl"
#include "core/val_protocol.hpp"

namespace {

std::string get_pyerr_with_clear()
{
  PyObject* err_type = nullptr, *err_value = nullptr, *err_traceback = nullptr;
  PyErr_Fetch(&err_type, &err_value, &err_traceback);

  if (err_value)
  {
    PyObject* str_obj = PyObject_Str(err_value);
    if (str_obj)
    {
      const char* cstr = PyUnicode_AsUTF8(str_obj);
      if (cstr)
      {
        std::string result{ cstr };
        Py_DECREF(str_obj);
        PyErr_Clear();
        return result;
      }
      PyErr_Clear();
    }
    else
    {
      PyErr_Clear();
    }
  }
  else
  {
    return "<no error>";
  }

  // Restore the error state in case of any previous errors
  if (err_type)
    PyErr_Restore(err_type, err_value, err_traceback);

  // Fallback to print if we could not convert the error to a string
  PyErr_Print();
  PyErr_Clear();

  return "<unprintable PyObject>";
}

std::string py_object_to_string(PyObject* obj)
{
  if (!obj)
    return "<null PyObject>";

  // For some reason, if we do not call PyErr_Clear() here, it will fail at some point with WhichOneof
  // if (PyErr_Occurred())
  // {
  //   PyErr_Print();
  //   PyErr_Clear();
  // }

  PyObject* str_obj = PyObject_Str(obj);
  if (str_obj)
  {
    const char* cstr = PyUnicode_AsUTF8(str_obj);
    if (!cstr)
      PyErr_Clear();
    std::string result = cstr ? cstr : "<unprintable PyObject>";
    Py_DECREF(str_obj);
    return result;
  }
  PyErr_Clear();

  return "<unprintable PyObject>";
}

}

namespace cpp
{
class python_managed_object
{
public:
  python_managed_object()
    : pyobj(Py_None)
  {
    Py_XINCREF(pyobj);
  }

  python_managed_object(PyObject* obj)
    : pyobj(obj ? obj : Py_None)
  {
    Py_XINCREF(pyobj);
  }

  python_managed_object(const std::string& str)
    : pyobj(PyUnicode_FromString(str.c_str()))
  {
    FC_ASSERT(pyobj, "Failed to convert string '${str}' to PyObject: ${pyerr}", (str)("pyerr", get_pyerr_with_clear()));
  }

  python_managed_object(const python_managed_object& other)
    : pyobj(other.pyobj)
  {
    Py_XINCREF(pyobj);
  }

  python_managed_object& operator=(const python_managed_object& other)
  {
    if (this != &other)
    {
      Py_XINCREF(other.pyobj);
      Py_XDECREF(pyobj);
      pyobj = other.pyobj;
    }
    return *this;
  }

  python_managed_object(python_managed_object&& other) noexcept
    : pyobj(other.pyobj)
  {
    other.pyobj = Py_None;
    Py_XINCREF(Py_None);
  }

  python_managed_object& operator=(python_managed_object&& other) noexcept
  {
    if (this != &other)
    {
      Py_XDECREF(pyobj);
      pyobj = other.pyobj;
      other.pyobj = Py_None;
      Py_XINCREF(Py_None);
    }
    return *this;
  }

  bool is_optional_field_present(const char* name) const
  {
    dlog("Checking if field '${name}' is present in object: ${pyobj}", (name)("pyobj", py_object_to_string(pyobj)));
    PyObject* fieldDescriptor = get_field_descriptor(name);

    if (!fieldDescriptor)
      return false;

    PyObject* label = PyObject_GetAttrString(fieldDescriptor, "label"); // New reference or nullptr
    Py_XDECREF(fieldDescriptor);

    if (!label)
      return false;

    // Check if the label corresponds to an optional field (value 1 in protobuf, 2 is required, 3 is repeated (which can be missing too))
    bool isOptional = PyLong_Check(label) && PyLong_AsLong(label) != 2;
    Py_XDECREF(label);

    if (!isOptional)
      return true; /// field is required

    // Check if the field is set
    PyObject* hasField = PyObject_CallMethod(pyobj, "HasField", "s", name);
    if (!hasField)
    {
      PyErr_Clear();
      return false;
    }

    bool isSet = PyObject_IsTrue(hasField);
    Py_DECREF(hasField);

    if (!isSet)
    {
      dlog("Field '${name}' is not set in object: ${pyobj}", (name)("pyobj", py_object_to_string(pyobj)));
    }
    else
    {
      dlog("Field '${name}' is set in object: ${pyobj}", (name)("pyobj", py_object_to_string(pyobj)));
    }

    return isSet;
  }

  // Get attribute by string key
  python_managed_object operator[](const char* key)const
  {
    // wlog("Accesing '${key}' object on PyObject: ${pyobj}", ("key", key)("pyobj", py_object_to_string(pyobj)));

    // Array check
    if (PySequence_Check(pyobj))
    {
      char* endptr = nullptr;
      long idx = std::strtol(key, &endptr, 10);
      if (endptr && *endptr == '\0')
      { // key is a valid integer string
        return this->operator[](static_cast<size_t>(idx));
      }
    }

    // MutableMapping check
    if (PyMapping_Check(pyobj))
    {
      PyObject* pykey = PyUnicode_FromString(key);
      FC_ASSERT(pykey, "Failed to convert key '${key}' to PyObject: ${pyerr}", (key)("pyerr", get_pyerr_with_clear()));

      PyObject* item = PyObject_GetItem(pyobj, pykey);
      FC_ASSERT(item, "Failed to get item ${key} from mapping: ${pyobj}: ${pyerr}", (key)("pyobj", py_object_to_string(pyobj))("pyerr", get_pyerr_with_clear()));

      Py_DECREF(pykey);
      python_managed_object ret{item};
      Py_DECREF(item);

      return ret;
    }

    // Protobuf object check
    PyObject* item = PyObject_GetAttrString(pyobj, key);
    FC_ASSERT(item, "Failed to retrieve key '${key}' to PyObject: ${pyerr}", (key)("pyobj", py_object_to_string(pyobj))("pyerr", get_pyerr_with_clear()));

    python_managed_object ret{item};
    Py_DECREF(item);

    return ret;
  }

  python_managed_object operator[](const std::string& key)const
  {
    return operator[](key.c_str());
  }

  python_managed_object operator[](size_t key)const
  {
    FC_ASSERT(PySequence_Check(pyobj), "PyObject at index '${key}' is expected to be a sequence but is an other type: ${pyobj}", (key)("pyobj", py_object_to_string(pyobj)));

    PyObject* item = PySequence_GetItem(pyobj, key);
    FC_ASSERT(item, "Failed to get item from sequence for index access: ${key}, ${pyobj}: ${pyerr}", (key)("pyobj", py_object_to_string(pyobj))("pyerr", get_pyerr_with_clear()));

    python_managed_object ret{item};
    Py_DECREF(item);
    return ret;
  }

  python_managed_object operator[](int key)const
  {
    return operator[](static_cast<size_t>(key));
  }

  bool is_undefined()const
  {
    return pyobj == Py_None;
  }

  bool is_string()const
  {
    return PyUnicode_Check(pyobj);
  }

  // Delete attribute by string key
  void del(const std::string& key)
  {
    int res = PyObject_SetAttrString(pyobj, key.c_str(), nullptr);
    FC_ASSERT(res == 0, "Failed to delete attribute '${key}' from object: ${pyobj}: ${pyerr}", (key)("pyobj", py_object_to_string(pyobj))("pyerr", get_pyerr_with_clear()));
  }

  template<typename T>
  // General case for numeric types
  T as() const {
    if constexpr (std::is_same_v<T, std::string>)
    {
      const char* s = PyUnicode_AsUTF8(pyobj);
      return s ? std::string(s) : std::string();
    }
    else if constexpr (std::is_same_v<T, bool>)
    {
      return PyObject_IsTrue(pyobj);
    }
    else
    {
      if (PyLong_Check(pyobj))
      {
        if constexpr (std::is_same_v<T, int64_t>)
          return PyLong_AsLongLong(pyobj);
        else if constexpr (std::is_same_v<T, int32_t>)
          return static_cast<int32_t>(PyLong_AsLong(pyobj));
        else if constexpr (std::is_same_v<T, int16_t>)
          return static_cast<int16_t>(PyLong_AsLong(pyobj));
        else if constexpr (std::is_same_v<T, int8_t>)
          return static_cast<int8_t>(PyLong_AsLong(pyobj));
        else if constexpr (std::is_same_v<T, uint64_t>)
          return PyLong_AsUnsignedLongLong(pyobj);
        else if constexpr (std::is_same_v<T, uint32_t>)
          return static_cast<uint32_t>(PyLong_AsUnsignedLong(pyobj));
        else if constexpr (std::is_same_v<T, uint16_t>)
          return static_cast<uint16_t>(PyLong_AsUnsignedLong(pyobj));
        else if constexpr (std::is_same_v<T, uint8_t>)
          return static_cast<uint8_t>(PyLong_AsUnsignedLong(pyobj));
      }
      else if (PyFloat_Check(pyobj))
      {
        return static_cast<T>(PyFloat_AsDouble(pyobj));
      }

      // Return default value for numeric type if conversion fails
      return T{};
    }
  }

  size_t array_length()const
  {
    Py_ssize_t size = PySequence_Size(pyobj);
    FC_ASSERT(size != Py_ssize_t(-1), "Failed to get array length for object ${pyobj}: ${pyerr}", ("pyobj", py_object_to_string(pyobj))("pyerr", get_pyerr_with_clear()));

    return size;
  }

  std::string get_underlying_sv_type()const
  {
    PyObject* result = PyObject_CallMethod(pyobj, "WhichOneof", "s", "value");
    FC_ASSERT(result, "Failed to call WhichOneof on object ${pyobj}: ${pyerr}", ("pyobj", py_object_to_string(pyobj))("pyerr", get_pyerr_with_clear()));

    const char* type = PyUnicode_AsUTF8(result);
    FC_ASSERT(type, "Failed to convert result of WhichOneof to string on object ${pyobj}: ${pyerr}", ("pyobj", py_object_to_string(result))("pyerr", get_pyerr_with_clear()));

    Py_DECREF(result);

    return std::string{ type };
  }

  std::vector<std::string> get_map_keys()const
  {
    std::vector<std::string> out;
    PyObject *iterator = PyObject_GetIter(pyobj);
    PyObject *item;

    FC_ASSERT(iterator != NULL, "Failed to get iterator for map keys ${pyobj}: ${pyerr}", ("pyobj", py_object_to_string(pyobj))("pyerr", get_pyerr_with_clear()));

    while ((item = PyIter_Next(iterator)))
    {
      FC_ASSERT(item, "Failed to get next item from iterator: ${pyobj}: ${pyerr}", ("pyobj", py_object_to_string(pyobj))("pyerr", get_pyerr_with_clear()));

      FC_ASSERT(PyUnicode_Check(item), "Map key '${item}' is not a string: ${pyerr}", ("item", py_object_to_string(item))("pyerr", get_pyerr_with_clear()));

      const char* key = PyUnicode_AsUTF8(item);
      FC_ASSERT(key, "Failed to convert map key '${item}' to string: ${pyerr}", ("item", py_object_to_string(item))("pyerr", get_pyerr_with_clear()));

      out.emplace_back(key);

      Py_DECREF(item);
    }

    Py_DECREF(iterator);

    return out;
  }

  // Destructor managing reference counting.
  ~python_managed_object()
  {
    if (pyobj)
      Py_XDECREF(pyobj);
  }

private:
  PyObject* get_field_descriptor(const char* name) const
  {
    if (!PyObject_HasAttrString(pyobj, "DESCRIPTOR"))
      return nullptr;

    PyObject* descriptorItem = PyObject_GetAttrString(pyobj, "DESCRIPTOR");
    if (!descriptorItem)
      return nullptr;

    //dlog("descriptorItem found");

    PyObject* fields_by_name = PyObject_GetAttrString(descriptorItem, "fields_by_name");

    Py_XDECREF(descriptorItem);

    if (!fields_by_name)
      return nullptr;

    PyObject* fieldDesc = PyMapping_GetItemString(fields_by_name, name);
    Py_XDECREF(fields_by_name);

    return fieldDesc;
  }

  private:
  PyObject* pyobj;
};

template class protocol_impl<foundation>;
template class proto_protocol_impl<foundation>;

result proto_protocol::cpp_pass_pure_transaction(PyObject* tx)
{
  result retval;

  try
  {
    hive::protocol::signed_transaction obj;

    fc::reflector< hive::protocol::signed_transaction >::visit(
      val_protocol_visitor< python_managed_object, hive::protocol::signed_transaction >{ python_managed_object{ tx }, obj, true }
    );

    retval.content = fc::json::to_string(obj);
  }
  catch (const fc::exception& e)
  {
    retval.value = error_code::fail;
    retval.exception_message = e.to_detail_string();
  }
  catch (const std::exception& e)
  {
    retval.value = error_code::fail;
    retval.exception_message = e.what();
  }
  catch (...)
  {
    retval.value = error_code::fail;
    retval.exception_message = "Unknown error occurred";
  }

  return retval;
}

} // namespace cpp
