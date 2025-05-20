#pragma once

#include <hive/protocol/authority.hpp>
#include <hive/protocol/asset.hpp>
#include <boost/container/flat_map.hpp>
#include <fc/static_variant.hpp>
#include <fc/reflect/reflect.hpp>
#include <type_traits>

namespace cpp {

namespace {
  template<typename ManagedObjectT, typename T>
  struct to_api_converter
  {
    static void call(ManagedObjectT, const char*);
  };
}

template<typename ManagedObjectT, typename T>
class to_api_visitor {
public:
  to_api_visitor( ManagedObjectT jsval )
    : jsval( jsval )
  {}

  template< typename Member, class Class, Member( Class::*member ) >
  void operator()( const char* key ) const
  {
    add< Member >( key );
  }

  template<typename M>
  void add( const char* key ) const
  {
    to_api_converter<ManagedObjectT, M>::call( jsval, key );
  }

private:
  ManagedObjectT jsval;
};

namespace {
template<typename ManagedObjectT, typename T>
void to_api_converter<ManagedObjectT, T>::call(ManagedObjectT jsval, const char* key) {
  if constexpr( std::is_same< typename fc::reflector< T >::is_defined, fc::true_type >::value )
  {
    fc::reflector< T >::visit( to_api_visitor< ManagedObjectT, T >{ jsval[key] } );
  }
}

template<typename ManagedObjectT, typename T>
struct to_api_converter<ManagedObjectT, fc::optional<T>>
{
  static void call(ManagedObjectT jsval, const char* key)
  {
    if constexpr( std::is_same< typename fc::reflector< T >::is_defined, fc::true_type >::value )
    {
      if(jsval.is_optional_field_present(key))
        fc::reflector< T >::visit( to_api_visitor< ManagedObjectT, T >{ jsval[key] } );
    }
  }
};

template<typename ManagedObjectT>
class sv_to_api
{
public:
  using result_type = void;

  sv_to_api(ManagedObjectT jsval)
    : jsval(jsval)
  {}

  template<typename T>
  result_type operator()( T& )const
  {
    fc::reflector< T >::visit( to_api_visitor< ManagedObjectT, T >{ jsval } );
  }

private:
ManagedObjectT jsval;
};

template<typename ManagedObjectT, typename T>
struct to_api_converter<ManagedObjectT, boost::container::flat_set<T>>
{
  static void call(ManagedObjectT jsval, const char* key)
  {
    ManagedObjectT arr_val = jsval[key];

    auto arr_size = arr_val.array_length();

    for (size_t i = 0; i < arr_size; ++i)
    {
      to_api_converter<ManagedObjectT, T>::call( arr_val, std::to_string(i).c_str() );
    }
  }
};

template<typename ManagedObjectT, typename T, typename... A>
struct to_api_converter<ManagedObjectT, std::vector<T, A...>>
{
  static void call(ManagedObjectT jsval, const char* key)
  {
    ManagedObjectT arr_val = jsval[key];

    auto arr_size = arr_val.array_length();

    for (size_t i = 0; i < arr_size; ++i)
    {
      to_api_converter<ManagedObjectT, T>::call( arr_val, std::to_string(i).c_str() );
    }
  }
};

template<typename ManagedObjectT, typename M>
struct to_api_converter<ManagedObjectT, boost::container::flat_map<M, hive::protocol::weight_type>>
{
  static void call(ManagedObjectT jsval, const char* key)
  {
    ManagedObjectT arr_val = jsval[key];

    std::vector<ManagedObjectT> out;

    for (const auto& _key : arr_val.get_map_keys())
    {
      std::vector<ManagedObjectT> items{ ManagedObjectT{ _key }, ManagedObjectT{ arr_val[_key] } };
      out.emplace_back(ManagedObjectT::array(items));
    }

    jsval.set(key, ManagedObjectT::array(out));
  }
};

template<typename ManagedObjectT>
struct to_api_converter<ManagedObjectT, boost::container::flat_map<std::string, std::vector<char>>>
{
  static void call(ManagedObjectT jsval, const char* key)
  {
    ManagedObjectT arr_val = jsval[key];

    std::vector<ManagedObjectT> out;

    for (const auto& _key : arr_val.get_map_keys())
    {
      std::vector<ManagedObjectT> items{ ManagedObjectT{ _key }, ManagedObjectT{ arr_val[_key] } };
      out.emplace_back(ManagedObjectT::array(items));
    }

    jsval.set(key, ManagedObjectT::array(out));
  }
};

template<typename ManagedObjectT, typename... Ts>
struct to_api_converter<ManagedObjectT, fc::static_variant< Ts... >>
{
  static void call(ManagedObjectT jsval, const char* key)
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

    ManagedObjectT obj_val = jsval[key];

    const std::string nextkey = obj_val.get_underlying_sv_type();

    ManagedObjectT nextval = obj_val[nextkey];

    const auto it = to_tag.find(nextkey);
    FC_ASSERT( it != to_tag.end(), "Could not find the supported property in static variant: ${nextkey}", ("nextkey", nextkey) );

    int64_t which = it->second;

    obj_val.set("type", nextkey);
    obj_val.set("value", nextval);
    obj_val.del(nextkey);

    sv_to_api visitor{nextval};
    fc::static_variant<Ts...>{which, visitor};
  }
};

// Override some conflicting types
template<typename ManagedObjectT>
struct to_api_converter<ManagedObjectT, hive::protocol::asset_symbol_type>
{
  static void call(ManagedObjectT, const char*) {}
};
}

} // namespac cpp
