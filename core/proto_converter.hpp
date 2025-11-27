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
  struct to_proto_converter
  {
    static void call(ManagedObjectT, const char*, bool);
  };
}

template<typename ManagedObjectT, typename T>
class to_proto_visitor {
public:
  to_proto_visitor( ManagedObjectT jsval, bool is_legacy )
    : jsval( jsval ), is_legacy( is_legacy )
  {}

  template< typename Member, class Class, Member( Class::*member ) >
  void operator()( const char* key ) const
  {
    add< Member >( key );
  }

  template<typename M>
  void add( const char* key ) const
  {
    to_proto_converter<ManagedObjectT, M>::call( jsval, key, is_legacy );
  }

private:
  ManagedObjectT jsval;
  bool is_legacy;
};

namespace {
template<typename ManagedObjectT, typename T>
void to_proto_converter<ManagedObjectT, T>::call(ManagedObjectT jsval, const char* key, bool is_legacy) {
  if constexpr( std::is_same< typename fc::reflector< T >::is_defined, fc::true_type >::value )
  {
    fc::reflector< T >::visit( to_proto_visitor< ManagedObjectT, T >{ jsval[key], is_legacy } );
  }
}

namespace
{
  template<typename ManagedObjectT>
  void apply_new_serialization(ManagedObjectT jsval, const char* key, const hive::protocol::asset& asset_data)
  {
    ManagedObjectT newval = ManagedObjectT::object();
    newval.set("amount", boost::lexical_cast< std::string >( asset_data.amount.value ));
    newval.set("precision", uint32_t( asset_data.symbol.decimals() ));
    newval.set("nai", asset_data.symbol.to_nai_string());
    jsval.del(key);
    jsval.set(key, newval);
  }
}

template<typename ManagedObjectT, uint32_t _SYMBOL>
struct to_proto_converter<ManagedObjectT, hive::protocol::tiny_asset<_SYMBOL>>
{
  static void call(ManagedObjectT jsval, const char* key, bool is_legacy)
  { // We have to transform the asset when in legacy mode
    if (is_legacy)
    {
      hive::protocol::asset asset_data = hive::protocol::legacy_asset::from_string( jsval[key].template as<std::string>() );

      apply_new_serialization(jsval, key, asset_data);
    }
  }
};

template<typename ManagedObjectT>
struct to_proto_converter<ManagedObjectT, hive::protocol::legacy_hive_asset>
{
  static void call(ManagedObjectT jsval, const char* key, bool is_legacy)
  { // We have to transform the asset when in legacy mode
    if (is_legacy)
    {
      hive::protocol::asset asset_data = hive::protocol::legacy_asset::from_string( jsval[key].template as<std::string>() );

      apply_new_serialization(jsval, key, asset_data);
    }
  }
};

template<typename ManagedObjectT>
struct to_proto_converter<ManagedObjectT, hive::protocol::asset>
{
  static void call(ManagedObjectT jsval, const char* key, bool is_legacy)
  { // We have to transform the asset when in legacy mode
    if (is_legacy)
    {
      hive::protocol::asset asset_data = hive::protocol::legacy_asset::from_string( jsval[key].template as<std::string>() );

      apply_new_serialization(jsval, key, asset_data);
    }
  }
};

template<typename ManagedObjectT, typename T>
struct to_proto_converter<ManagedObjectT, fc::optional<T>>
{
  static void call(ManagedObjectT jsval, const char* key, bool is_legacy)
  {
    if constexpr( std::is_same< typename fc::reflector< T >::is_defined, fc::true_type >::value )
    {
      if(jsval.is_optional_field_present(key))
        fc::reflector< T >::visit( to_proto_visitor< ManagedObjectT, T >{ jsval[key], is_legacy } );
    }
  }
};

template<typename ManagedObjectT>
class sv_to_proto
{
public:
  using result_type = void;

  sv_to_proto(ManagedObjectT jsval, bool is_legacy)
    : jsval(jsval), is_legacy( is_legacy )
  {}

