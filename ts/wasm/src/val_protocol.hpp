#pragma once

#include <hive/protocol/transaction.hpp>
#include <fc/static_variant.hpp>
#include <emscripten/val.h>
#include "core/binary_view/node_types.hpp"
#include "core/binary_view/traits.hpp"

namespace cpp {

namespace {
class val_to_static_variant
{
public:
  using result_type = void;

  val_to_static_variant(emscripten::val jsval, bool is_protobuf)
    : jsval(jsval), is_protobuf(is_protobuf)
  {}

  template<typename T>
  result_type operator()( T& v )const;

private:
  emscripten::val jsval;
  bool is_protobuf;
};
}

template< typename T >
class val_protocol_visitor {
public:
  val_protocol_visitor( emscripten::val jsval, T& val, bool is_protobuf )
    : jsval( jsval ), is_protobuf( is_protobuf ), val( val )
  {}

  template< typename Member, class Class, Member( Class::*member ) >
  void operator()( const char* name ) const
  {
    this->add( name, val.*member );
  }

  // Other types:
  template< typename M >
  void add( const char* name, fc::optional< M >& v ) const
  {
    if( v.valid() )
      this->add( name, *v );
  }

  void add( const char* name, hive::protocol::asset& v ) const
  {
    v.amount = boost::lexical_cast< int64_t >( jsval[name][ "amount" ].template as< std::string >() );
    v.symbol = hive::protocol::asset_symbol_type::from_nai_string(
      jsval[name][ "nai" ].template as< std::string >().c_str(),
      jsval[name][ "precision" ].template as< uint8_t >()
    );
  }

  void add( const char* name, hive::protocol::price& v ) const
  {
    this->add( "base", v.base );
    this->add( "quote", v.quote );
  }

  void add( const char* name, hive::protocol::json_string& v ) const
  {
    v = hive::protocol::json_string{ jsval[name].as<std::string>() };
  }

  void add( const char* name, fc::ripemd160& v ) const
  {
    v = fc::ripemd160{ jsval[name].as<std::string>() };
  }

  void add( const char* name, fc::sha256& v ) const
  {
    v = fc::sha256{ jsval[name].as<std::string>() };
  }

  void add( const char* name, hive::protocol::public_key_type& v ) const
  {
    v = hive::protocol::public_key_type{ jsval[name].as<std::string>() };
  }

  void add( const char* name, hive::protocol::authority& v ) const
  {
    val_protocol_visitor< hive::protocol::authority > visitor{ jsval[name], v, is_protobuf };

    visitor.add( "weight_threshold", v.weight_threshold );
    visitor.add( "account_auths", v.account_auths );
    visitor.add( "key_auths", v.key_auths );
  }

  template<typename StorageT>
  void add( const char* name, hive::protocol::fixed_string_impl<StorageT>& v ) const
  {
    v = jsval[name].as<std::string>();
  }

  template<typename SafeT>
  void add( const char* name, fc::safe<SafeT>& v ) const
  {
    v.value = jsval[name].as<SafeT>();
  }

  void add( const char* name, std::vector<char>& v ) const
  {
    const std::string str = jsval[name].as<std::string>();
    v.resize(str.size() / 2);
    fc::from_hex(str, v.data(), str.size() / 2);
  }

  template<typename TArr, size_t NArr>
  void add( const char* name, fc::array<TArr, NArr>& v ) const
  {
    const std::string str = jsval[name].as<std::string>();
    fc::from_hex(str, reinterpret_cast<char *>(&v.data[0]), NArr);
  }

  void add( const char* name, fc::equihash::proof& v ) const
  {
    auto seed = fc::sha256::hash( jsval[name]["seed"].as<std::string>() );
    auto n = jsval[name]["n"].as<uint32_t>();
    auto k = jsval[name]["k"].as<uint32_t>();
    v = fc::equihash::proof::hash( n, k, seed );
  }

  void add( const char* name, hive::protocol::legacy_chain_properties& v ) const
  {
    v.account_creation_fee.amount = jsval[name]["account_creation_fee"]["amount"].as<uint64_t>();
    v.maximum_block_size = jsval[name]["maximum_block_size"].as<uint32_t>();
    v.hbd_interest_rate = jsval[name]["hbd_interest_rate"].as<uint16_t>();
  }

  void add( const char* name, hive::protocol::pow& v ) const
  {
    val_protocol_visitor< hive::protocol::pow > visitor{ jsval[name], v, is_protobuf };

    visitor.add( "worker", v.worker );
    visitor.add( "input", v.input );
    visitor.add( "signature", v.signature );
    visitor.add( "work", v.work );
  }

  void add( const char* name, hive::protocol::pow2_input& v ) const
  {
    val_protocol_visitor< hive::protocol::pow2_input > visitor{ jsval[name], v, is_protobuf };

    visitor.add( "worker_account", v.worker_account );
    visitor.add( "prev_block", v.prev_block );
    visitor.add( "nonce", v.nonce );
  }

  void add( const char* name, fc::time_point_sec& v ) const
  {
    v = fc::time_point_sec::from_iso_string( jsval[name].as<std::string>() );
  }

  template<uint32_t _SYMBOL>
  void add( const char* name, hive::protocol::tiny_asset<_SYMBOL>& v ) const
  {
    v.amount = jsval[name]["amount"].as<int64_t>();
  }

  template< typename... Ts >
  void add( const char* name, fc::static_variant< Ts... >& v ) const
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

    int64_t which = -1;

    emscripten::val nextval;

