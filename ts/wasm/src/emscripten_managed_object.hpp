#pragma once

#include <string>
#include <vector>

#include <fc/exception/exception.hpp>

#include <emscripten/val.h>

class emscripten_managed_object
{
public:
  emscripten_managed_object()
    : jsval(emscripten::val::undefined())
  {}

  emscripten_managed_object(emscripten::val jsval)
    : jsval(jsval)
  {}

  emscripten_managed_object(const std::string& str)
    : jsval(str)
  {}

  static emscripten_managed_object array(const std::vector<emscripten_managed_object>& vec)
  {
    std::vector<emscripten::val> items;
    items.reserve(vec.size());
    for (const auto& item : vec)
      items.emplace_back(emscripten::val(item.jsval));

    return emscripten_managed_object{ emscripten::val::array(items.begin(), items.end()) };
  }

  static emscripten_managed_object object()
  {
    return emscripten_managed_object{ emscripten::val::object() };
  }

  void set(const emscripten_managed_object& key, const emscripten_managed_object& obj)
  {
    jsval.set(key.jsval, obj.jsval);
  }

  void set(const char* key, const emscripten_managed_object& obj)
  {
    jsval.set(key, obj.jsval);
  }

  void set(const char* key, uint32_t obj)
  {
    jsval.set(key, obj);
  }

  void set(const char* key, const std::string& obj)
  {
    jsval.set(key, obj);
  }

  bool is_optional_field_present(const char* name) const
  {
    return !jsval[name].isUndefined();
  }

  emscripten_managed_object operator[](const std::string& key)const
  {
    return emscripten_managed_object{ jsval.operator[](key) };
  }

  emscripten_managed_object operator[](const char* key)const
  {
    return emscripten_managed_object{ jsval.operator[](key) };
  }

  emscripten_managed_object operator[](size_t key)const
  {
    return emscripten_managed_object{ jsval.operator[](key) };
  }

  emscripten_managed_object operator[](int key)const
  {
    return emscripten_managed_object{ jsval.operator[](key) };
  }

  bool is_undefined()const
  {
    return jsval.isUndefined();
  }

  bool is_string()const
  {
    return jsval.isString();
  }

  void del(const std::string& key)
  {
    jsval.delete_(key);
  }

  template<typename T>
  void as(T& val)const
  {
    val = jsval.as<T>();
  }

  template<typename T>
  T as()const
  {
    return jsval.as<T>();
  }


  size_t array_length()const
  {
    return jsval["length"].as<size_t>();
  }

  std::string get_underlying_sv_type()const
  {
    emscripten::val keys = emscripten::val::global("Object").call<emscripten::val>("keys", jsval);
    size_t count = keys["length"].as<size_t>();
    FC_ASSERT(count > 0, "Expected a key in static variant");
    return keys[0].as<std::string>();
  }

  std::vector<std::string> get_map_keys()const
  {
    std::vector<std::string> out;

    emscripten::val keys = emscripten::val::global("Object").call<emscripten::val>("keys", jsval);
    size_t count = keys["length"].as<size_t>();

    out.resize(count);

    for (size_t i = 0; i < count; ++i)
      out[i] = keys[i].as<std::string>();

    return out;
  }

  operator std::string() const
  {
    return emscripten::val::global("JSON").call<std::string>("stringify", jsval);
  }

private:
  emscripten::val jsval;
};
