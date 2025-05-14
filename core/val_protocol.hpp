#pragma once

#include <hive/protocol/transaction.hpp>
#include <fc/static_variant.hpp>
#include "binary_view/node_types.hpp"
#include "binary_view/traits.hpp"

namespace cpp {

namespace {
template<typename ManagedObjectT>
class val_to_static_variant
{
public:
  using result_type = void;

  val_to_static_variant(ManagedObjectT jsval, bool is_protobuf)
    : jsval(jsval), is_protobuf(is_protobuf)
  {}

  template<typename T>
  result_type operator()( T& v )const;

private:
  ManagedObjectT jsval;
  bool is_protobuf;
};
}


template< typename ManagedObjectT, typename... Ts >
void from_jsval( ManagedObjectT jsval, fc::static_variant< Ts... >& v, bool is_protobuf )
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

  ManagedObjectT nextval;

  if (is_protobuf)
  {
    const std::string nextkey = jsval.get_underlying_sv_type();

    nextval = jsval[nextkey];

    const auto it = to_tag.find(nextkey);
    FC_ASSERT( it != to_tag.end(), "Could not find the supported property in static variant: ${nextkey}", ("nextkey", nextkey) );

    which = it->second;
  }
  else
  {
    std::string type = jsval["type"].template as<std::string>();

    auto itr = to_tag.find( type );
    FC_ASSERT( itr != to_tag.end(), "Invalid object name: ${n}", ("n", type) );
    which = itr->second;

    nextval = jsval["value"];
  }

  val_to_static_variant visitor{nextval, is_protobuf};
  fc::static_variant<Ts...> tmp{which, visitor};
  v = tmp;
}

template< typename ManagedObjectT, typename T >
class val_protocol_visitor {
public:
  val_protocol_visitor( ManagedObjectT jsval, T& val, bool is_protobuf )
    : jsval( jsval ), is_protobuf( is_protobuf ), val( val )
  {}

  template< typename Member, class Class, Member( Class::*member ) >
  void operator()( const char* name ) const
  {
    //if (jsval[name].is_undefined())
      //return;

    this->add( name, val.*member );
  }

  // Other types:
  template< typename M >
  void add( const char* name, fc::optional< M >& v ) const
  {
    if(jsval.is_optional_field_present(name)) {
      M tmp;
      this->add( name, tmp );
      v = tmp;
    }
  }

  void add( const char* name, hive::protocol::asset& v ) const
  {
    ManagedObjectT amount = jsval[name];
    v.amount = boost::lexical_cast< int64_t >( amount[ "amount" ].template as< std::string >() );
    v.symbol = hive::protocol::asset_symbol_type::from_nai_string(
      amount[ "nai" ].template as< std::string >().c_str(),
      amount[ "precision" ].template as< uint8_t >()
    );
  }

  void add( const char* name, hive::protocol::price& v ) const
  {
    val_protocol_visitor< ManagedObjectT, hive::protocol::price > visitor{ jsval[name], v, is_protobuf };
    visitor.add( "base", v.base );
    visitor.add( "quote", v.quote );
  }

  void add( const char* name, hive::protocol::json_string& v ) const
  {
    v = hive::protocol::json_string{ jsval[name].template as<std::string>() };
  }

  void add( const char* name, fc::ripemd160& v ) const
  {
    v = fc::ripemd160{ jsval[name].template as<std::string>() };
  }

  void add( const char* name, fc::sha256& v ) const
  {
    v = fc::sha256{ jsval[name].template as<std::string>() };
  }

  void add( const char* name, hive::protocol::public_key_type& v ) const
  {
    v = hive::protocol::public_key_type{ jsval[name].template as<std::string>() };
  }

  void add( const char* name, hive::protocol::authority& v ) const
  {
    val_protocol_visitor< ManagedObjectT, hive::protocol::authority > visitor{ jsval[name], v, is_protobuf };

    visitor.add( "weight_threshold", v.weight_threshold );
    visitor.add( "account_auths", v.account_auths );
    visitor.add( "key_auths", v.key_auths );
  }

  template<typename StorageT>
  void add( const char* name, hive::protocol::fixed_string_impl<StorageT>& v ) const
  {
    v = jsval[name].template as<std::string>();
  }

