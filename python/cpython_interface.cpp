#include "cpython_interface.hpp"

#include "core/protocol_impl.inl"
#include "core/protobuf_protocol_impl.inl"
#include "core/val_protocol.hpp"

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
    : pyobj(obj)
  {
    Py_INCREF(pyobj);
  }

  python_managed_object(const std::string& str)
    : pyobj(PyUnicode_FromString(str.c_str()))
  {}

  static python_managed_object array(const std::vector<python_managed_object>& vec)
  {
    PyObject* list = PyList_New(vec.size());
    for (size_t i = 0; i < vec.size(); ++i)
    {
      Py_INCREF(vec[i].pyobj);
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

  // Get attribute by string key
  python_managed_object operator[](const char* key)const
  {
    PyObject* item = PyObject_GetAttrString(pyobj, key);
    if (!item)
    {
      dlog("operator[]: ${key} not found", ("key", key));
      PyErr_Clear();
      Py_RETURN_NONE;
    }
    dlog("operator[]: ${key} found", ("key", key));
    return python_managed_object{item};
  }

  python_managed_object operator[](const std::string& key)const
  {
    return operator[](key.c_str());
  }

  python_managed_object operator[](size_t key)const
  {
    if (!PyList_Check(pyobj)) {
      dlog("operator[]: pyobj is not a list for index access");
      Py_RETURN_NONE;
    }
    PyObject* item = PyList_GetItem(pyobj, key);
    if (!item)
    {
      Py_RETURN_NONE;
    }
    Py_INCREF(item);
    return python_managed_object{item};
  }

  python_managed_object operator[](int key)const
  {
    return operator[](static_cast<size_t>(key));
  }

  bool is_undefined()const
  {
    dlog("is_undefined: ${obj}", ("obj", pyobj == Py_None));
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
      return PyUnicode_AsUTF8(pyobj);
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
    if (!PyList_Check(pyobj)) {
      dlog("array_length: pyobj is not a list");
      return 0;
    }
    return PyList_Size(pyobj);
  }

  std::vector<std::string> keys()const
  {
    std::vector<std::string> out;
    // fallback: try to get __dict__ keys if available
    PyObject* dict = PyObject_GetAttrString(pyobj, "__dict__");
    if (dict && PyDict_Check(dict))
    {
      PyObject* keys = PyDict_Keys(dict);
      if (PyList_Check(keys)) {
        size_t count = PyList_Size(keys);
        for (size_t i = 0; i < count; ++i)
        {
          PyObject* item = PyList_GetItem(keys, i);
          out.push_back(PyUnicode_AsUTF8(item));
        }
      }
      Py_XDECREF(keys);
    }
    Py_XDECREF(dict);
    return out;
  }

  // Destructor managing reference counting.
  ~python_managed_object()
  {
    Py_XDECREF(pyobj);
  }
private:
  PyObject* pyobj;
};

template class protocol_impl<foundation>;
template class proto_protocol_impl<foundation>;

result proto_protocol::cpp_pass_pure_transaction(PyObject* tx)
{
  result retval;

  auto other = PyObject_GetAttrString(tx, "expiration");
  if (other != nullptr) {
    const char* str = nullptr;
    PyObject* str_obj = nullptr;

    if (PyUnicode_Check(other)) {
      str = PyUnicode_AsUTF8(other);
    } else {
      str_obj = PyObject_Str(other);
      if (str_obj != nullptr) {
        str = PyUnicode_AsUTF8(str_obj);
      }
    }

    dlog("expiration: ${exp}", ("exp", str ? str : "unknown"));

    if (str_obj) {
      Py_DECREF(str_obj);
    }
    Py_DECREF(other);
  } else {
    dlog("expiration attribute not found");
  }

  try
  {
    hive::protocol::signed_transaction obj;

    fc::reflector< hive::protocol::signed_transaction >::visit(
      val_protocol_visitor< python_managed_object, hive::protocol::signed_transaction >{ python_managed_object{ tx }, obj, true }
    );

    dlog("transaction serialized C++: ${tx}", ("tx", obj));
  }
  catch (...)
  {
    elog("Failed to serialize transaction");
    if (PyErr_Occurred()) {
      PyErr_Print();
    }
    return retval;
  }

  PyObject* attributes = PyObject_Dir(tx); // Get a list of attribute names
  if (attributes == nullptr || !PyList_Check(attributes))
  {
    PyErr_SetString(PyExc_TypeError, "Failed to get attributes from transaction object");
    elog("Failed to get attributes from transaction object");
    Py_XDECREF(attributes);
    return retval;
  }

  Py_ssize_t numAttributes = PyList_Size(attributes);
  for (Py_ssize_t i = 0; i < numAttributes; ++i)
  {
    PyObject* attrName = PyList_GetItem(attributes, i); // Borrowed reference
    if (attrName == nullptr || !PyUnicode_Check(attrName))
    {
      continue;
    }

    const char* attrNameStr = PyUnicode_AsUTF8(attrName);
    if (attrNameStr == nullptr)
    {
      continue;
    }

    PyObject* attrValue = PyObject_GetAttrString(tx, attrNameStr);
    if (attrValue != nullptr)
    {
      // Process the attribute value (e.g., log it or store it in retval)
      ilog("Attribute: ${a}", ("a", attrNameStr));
      Py_DECREF(attrValue);
    }
  }

  Py_DECREF(attributes);
  return retval;
}

} // namespace cpp
