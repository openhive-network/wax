#include "cpython_interface.hpp"

#include "core/protocol_impl.inl"
#include "core/protobuf_protocol_impl.inl"
#include "core/val_protocol.hpp"

namespace {
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

  private:
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

/// @brief Calls a Python function and handles the error if it occurs (clears and rethrows as a C++ exception).
/// @param func Lambda that calls the Python function and returns its result.
/// @return The result of the Python function call as a PyObject* wrapper (py_object_ptr) or the specified return type.
/// @throws fc::assert_exception if the Python function call fails.
template<typename Func>
auto call_python_function(Func&& func)
-> typename std::conditional<std::is_same_v<decltype(func()), PyObject*>, py_object_ptr, decltype(func())>::type
{
  auto result = func();
  FC_ASSERT(!PyErr_Occurred(), "Python function call failed: ${pyerr}", ("pyerr", get_pyerr_with_clear()));

  if constexpr (std::is_same_v<decltype(result), PyObject*>)
    return py_object_ptr::take(result);
  else
    return result;
}

}

namespace fc {
  void to_variant( const py_object_ptr& pyobj, variant& v )
  { // for direct FC_ASSERT py_object_ptr string conversion
    v = fc::variant{ pyobj.operator std::string() };
  }
}

namespace cpp
{
class python_managed_object
{
public:
  python_managed_object() : python_managed_object(py_object_ptr::take(nullptr))
  {
  }

  python_managed_object(const py_object_ptr& obj)
    : pyobj(obj)
  {
  }

  python_managed_object(const std::string& str)
    : python_managed_object(py_object_ptr::take(PyUnicode_FromString(str.c_str())))
  {
    FC_ASSERT(pyobj, "Failed to convert string '${str}' to PyObject: ${pyerr}", (str)("pyerr", get_pyerr_with_clear()));
  }

  python_managed_object(const python_managed_object& other) = default;
  python_managed_object& operator=(const python_managed_object& other) = default;
  python_managed_object(python_managed_object&& other) noexcept = default;
  python_managed_object& operator=(python_managed_object&& other) noexcept = default;

  bool is_optional_field_present(const char* name) const
  {
    auto fieldDescriptor = get_field_descriptor(name);

    if (!fieldDescriptor)
      return false;

    auto label = call_python_function([&] {
      return PyObject_GetAttrString(fieldDescriptor, "label");
    });

    // Check if the label corresponds to an optional field (value 1 in protobuf, 2 is required, 3 is repeated (which can be missing too))
    bool is_optional = PyLong_Check(label) && call_python_function([&] {
      return PyLong_AsLong(label);
    }) != 2;

    if (!is_optional)
      return true; /// field is required

    // Check if the field is set
    auto has_field = call_python_function([&] {
      return PyObject_CallMethod(pyobj, "HasField", "s", name);
    });
    bool is_set = call_python_function([&] {
      return PyObject_IsTrue(has_field);
    });

    return is_set;
  }

  // Get attribute by string key
  python_managed_object operator[](const char* key)const
  {
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
      auto pykey = call_python_function([&] {
        return PyUnicode_FromString(key);
      });
      auto item = call_python_function([&] {
        return PyObject_GetItem(pyobj, pykey);
      });

      return item;
    }

    // Protobuf object check
    auto item = call_python_function([&] {
      return PyObject_GetAttrString(pyobj, key);
    });

    return item;
  }

  python_managed_object operator[](const std::string& key)const
  {
    return operator[](key.c_str());
  }

  python_managed_object operator[](size_t key)const
  {
    FC_ASSERT(PySequence_Check(pyobj), "PyObject at index '${key}' is expected to be a sequence but is an other type: ${pyobj}", (key)(pyobj));

    auto item = call_python_function([&] {
      return PySequence_GetItem(pyobj, key);
    });

    return item;
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
    call_python_function([&] {
      return PyObject_SetAttrString(pyobj, key.c_str(), nullptr);
    });
  }

  void as(std::string& out)const
  {
    FC_ASSERT(is_string(), "Cannot convert object to string: ${pyobj}", (pyobj));

    const char* s = call_python_function([&] {
      return PyUnicode_AsUTF8(pyobj);
    });

    out = std::string{s};
  }

  void as(bool& out)const
  {
    out = call_python_function([&] {
      return PyObject_IsTrue(pyobj);
    });
  }

