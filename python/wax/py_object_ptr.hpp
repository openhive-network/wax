#pragma once

#include <Python.h>

/**
 * Class responsible for holding a python object reference and managing its ref counter.
 */
class py_object_ptr
{
public:
  /// @brief  Allows to take ownership of just built new Python object Reference.
  /// @param obj result of functions described in doc as `Return value: New reference`. If null, it will be initialized to Py_None.
  /// @return built object holding a python object reference.
  static py_object_ptr take(PyObject* obj)
  {
    return py_object_ptr(obj);
  }

  /// @brief Allows to share object being owned by someone else.
  /// @param obj i.e. passed from python engine, without explicit reference incrementation.
  /// @return built object holding a python object reference.
  static py_object_ptr share(PyObject* obj)
  {
    /// Since this ptr class always releases object at destructor, we need to increment reference counter here.
    Py_XINCREF(obj);
    return py_object_ptr(obj);
  }

  py_object_ptr(const py_object_ptr& rhs)
  : _obj(rhs._obj)
  {
    Py_XINCREF(_obj);
  }

  py_object_ptr& operator=(const py_object_ptr& other)
  {
    if(_obj != other._obj)
    {
      Py_XDECREF(_obj);
      _obj = other._obj;
      Py_XINCREF(_obj);
    }

    return *this;
  }

  py_object_ptr(py_object_ptr&& other) noexcept
    : _obj(other._obj)
  {
    other._obj = Py_None;
    Py_XINCREF(other._obj);
  }

  py_object_ptr& operator=(py_object_ptr&& other) noexcept
  {
    if(_obj != other._obj)
    {
      Py_XDECREF(_obj);
      _obj = other._obj;
      other._obj = Py_None;
      Py_XINCREF(other._obj);
    }

    return *this;
  }

  ~py_object_ptr()
  {
    Py_XDECREF(_obj);
    _obj = nullptr;
  }

  operator bool() const
  {
    return _obj != nullptr && _obj != Py_None;
  }

  operator PyObject*() const
  {
    return _obj;
  }

  PyObject* operator ->() const
  {
    return _obj;
  }

  operator std::string() const
  {
    if (!_obj)
      return "<null PyObject>";

    PyObject* str_obj = PyObject_Str(_obj);
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

  // Cython requires public access to the constructor with PyObject* as an argument
  // private:

  /// @brief  Hidden constructor to always force creation from raw PyObject through `take` method or some new one, just sharing an object.
  /// @param obj to take responsibility for.
  /// @note   If obj is nullptr, it will be initialized to Py_None.
  py_object_ptr(PyObject* obj)
    : _obj(obj)
  {
    if (_obj == nullptr)
    {
      _obj = Py_None;
      Py_XINCREF(_obj);
    }
  }

  private:
    PyObject* _obj;
};
