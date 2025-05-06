#include "cpython_interface.hpp"

#include "core/protocol_impl.inl"
#include "core/protobuf_protocol_impl.inl"

namespace cpp
{

template class protocol_impl<foundation>;
template class proto_protocol_impl<foundation>;

result proto_protocol::cpp_pass_pure_transaction(PyObject* tx)
{
  result retval;

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