  template<typename SafeT>
  void add( const char* name, fc::safe<SafeT>& v ) const
  {
    v.value = jsval[name].template as<SafeT>();
  }

  void add( const char* name, std::vector<char>& v ) const
  {
    const std::string str = jsval[name].template as<std::string>();
    v.resize(str.size() / 2);
    fc::from_hex(str, v.data(), str.size() / 2);
  }

  template<typename TArr, size_t NArr>
  void add( const char* name, fc::array<TArr, NArr>& v ) const
  {
    const std::string str = jsval[name].template as<std::string>();
    fc::from_hex(str, reinterpret_cast<char *>(&v.data[0]), NArr);
  }

  void add( const char* name, fc::equihash::proof& v ) const
  {
    auto seed = fc::sha256::hash( jsval[name]["seed"].template as<std::string>() );
    auto n = jsval[name]["n"].template as<uint32_t>();
    auto k = jsval[name]["k"].template as<uint32_t>();
    v = fc::equihash::proof::hash( n, k, seed );
  }

  void add( const char* name, hive::protocol::legacy_chain_properties& v ) const
  {
    ManagedObjectT amount = jsval[name]["account_creation_fee"]["amount"];

    if (amount.is_string())
      v.account_creation_fee.amount = boost::lexical_cast<uint64_t>(amount.template as<std::string>());
    else
      v.account_creation_fee.amount = amount.template as<uint64_t>();
    v.maximum_block_size = jsval[name]["maximum_block_size"].template as<uint32_t>();
    v.hbd_interest_rate = jsval[name]["hbd_interest_rate"].template as<uint16_t>();
  }

  void add( const char* name, hive::protocol::pow& v ) const
  {
    val_protocol_visitor< ManagedObjectT, hive::protocol::pow > visitor{ jsval[name], v, is_protobuf };

    visitor.add( "worker", v.worker );
    visitor.add( "input", v.input );
    visitor.add( "signature", v.signature );
    visitor.add( "work", v.work );
  }

  void add( const char* name, hive::protocol::pow2_input& v ) const
  {
    val_protocol_visitor< ManagedObjectT, hive::protocol::pow2_input > visitor{ jsval[name], v, is_protobuf };

    visitor.add( "worker_account", v.worker_account );
    visitor.add( "prev_block", v.prev_block );
    visitor.add( "nonce", v.nonce );
  }

  void add( const char* name, fc::time_point_sec& v ) const
  {
    std::string time = jsval[name].template as<std::string>();
    if (time.empty())
      v = fc::time_point_sec::min();
    else
      v = fc::time_point_sec::from_iso_string( time );
  }

  template<uint32_t _SYMBOL>
  void add( const char* name, hive::protocol::tiny_asset<_SYMBOL>& v ) const
  {
    v.amount = jsval[name]["amount"].template as<int64_t>();
  }

  template< typename... Ts >
  void add( const char* name, fc::static_variant< Ts... >& v ) const
  {
    from_jsval( jsval[name], v, is_protobuf );
  }

  void add_scalar( const char* name, hive::protocol::asset_symbol_type& v ) const
  {
    FC_ASSERT(false, "Not implemented"); // XXX: binary_view::node_type< hive::protocol::asset_symbol_type >::node returns scalar_node
  }

  template< typename M >
  void add_scalar( const char* name, M& v ) const
  {
    v = jsval[name].template as<M>();
  }

  void add_scalar( const char* name, int64_t& v ) const
  {
    ManagedObjectT _val = jsval[name];
    if (_val.is_string())
      v = boost::lexical_cast<int64_t>(_val.template as<std::string>());
    else
      v = _val.template as<int64_t>();
  }

  void add_scalar( const char* name, uint64_t& v ) const
  {
    ManagedObjectT _val = jsval[name];
    if (_val.is_string())
      v = boost::lexical_cast<uint64_t>(_val.template as<std::string>());
    else
      v = _val.template as<uint64_t>();
  }

