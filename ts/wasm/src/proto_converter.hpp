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
  struct to_proto_converter
  {
    static void call(emscripten::val, const char*);
  };
}

template< typename T >
class to_proto_visitor {
public:
  to_proto_visitor( emscripten::val jsval )
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
    to_proto_converter<M>::call( jsval, key );
  }

private:
  emscripten::val jsval;
};

namespace {
template< typename T >
void to_proto_converter<T>::call(emscripten::val jsval, const char* key) {
  if constexpr( std::is_same< typename fc::reflector< T >::is_defined, fc::true_type >::value )
  {
    fc::reflector< T >::visit( to_proto_visitor< T >{ jsval[key] } );
  }
}

template<typename T>
struct to_proto_converter<fc::optional<T>>
{
  static void call(emscripten::val jsval, const char* key)
  {
    if constexpr( std::is_same< typename fc::reflector< T >::is_defined, fc::true_type >::value )
    {
      if (jsval[key].isUndefined())
        return;

      fc::reflector< T >::visit( to_proto_visitor< T >{ jsval[key] } );
    }
  }
};

class sv_to_proto
{
public:
  using result_type = void;

  sv_to_proto(emscripten::val jsval)
    : jsval(jsval)
  {}

  template<typename T>
  result_type operator()( T& )const
  {
    fc::reflector< T >::visit( to_proto_visitor< T >{ jsval } );
  }

private:
  emscripten::val jsval;
};

template<typename M>
struct to_proto_converter<boost::container::flat_map<M, hive::protocol::weight_type>>
{
  static void call(emscripten::val jsval, const char* key)
  {
    emscripten::val arr_val = jsval[key];

    emscripten::val obj_val = emscripten::val::object();

    uint32_t arr_size = arr_val["length"].as<uint32_t>();

    for (uint32_t i = 0; i < arr_size; ++i)
    {
      emscripten::val in_val = arr_val[i];
      obj_val.set(in_val[0], in_val[1]);
    }

    jsval.set(key, obj_val);
  }
};

template<>
struct to_proto_converter<boost::container::flat_map<std::string, std::vector<char>>>
{
  static void call(emscripten::val jsval, const char* key)
  {
    emscripten::val arr_val = jsval[key];

    emscripten::val obj_val = emscripten::val::object();

    uint32_t arr_size = arr_val["length"].as<uint32_t>();

    for (uint32_t i = 0; i < arr_size; ++i)
    {
      emscripten::val in_val = arr_val[i];
      obj_val.set(in_val[0], in_val[1]);
    }

    jsval.set(key, obj_val);
  }
};

template< typename T >
struct to_proto_converter<boost::container::flat_set<T>>
{
  static void call(emscripten::val jsval, const char* key)
  {
    emscripten::val arr_val = jsval[key];

    uint32_t arr_size = arr_val["length"].as<uint32_t>();

    for (uint32_t i = 0; i < arr_size; ++i)
    {
      to_proto_converter<T>::call( arr_val, std::to_string(i).c_str() );
    }
  }
};

template< typename T, typename... A >
struct to_proto_converter<std::vector<T, A...>>
{
  static void call(emscripten::val jsval, const char* key)
  {
    emscripten::val arr_val = jsval[key];

    uint32_t arr_size = arr_val["length"].as<uint32_t>();

    for (uint32_t i = 0; i < arr_size; ++i)
    {
      to_proto_converter<T>::call( arr_val, std::to_string(i).c_str() );
    }
  }
};

template< typename... Ts >
struct to_proto_converter<fc::static_variant< Ts... >>
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

    emscripten::val type_val = obj_val["type"];
    emscripten::val nextval = obj_val["value"];

    std::string type = type_val.as<std::string>();
    auto itr = to_tag.find( type );
    FC_ASSERT( itr != to_tag.end(), "Invalid object name: ${n}", ("n", type) );
    int64_t which = itr->second;

    obj_val.set(type_val, nextval);
    obj_val.delete_("type");
    obj_val.delete_("value");

    sv_to_proto visitor{nextval};
    fc::static_variant<Ts...>{which, visitor};
  }
};

// Override some conflicting types
template<>
struct to_proto_converter<hive::protocol::asset_symbol_type>
{
  static void call(emscripten::val, const char*) {}
};
}

} // namespac cpp
