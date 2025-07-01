#pragma once

#include "py_object_ptr.hpp"
#include <fc/exception/exception.hpp>
#include <fc/variant.hpp>

#include <string>
#include <vector>

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

/// @brief Calls a Python function and handles the error if it occurs (clears and rethrows as a C++ exception).
/// @param func Lambda that calls the Python function and returns its result.
/// @param take If true, the result is taken ownership of as a py_object_ptr instead of shared.
/// @return The result of the Python function call as a PyObject* wrapper (py_object_ptr) or the specified return type.
/// @throws fc::assert_exception if the Python function call fails.
template<typename Func>
auto call_python_function(Func&& func, bool take = true)
-> typename std::conditional<std::is_same_v<decltype(func()), PyObject*>, py_object_ptr, decltype(func())>::type
{
  auto result = func();
  FC_ASSERT(!PyErr_Occurred(), "Python function call failed: ${pyerr}", ("pyerr", get_pyerr_with_clear()));

  if constexpr (std::is_same_v<decltype(result), PyObject*>)
    return take ? py_object_ptr::take(result) : py_object_ptr::share(result);
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

  static python_managed_object array(const std::vector<python_managed_object>& vec)
  {
    auto list = call_python_function([&] {
      return PyList_New(vec.size());
    });

    for (const auto& item : vec)
    {
      auto result = call_python_function([&] {
        return PyList_Append(list, item.pyobj);
      });
      FC_ASSERT(result == 0, "Failed to append item to Python list: ${pyerr}", ("pyerr", get_pyerr_with_clear()));
    }

    return python_managed_object{ list };
  }

  static python_managed_object object()
  {
    return python_managed_object(call_python_function([&] {
      return PyDict_New();
    }));
  }

  void set(const python_managed_object& key, const python_managed_object& obj)
  {
    FC_ASSERT(PyMapping_Check(pyobj), "PyObject is expected to be a mapping but is an other type: ${pyobj}", (pyobj));

    auto item = call_python_function([&] {
      return PyObject_SetItem(pyobj, key.pyobj, obj.pyobj);
    });

    FC_ASSERT(item == 0, "Failed to set item in Python object: ${pyerr}", ("pyerr", get_pyerr_with_clear()));
  }

  void set(const char* key, const python_managed_object& obj)
  {
    FC_ASSERT(PyMapping_Check(pyobj), "PyObject is expected to be a mapping but is an other type: ${pyobj}", (pyobj));

    auto pykey = call_python_function([&] {
      return PyUnicode_FromString(key);
    });

    auto item = call_python_function([&] {
      return PyObject_SetItem(pyobj, pykey, obj.pyobj);
    });

    FC_ASSERT(item == 0, "Failed to set item in Python object: ${pyerr}", ("pyerr", get_pyerr_with_clear()));
  }

  void set(const char* key, const std::string& obj)
  {
    FC_ASSERT(PyMapping_Check(pyobj), "PyObject is expected to be a mapping but is an other type: ${pyobj}", (pyobj));

    auto pykey = call_python_function([&] {
      return PyUnicode_FromString(key);
    });

    auto pyvalue = call_python_function([&] {
      return PyUnicode_FromString(obj.c_str());
    });

    auto item = call_python_function([&] {
      return PyObject_SetItem(pyobj, pykey, pyvalue);
    });

    FC_ASSERT(item == 0, "Failed to set item in Python object: ${pyerr}", ("pyerr", get_pyerr_with_clear()));
  }

  operator std::string() const
  {
    return pyobj.operator std::string();
  }

  python_managed_object(const python_managed_object& other) = default;
  python_managed_object& operator=(const python_managed_object& other) = default;
  python_managed_object(python_managed_object&& other) noexcept = default;
  python_managed_object& operator=(python_managed_object&& other) noexcept = default;

  bool is_optional_field_present(const char* name) const
  {
    if (PyDict_Check(pyobj))
    {
      auto key = call_python_function([&] {
        return PyUnicode_FromString(name);
      });

      auto item = call_python_function([&] {
        return PyDict_Contains(pyobj, key);
      });

      return item;
    }

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

  // Delete attribute by string key by creating a new dictionary without the specified key
  void del(const std::string& key)
  {
    FC_ASSERT(PyDict_Check(pyobj), "Not a dict. Could not delete key '${key}' from Python object: ${pyobj}", (key)(pyobj, pyobj.operator std::string()));

    call_python_function([&] {
      return PyDict_DelItemString(pyobj, key.c_str());
    });
  }

  template<typename T>
  T as() const
  {
    T out;
    as(out);
    return out;
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
    if (PyMapping_Check(pyobj))
    {
      auto keys = call_python_function([&] {
        return PyMapping_Keys(pyobj);
      });

      FC_ASSERT(keys, "Failed to get keys from Python mapping: ${pyerr}", ("pyerr", get_pyerr_with_clear()));

      auto first_key = call_python_function([&] {
        return PyList_GetItem(keys, 0);
      }, false);

      FC_ASSERT(first_key && PyUnicode_Check(first_key), "Expected a string key in static variant");

      const char* type = call_python_function([&] {
        return PyUnicode_AsUTF8(first_key);
      });

      return std::string{ type };
    }

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

} // namespace cpp