  template<typename M>
  void add_array( const char* name, boost::container::flat_set<M>& v ) const
  {
    ManagedObjectT arr_val = jsval[name];

    auto arr_size = arr_val.array_length();
    v.reserve(arr_size);

    for (size_t i = 0; i < arr_size; ++i)
    {
      M item;

      if constexpr( std::is_same< typename fc::reflector< M >::is_defined, fc::true_type >::value )
        fc::reflector< M >::visit( val_protocol_visitor< ManagedObjectT, M >{ arr_val[i], item, is_protobuf } );
      else
        val_protocol_visitor< ManagedObjectT, M >{ arr_val, item, is_protobuf }.add( std::to_string( i ).c_str(), item );

      v.insert(item);
    }
  }

  template<typename M>
  void add_array( const char* name, ::flat_set_ex<M>& v ) const
  {
    ManagedObjectT arr_val = jsval[name];

    auto arr_size = arr_val.array_length();
    v.reserve(arr_size);

    for (size_t i = 0; i < arr_size; ++i)
    {
      M item;

      if constexpr( std::is_same< typename fc::reflector< M >::is_defined, fc::true_type >::value )
        fc::reflector< M >::visit( val_protocol_visitor< ManagedObjectT, M >{ arr_val[i], item, is_protobuf } );
      else
        val_protocol_visitor< ManagedObjectT, M >{ arr_val, item, is_protobuf }.add( std::to_string( i ).c_str(), item );

      v.insert(item);
    }
  }

  template< typename M >
  void add_array( const char* name, M& v ) const
  {
    ManagedObjectT arr_val = jsval[name];

    auto arr_size = arr_val.array_length();
    v.reserve(arr_size);

    for (size_t i = 0; i < arr_size; ++i)
    {
      using TVal = typename M::value_type;
      TVal item;

      if constexpr( std::is_same< typename fc::reflector< TVal >::is_defined, fc::true_type >::value )
        fc::reflector< TVal >::visit( val_protocol_visitor< ManagedObjectT, TVal >{ arr_val[i], item, is_protobuf } );
      else
        val_protocol_visitor< ManagedObjectT, TVal >{ arr_val, item, is_protobuf }.add( std::to_string( i ).c_str(), item );

      v.emplace_back(item);
    }
  }

  template<typename M>
  void add_object( const char* name, boost::container::flat_map<M, hive::protocol::weight_type>& v ) const
  {
    ManagedObjectT arr_val = jsval[name];

    if (is_protobuf)
    {
      for (const auto& key : arr_val.get_map_keys())
      {
        v[M{key}] = arr_val[key].template as<hive::protocol::weight_type>();
      }
    }
    else
    {
      auto arr_size = arr_val.array_length();

      for (size_t i = 0; i < arr_size; ++i)
      {
        auto el = arr_val[i];

        v[M{el[0].template as<std::string>()}] = el[1].template as<hive::protocol::weight_type>();
      }
    }
  }

  void add_object( const char* name, boost::container::flat_map<std::string, std::vector<char>>& v ) const
  {
    ManagedObjectT arr_val = jsval[name];

    if (is_protobuf)
    {
      for (const auto& key : arr_val.get_map_keys())
      {
        std::vector<char> value;
        const std::string hex_value = arr_val[key].template as<std::string>();
        value.resize(hex_value.size() / 2);
        fc::from_hex(hex_value, value.data(), hex_value.size() / 2);

        v[key] = value;
      }
    }
    else
    {
      auto arr_size = arr_val.array_length();

      for (size_t i = 0; i < arr_size; ++i)
      {
        std::string key = arr_val[i][0].template as<std::string>();
        std::vector<char> value;
        const std::string hex_value = arr_val[i][1].template as<std::string>();
        value.resize(hex_value.size() / 2);
        fc::from_hex(hex_value, value.data(), hex_value.size() / 2);

        v[key] = value;
      }
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
  ManagedObjectT jsval;
  bool is_protobuf;
  T& val;
};

template<typename ManagedObjectT>
template<typename T>
typename val_to_static_variant<ManagedObjectT>::result_type val_to_static_variant<ManagedObjectT>::operator()( T& v )const
{
  static_assert( !binary_view::is_hive_array< T >::value, "We currently do not support arrays in static_variants when converting from ManagedObjectT" );
  static_assert( !std::is_scalar< T >::value, "We only support objects in static_variants when converting from ManagedObjectT" );

  fc::reflector< T >::visit( val_protocol_visitor< ManagedObjectT, T >{ jsval, v, is_protobuf } );
}

} // namespac cpp
