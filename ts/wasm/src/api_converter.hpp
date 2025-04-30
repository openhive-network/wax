#pragma once

#include <hive/protocol/authority.hpp>
#include <hive/protocol/asset.hpp>
#include <boost/container/flat_map.hpp>
#include <fc/static_variant.hpp>
#include <fc/reflect/reflect.hpp>
#include <emscripten/val.h>
#include <type_traits>

namespace cpp {

namespace {
  template< typename T >
  struct to_api_converter
  {
    static void call(emscripten::val, const char*);
  };
}

template< typename T >
class to_api_visitor {
public:
  to_api_visitor( emscripten::val jsval )
    : jsval( jsval )
  {}

  template< typename Member, class Class, Member( Class::*member ) >
  void operator()( const char* key ) const
  {
    if (jsval[key].isUndefined())
      return;

    add< Member >( key );
  }

  template<typename M>
  void add( const char* key ) const
  {
    to_api_converter<M>::call( jsval, key );
  }

private:
  emscripten::val jsval;
};

namespace {
template< typename T >
void to_api_converter<T>::call(emscripten::val jsval, const char* key) {
  if constexpr( std::is_same< typename fc::reflector< T >::is_defined, fc::true_type >::value )
  {
    fc::reflector< T >::visit( to_api_visitor< T >{ jsval[key] } );
  }
}

template<typename T>
struct to_api_converter<fc::optional<T>>
{
  static void call(emscripten::val jsval, const char* key)
  {
    if constexpr( std::is_same< typename fc::reflector< T >::is_defined, fc::true_type >::value )
    {
      if (jsval[key].isUndefined())
        return;

      fc::reflector< T >::visit( to_api_visitor< T >{ jsval[key] } );
    }
  }
};

class sv_to_api
{
public:
  using result_type = void;

  sv_to_api(emscripten::val jsval)
    : jsval(jsval)
  {}

  template<typename T>
  result_type operator()( T& )const
  {
    fc::reflector< T >::visit( to_api_visitor< T >{ jsval } );
  }

private:
  emscripten::val jsval;
};

template< typename T, typename... A >
struct to_api_converter<std::vector<T, A...>>
{
  static void call(emscripten::val jsval, const char* key)
  {
    emscripten::val arr_val = jsval[key];

    uint32_t arr_size = arr_val["length"].as<uint32_t>();

    for (uint32_t i = 0; i < arr_size; ++i)
    {
      to_api_converter<T>::call( arr_val, std::to_string(i).c_str() );
    }
  }
};

template<typename M>
struct to_api_converter<boost::container::flat_map<M, hive::protocol::weight_type>>
{
  static void call(emscripten::val jsval, const char* key)
  {
    emscripten::val arr_val = jsval[key];

    std::vector<emscripten::val> out;

    emscripten::val keys = emscripten::val::global("Object").call<emscripten::val>("keys", arr_val);
    uint32_t count = keys["length"].as<uint32_t>();

    for (uint32_t i = 0; i < count; ++i)
    {
      emscripten::val _key = keys[i];
      std::vector<emscripten::val> items{ _key, arr_val[_key] };
      out.emplace_back(emscripten::val::array(items.begin(), items.end()));
    }

    jsval.set(key, emscripten::val::array(out.begin(), out.end()));
  }
};

template<>
struct to_api_converter<boost::container::flat_map<std::string, std::vector<char>>>
{
  static void call(emscripten::val jsval, const char* key)
  {
    emscripten::val arr_val = jsval[key];

    std::vector<emscripten::val> out;

    emscripten::val keys = emscripten::val::global("Object").call<emscripten::val>("keys", arr_val);
    uint32_t count = keys["length"].as<uint32_t>();

    for (uint32_t i = 0; i < count; ++i)
    {
      emscripten::val _key = keys[i];
      std::vector<emscripten::val> items{ _key, arr_val[_key] };
      out.emplace_back(emscripten::val::array(items.begin(), items.end()));
    }

    jsval.set(key, emscripten::val::array(out.begin(), out.end()));
  }
};

template< typename... Ts >
struct to_api_converter<fc::static_variant< Ts... >>
{
  static void call(emscripten::val jsval, const char* key)
  {
    static std::map< std::string, int64_t > to_tag = []()
    {
      std::map< std::string, int64_t > name_map;
      for( int i = 0; i < fc::static_variant<Ts...>::count(); ++i )
      {
        std::string n;
        fc::get_static_variant_name visitor{n};
        fc::static_variant<Ts...> tmp{static_cast<int64_t>(i), visitor};
        name_map[n] = i;
      }
      return name_map;
    }();

    emscripten::val obj_val = jsval[key];

    int64_t which = -1;
    emscripten::val nextval;
    emscripten::val _key;

    emscripten::val keys = emscripten::val::global("Object").call<emscripten::val>("keys", obj_val);
    uint32_t count = keys["length"].as<uint32_t>();

    for (uint32_t i = 0; i < count; ++i)
    {
      _key = keys[i];
      std::string key = _key.as<std::string>();

      emscripten::val el = obj_val[key];

      if (el.isUndefined())
        continue;

      const auto it = to_tag.find(key);
      if (it == to_tag.end())
        continue; // Allow to pass invalid values as JS may add custom properties

      which = it->second;
      nextval = el;
      break;
    }

    FC_ASSERT( which != -1, "Could not find the supported property in static variant" );

    obj_val.set("type", _key);
    obj_val.set("value", nextval);
    obj_val.delete_(_key);

    sv_to_api visitor{nextval};
    fc::static_variant<Ts...>{which, visitor};
  }
};

// Override some conflicting types
template<>
struct to_api_converter<hive::protocol::asset_symbol_type>
{
  static void call(emscripten::val, const char*) {}
};
}

} // namespac cpp