  template<typename T>
  result_type operator()( T& )const
  {
    fc::reflector< T >::visit( to_proto_visitor< ManagedObjectT, T >{ jsval, is_legacy } );
  }

private:
  ManagedObjectT jsval;
  bool is_legacy;
};

template<typename ManagedObjectT, typename M>
struct to_proto_converter<ManagedObjectT, boost::container::flat_map<M, hive::protocol::weight_type>>
{
  static void call(ManagedObjectT jsval, const char* key, bool)
  {
    ManagedObjectT arr_val = jsval[key];

    ManagedObjectT obj_val = ManagedObjectT::object();

    auto arr_size = arr_val.array_length();

    for (size_t i = 0; i < arr_size; ++i)
    {
      ManagedObjectT in_val = arr_val[i];
      obj_val.set(in_val[0], in_val[1]);
    }

    jsval.set(key, obj_val);
  }
};

template<typename ManagedObjectT>
struct to_proto_converter<ManagedObjectT, boost::container::flat_map<std::string, std::vector<char>>>
{
  static void call(ManagedObjectT jsval, const char* key, bool)
  {
    ManagedObjectT arr_val = jsval[key];

    ManagedObjectT obj_val = ManagedObjectT::object();

    auto arr_size = arr_val.array_length();

    for (size_t i = 0; i < arr_size; ++i)
    {
      ManagedObjectT in_val = arr_val[i];
      obj_val.set(in_val[0], in_val[1]);
    }

    jsval.set(key, obj_val);
  }
};

template<typename ManagedObjectT, typename T>
struct to_proto_converter<ManagedObjectT, boost::container::flat_set<T>>
{
  static void call(ManagedObjectT jsval, const char* key, bool is_legacy)
  {
    ManagedObjectT arr_val = jsval[key];

    auto arr_size = arr_val.array_length();

    for (size_t i = 0; i < arr_size; ++i)
    {
      to_proto_converter<ManagedObjectT, T>::call( arr_val, std::to_string(i).c_str(), is_legacy );
    }
  }
};

template<typename ManagedObjectT, typename T, typename... A>
struct to_proto_converter<ManagedObjectT, std::vector<T, A...>>
{
  static void call(ManagedObjectT jsval, const char* key, bool is_legacy)
  {
    ManagedObjectT arr_val = jsval[key];

    auto arr_size = arr_val.array_length();

    for (size_t i = 0; i < arr_size; ++i)
    {
      to_proto_converter<ManagedObjectT, T>::call( arr_val, std::to_string(i).c_str(), is_legacy );
    }
  }
};

template<typename ManagedObjectT, typename... Ts>
struct to_proto_converter<ManagedObjectT, fc::static_variant< Ts... >>
{
  static void call(ManagedObjectT jsval, const char* key, bool is_legacy)
  {
    ManagedObjectT obj_val = jsval[key];
    ManagedObjectT nextval;

    int64_t which = -1;

    if (is_legacy)
    {
      static std::map< std::string, int64_t > to_legacy_tag = []()
      {
          std::map< std::string, int64_t > name_map;
          for( int i = 0; i < fc::static_variant<Ts...>::count(); ++i )
          {
            std::string n;
            fc::get_legacy_static_variant_name  visitor( n );
            fc::static_variant<Ts...> tmp( i, visitor );
            name_map[n] = i;
          }
          return name_map;
      }();
      static std::map< int64_t, std::string > to_op_name = []()
      {
        std::map< int64_t, std::string > name_map;
        for( int i = 0; i < fc::static_variant<Ts...>::count(); ++i )
        {
          std::string n;
          fc::get_static_variant_name visitor{n};
          fc::static_variant<Ts...> tmp{static_cast<int64_t>(i), visitor};
          name_map[i] = n;
        }
        return name_map;
      }();

      ManagedObjectT type_val = obj_val[0];
      nextval = obj_val[1];

      // In legacy form, type can be either number or string
      if( type_val.is_string() )
      {
        std::string type_str = type_val.template as<std::string>();

        auto itr = to_legacy_tag.find( type_str );
        FC_ASSERT( itr != to_legacy_tag.end(), "Invalid object name: ${n}", ("n", type_str) );
        which = itr->second;
      }
      else
      {
        which = type_val.template as<int64_t>();
      }

      auto itr = to_op_name.find( which );
      FC_ASSERT( itr != to_op_name.end(), "Invalid object type: ${n}", ("n", which) );

      ManagedObjectT newval = ManagedObjectT::object();
      newval.set(itr->second.c_str(), nextval);
      jsval.del(key);
      jsval.set(key, newval);
    }
    else
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

      ManagedObjectT type_val = obj_val["type"];
      nextval = obj_val["value"];

      std::string type;
      type_val.as(type);
      auto itr = to_tag.find( type );
      FC_ASSERT( itr != to_tag.end(), "Invalid object name: ${n}", ("n", type) );
      which = itr->second;

      obj_val.set(type_val, nextval);
      obj_val.del("type");
      obj_val.del("value");
    }

    sv_to_proto visitor{nextval, is_legacy};
    fc::static_variant<Ts...>{which, visitor};
  }
};

// Override some conflicting types
template<typename ManagedObjectT>
struct to_proto_converter<ManagedObjectT, hive::protocol::asset_symbol_type>
{
  static void call(ManagedObjectT, const char*, bool) {}
};
}

} // namespac cpp