  void as(int64_t& out)const
  {
    FC_ASSERT(PyLong_Check(pyobj), "Cannot convert object to int64_t: ${pyobj}", (pyobj));

    out = call_python_function([&] {
      return PyLong_AsLongLong(pyobj);
    });
  }

  void as(int32_t& out)const
  {
    FC_ASSERT(PyLong_Check(pyobj), "Cannot convert object to int32_t: ${pyobj}", (pyobj));

    out = static_cast<int32_t>(call_python_function([&] {
      return PyLong_AsLong(pyobj);
    }));
  }

  void as(int16_t& out)const
  {
    FC_ASSERT(PyLong_Check(pyobj), "Cannot convert object to int16_t: ${pyobj}", (pyobj));

    out = static_cast<int16_t>(call_python_function([&] {
      return PyLong_AsLong(pyobj);
    }));
  }

  void as(int8_t& out)const
  {
    FC_ASSERT(PyLong_Check(pyobj), "Cannot convert object to int8_t: ${pyobj}", (pyobj));

    out = static_cast<int8_t>(call_python_function([&] {
      return PyLong_AsLong(pyobj);
    }));
  }

  void as(uint64_t& out)const
  {
    FC_ASSERT(PyLong_Check(pyobj), "Cannot convert object to uint64_t: ${pyobj}", (pyobj));

    out = call_python_function([&] {
      return PyLong_AsUnsignedLongLong(pyobj);
    });
  }

  void as(uint32_t& out)const
  {
    FC_ASSERT(PyLong_Check(pyobj), "Cannot convert object to uint32_t: ${pyobj}", (pyobj));

    out = static_cast<uint32_t>(call_python_function([&] {
      return PyLong_AsUnsignedLong(pyobj);
    }));
  }

  void as(uint16_t& out)const
  {
    FC_ASSERT(PyLong_Check(pyobj), "Cannot convert object to uint16_t: ${pyobj}", (pyobj));

    out = static_cast<uint16_t>(call_python_function([&] {
      return PyLong_AsUnsignedLong(pyobj);
    }));
  }

  void as(uint8_t& out)const
  {
    FC_ASSERT(PyLong_Check(pyobj), "Cannot convert object to uint8_t: ${pyobj}", (pyobj));

    out = static_cast<uint8_t>(call_python_function([&] {
      return PyLong_AsUnsignedLong(pyobj);
    }));
  }

  size_t array_length()const
  {
    Py_ssize_t size = call_python_function([&] {
      return PySequence_Size(pyobj);
    });

    return size;
  }

  std::string get_underlying_sv_type()const
  {
    py_object_ptr result = call_python_function([&] {
      return PyObject_CallMethod(pyobj, "WhichOneof", "s", "value");
    });
    const char* type = call_python_function([&] {
      return PyUnicode_AsUTF8(result);
    });

    return std::string{ type };
  }

  std::vector<std::string> get_map_keys()const
  {
    std::vector<std::string> out;
    auto iterator = call_python_function([&] {
      return PyObject_GetIter(pyobj);
    });

    while (auto item = call_python_function([&] {
      return PyIter_Next(iterator);
    }))
    {
      FC_ASSERT(PyUnicode_Check(item), "Map key '${item}' is not a string", (item));

      const char* key = call_python_function([&] {
        return PyUnicode_AsUTF8(item);
      });
      out.emplace_back(key);
    }

    return out;
  }

  ~python_managed_object() = default;

private:
  py_object_ptr get_field_descriptor(const char* name) const
  {
    if (!PyObject_HasAttrString(pyobj, "DESCRIPTOR"))
      return py_object_ptr::take(nullptr);

    auto descriptor_item = call_python_function([&] {
      return PyObject_GetAttrString(pyobj, "DESCRIPTOR");
    });
    if (!descriptor_item)
      return py_object_ptr::take(nullptr);

    auto fields_by_name = call_python_function([&] {
      return PyObject_GetAttrString(descriptor_item, "fields_by_name");
    });

    if (!fields_by_name)
      return py_object_ptr::take(nullptr);

    auto field_desc = call_python_function([&] {
      return PyMapping_GetItemString(fields_by_name, name);
    });
    return field_desc;
  }

  private:
  py_object_ptr pyobj;
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
      val_protocol_visitor< python_managed_object, hive::protocol::signed_transaction >{ python_managed_object{ py_object_ptr::share(tx) }, obj, true }
    );

    retval.content = obj.id(hive::protocol::pack_type::hf26).operator std::string();
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