    if (is_protobuf)
    {
      emscripten::val obj_val = jsval[name];

      emscripten::val keys = emscripten::val::global("Object").call<emscripten::val>("keys", obj_val);
      uint32_t count = keys["length"].as<uint32_t>();

      for (uint32_t i = 0; i < count; ++i)
      {
        std::string key = keys[i].as<std::string>();

        emscripten::val el = obj_val[key];

        if (el.isUndefined())
          continue;

        const auto it = to_tag.find(key);
        if (it == to_tag.end())
          continue;

        which = it->second;
        nextval = el;
        break;
      }

      FC_ASSERT( which != -1, "Invalid object name: ${n}", ("n", name) );
    }
    else
    {
      std::string type = jsval[name]["type"].as<std::string>();

      auto itr = to_tag.find( type );
      FC_ASSERT( itr != to_tag.end(), "Invalid object name: ${n}", ("n", type) );
      which = itr->second;

      nextval = jsval[name]["value"];
    }

    val_to_static_variant visitor{nextval, is_protobuf};
    fc::static_variant<Ts...> tmp{which, visitor};
    v = tmp;
  }

  template< typename M >
  void add_scalar( const char* name, M& v ) const
  {
    v = jsval[name].as<M>();
  }

  template<typename M>
  void add_array( const char* name, boost::container::flat_set<M>& v ) const
  {
    emscripten::val arr_val = jsval[name];
    uint32_t arr_size = arr_val["length"].as<uint32_t>();

    v.reserve(arr_size);

    for (uint32_t i = 0; i < arr_size; ++i)
    {
      M item;

      if constexpr( std::is_same< typename fc::reflector< M >::is_defined, fc::true_type >::value )
        fc::reflector< M >::visit( val_protocol_visitor{ arr_val[i], item, is_protobuf } );
      else
        val_protocol_visitor< M >{ arr_val, item, is_protobuf }.add( std::to_string( i ).c_str(), item );

      v.insert(item);
    }
  }

  template<typename M>
  void add_array( const char* name, ::flat_set_ex<M>& v ) const
  {
    emscripten::val arr_val = jsval[name];
    uint32_t arr_size = arr_val["length"].as<uint32_t>();

    v.reserve(arr_size);

    for (uint32_t i = 0; i < arr_size; ++i)
    {
      M item;

      if constexpr( std::is_same< typename fc::reflector< M >::is_defined, fc::true_type >::value )
        fc::reflector< M >::visit( val_protocol_visitor{ arr_val[i], item, is_protobuf } );
      else
        val_protocol_visitor< M >{ arr_val, item, is_protobuf }.add( std::to_string( i ).c_str(), item );

      v.insert(item);
    }
  }

  template< typename M >
  void add_array( const char* name, M& v ) const
  {
    emscripten::val arr_val = jsval[name];
    uint32_t arr_size = arr_val["length"].as<uint32_t>();

    v.reserve(arr_size);

    for (uint32_t i = 0; i < arr_size; ++i)
    {
      using TVal = typename M::value_type;
      TVal item;

      if constexpr( std::is_same< typename fc::reflector< TVal >::is_defined, fc::true_type >::value )
        fc::reflector< TVal >::visit( val_protocol_visitor< TVal >{ arr_val[i], item, is_protobuf } );
      else
        val_protocol_visitor< TVal >{ arr_val, item, is_protobuf }.add( std::to_string( i ).c_str(), item );

      v.emplace_back(item);
    }
  }

  template<typename M>
  void add_object( const char* name, boost::container::flat_map<M, hive::protocol::weight_type>& v ) const
  {
    emscripten::val arr_val = jsval[name];

    if (is_protobuf)
    {
      emscripten::val keys = emscripten::val::global("Object").call<emscripten::val>("keys", arr_val);
      uint32_t count = keys["length"].as<uint32_t>();

      for (uint32_t i = 0; i < count; ++i)
      {
        std::string key = keys[i].as<std::string>();

        v[M{key}] = arr_val[key].as<hive::protocol::weight_type>();
      }
    }
    else
    {
      uint32_t arr_size = arr_val["length"].as<uint32_t>();

      for (uint32_t i = 0; i < arr_size; ++i)
      {
        auto el = arr_val[i];

        v[M{el[0].as<std::string>()}] = el[1].as<hive::protocol::weight_type>();
      }
    }
  }

  void add_object( const char* name, boost::container::flat_map<std::string, std::vector<char>> ) const
  {
    emscripten::val arr_val = jsval[name];
    uint32_t arr_size = arr_val["length"].as<uint32_t>();

    for (uint32_t i = 0; i < arr_size; ++i)
    {
      std::string key = arr_val[i][0].as<std::string>();
      std::vector<char> value;
      const std::string hex_value = arr_val[i][1].as<std::string>();
      value.resize(hex_value.size() / 2);
      fc::from_hex(hex_value, value.data(), hex_value.size() / 2);
    }
  }

  template <typename M>
  void add_member_impl(const binary_view::object_node&, const char* name, M& value) const
  {
    add_object(name, value);
  }

  template <typename M>
  void add_member_impl(const binary_view::array_node&, const char* name, M& value) const
  {
    add_array(name, value);
  }

  template <typename M>
  void add_member_impl(const binary_view::scalar_node&, const char* name, M& value) const
  {
    add_scalar(name, value);
  }

  template< typename M >
  void add( const char* key, M& value ) const
  {
    add_member_impl(typename binary_view::node_type< M >::node(), key, value);
  }

private:
  emscripten::val jsval;
  bool is_protobuf;
  T& val;
};

template<typename T>
val_to_static_variant::result_type val_to_static_variant::operator()( T& v )const
{
  static_assert( !binary_view::is_hive_array< T >::value, "We currently do not support arrays in static_variants when converting from emscripten::val" );
  static_assert( !std::is_scalar< T >::value, "We only support objects in static_variants when converting from emscripten::val" );

  fc::reflector< T >::visit( val_protocol_visitor< T >{ jsval, v, is_protobuf } );
}

} // namespac cpp
