#include "cpython_interface.hpp"

#include "core/protocol_impl.inl"
#include "core/protobuf_protocol_impl.inl"
#include "core/val_protocol.hpp"

void check_for_error()
{
  if (PyErr_Occurred())
  {
    PyErr_Print();
    PyErr_Clear();
  }
}

std::string py_object_to_string(PyObject* obj)
{
  if (!obj)
    return "<null PyObject>";

  check_for_error();

  PyObject* str_obj = PyObject_Str(obj);
  if (str_obj)
  {
    const char* cstr = PyUnicode_AsUTF8(str_obj);
    std::string result = cstr ? cstr : "<unprintable PyObject>";
    Py_DECREF(str_obj);
    return result;
  }
  else
  {
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
    Py_INCREF(pyobj);
  }

  python_managed_object(PyObject* obj)
    : pyobj(obj ? obj : Py_None)
  {
    Py_INCREF(pyobj);
  }

  python_managed_object(const std::string& str)
    : pyobj(PyUnicode_FromString(str.c_str()))
  {}

  python_managed_object(const python_managed_object& other)
    : pyobj(other.pyobj)
  {
    Py_INCREF(pyobj);
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
    Py_INCREF(Py_None);
  }

  python_managed_object& operator=(python_managed_object&& other) noexcept
  {
    if (this != &other)
    {
      Py_XDECREF(pyobj);
      pyobj = other.pyobj;
      other.pyobj = Py_None;
      Py_INCREF(Py_None);
    }
    return *this;
  }

  static python_managed_object array(const std::vector<python_managed_object>& vec)
  {
    PyObject* list = PyList_New(vec.size());
    for (size_t i = 0; i < vec.size(); ++i)
    {
      Py_INCREF(vec[i].pyobj); // PyList_SET_ITEM steals a reference, so INCREF first
      PyList_SET_ITEM(list, i, vec[i].pyobj);
    }
    return python_managed_object{list};
  }

  static python_managed_object object() {
    return python_managed_object(PyDict_New());
  }

  // Set attribute by python_managed_object key (fallback to dict)
  void set(const python_managed_object& key, const python_managed_object& obj)
  {
    if (PyUnicode_Check(key.pyobj)) {
      const char* attr = PyUnicode_AsUTF8(key.pyobj);
      if (attr)
      {
        PyObject_SetAttrString(pyobj, attr, obj.pyobj);
        return;
      }
    }
    // fallback: set as dict item
    PyDict_SetItem(pyobj, key.pyobj, obj.pyobj);
  }

  // Set attribute by string key
  void set(const char* key, const python_managed_object& obj)
  {
    PyObject_SetAttrString(pyobj, key, obj.pyobj);
  }

  void set(const char* key, const std::string& obj)
  {
    PyObject* py_val = PyUnicode_FromString(obj.c_str());
    PyObject_SetAttrString(pyobj, key, py_val);
    Py_XDECREF(py_val);
  }

  bool is_optional_field_present(const char* name) const
  {
    dlog("Checking if field '${name}' is present in object: ${pyobj}", ("name", name)("pyobj", py_object_to_string(pyobj)));
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
      dlog("Field '${name}' is not set in object: ${pyobj}", ("name", name)("pyobj", py_object_to_string(pyobj)));
    }
    else
    {
      dlog("Field '${name}' is set in object: ${pyobj}", ("name", name)("pyobj", py_object_to_string(pyobj)));
    }

    return isSet;
  }

  // Get attribute by string key
  python_managed_object operator[](const char* key)const
  {
    wlog("Accesing '${key}' object on PyObject: ${pyobj}", ("key", key)("pyobj", py_object_to_string(pyobj)));

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
    PyObject* item = PyObject_GetAttrString(pyobj, key); // New reference or nullptr
    if (item)
    {
      dlog("operator[]: ${key} found as attribute: ${pyobj}", ("key", key)("pyobj", py_object_to_string(item)));
      python_managed_object ret{item};
      Py_DECREF(item); // python_managed_object ctor INCREFs, so DECREF here to balance
      return ret;
    }

    PyErr_Clear();

    dlog("operator[]: attribute ${key} not found on object", ("key", key));
    return python_managed_object{}; // Return None object for non-existent attributes
  }

  python_managed_object operator[](const std::string& key)const
  {
    return operator[](key.c_str());
  }

  python_managed_object operator[](size_t key)const
  {
    if (!PyList_Check(pyobj))
    {
      FC_ASSERT(PySequence_Check(pyobj), "operator[]: pyobj is not a list nor a sequence for index access: ${key}", ("key", key));

      // Try to get the item as a sequence
      PyObject* item = PySequence_GetItem(pyobj, key); // New reference
      if (!item)
      {
        PyErr_Clear();
        FC_ASSERT(false, "operator[]: Failed to get item from sequence for index access: ${key}", ("key", key));
      }
      dlog("operator[]: ${key} found: ${pyobj}", ("key", key)("pyobj", py_object_to_string(item)));

      python_managed_object ret{item};
      Py_DECREF(item); // python_managed_object ctor INCREFs, so DECREF here to balance
      return ret;
    }

    PyObject* item = PyList_GetItem(pyobj, key); // Borrowed reference
    FC_ASSERT(item, "operator[]: item is null for index access: ${key}", ("key", key));

    Py_INCREF(item); // We need to own a reference for python_managed_object
    return python_managed_object{item};
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
    if (res != 0)
    {
      PyErr_Clear();
    }
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
    if (!PySequence_Check(pyobj))
    {
      if (PyList_Check(pyobj))
      {
        size_t size = PyList_Size(pyobj);

        dlog("pyobj is a list: ${size}", ("size", size));

        return size;
      }

      FC_ASSERT(false, "pyobj is not a list or sequence");
    }

    size_t size = PySequence_Size(pyobj);

    dlog("pyobj is a sequence: ${size}", ("size", size));

    return size;
  }

  std::string get_underlying_sv_type()const
  {
    PyObject* result = PyObject_CallMethod(pyobj, "WhichOneof", "s", "value");

    if (!result)
    {
      PyErr_Print();
      PyErr_Clear();
      FC_ASSERT(false, "Failed to call WhichOneof on object");
    }
    else
    {
      std::string type = PyUnicode_AsUTF8(result);

      Py_DECREF(result);

      return type;
    }
  }

  std::vector<std::string> get_map_keys()const
  {
    std::vector<std::string> out;
    // Try to get 'props' attribute, which is likely a ScalarMap
    PyObject* props = PyObject_GetAttrString(pyobj, "props"); // New reference or nullptr
    if (props)
    {
      // ScalarMap supports the mapping protocol, so PyMapping_Check is true
      if (PyMapping_Check(props))
      {
        PyObject* keys = PyMapping_Keys(props); // New reference or nullptr
        if (keys && PyList_Check(keys))
        {
          Py_ssize_t count = PyList_Size(keys);
          out.reserve(count);
          for (Py_ssize_t i = 0; i < count; ++i)
          {
            PyObject* item = PyList_GetItem(keys, i); // Borrowed reference
            if (PyUnicode_Check(item))
            {
              const char* s = PyUnicode_AsUTF8(item);
              if (s)
                out.emplace_back(s);
            }
          }
        }
        Py_XDECREF(keys);
      }
      Py_XDECREF(props);
    }
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

    dlog("transaction serialized C++: ${tx}", ("tx", obj));
  }
  catch (const fc::exception& e)
  {
    elog("Failed to serialize transaction: ${e}", ("e", e.to_detail_string()));
    return retval;
  }
  catch (const std::exception& e)
  {
    elog("Failed to serialize transaction: ${e}", ("e", e.what()));
    return retval;
  }
  catch (...)
  {
    elog("Failed to serialize transaction");
    if (PyErr_Occurred())
      PyErr_Print();
    return retval;
  }

  return retval;
}

} // namespace cpp
