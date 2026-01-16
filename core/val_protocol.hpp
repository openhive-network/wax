#pragma once

#include <type_traits>

#include <hive/protocol/transaction.hpp>
#include <fc/static_variant.hpp>
#include "binary_view/node_types.hpp"
#include "binary_view/traits.hpp"

//#define VAL_PROTOCOL_LOGGING

#ifdef VAL_PROTOCOL_LOGGING
  #define VAL_PROTOCOL_ILOG( FORMAT, ...) ilog( FORMAT, __VA_ARGS__ )
  #define VAL_PROTOCOL_WLOG( FORMAT, ...) wlog( FORMAT, __VA_ARGS__ )
#else
  #define VAL_PROTOCOL_ILOG( FORMAT, ...) /* nothing */
  #define VAL_PROTOCOL_WLOG( FORMAT, ...) /* nothing */
#endif /// VAL_PROTOCOL_LOGGING

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
    : jsval( jsval ), is_protobuf( is_protobuf ), ignore_missing_fields( is_protobuf == false ), val( val )
  {}

  template< typename Member, class Class >
  void operator()( Member Class::*member, const char* name ) const
  {
    VAL_PROTOCOL_ILOG("Attemptng to visit member ${name} from object ${jsval}", (name)("jsval", jsval.operator std::string()));
    this->add( name, val.*member );
  }

  // Other types:
  template< typename M >
  void add( const char* name, fc::optional< M >& v ) const
  {
    if(jsval.is_optional_field_present(name))
    {
      VAL_PROTOCOL_ILOG("Processing optional member ${name} from object ${jsval}", (name)("jsval", jsval.operator std::string()));
      M tmp;
      this->add( name, tmp );
      v = tmp;
    }
    else
    {
      VAL_PROTOCOL_ILOG("Skipping optional member ${name} from object ${jsval}", (name)("jsval", jsval.operator std::string()));
    }
  }

  void add( const char* name, hive::protocol::asset& v ) const
  {
    if(can_skip_missing_field(name))
      return;

    ManagedObjectT amount = jsval[name];

    std::string amount_str = amount["amount"].template as<std::string>();

    v.amount = boost::lexical_cast< int64_t >( amount_str );

    std::string nai = amount["nai"].template as<std::string>();
    uint8_t precision = amount["precision"].template as<uint8_t>();

    v.symbol = hive::protocol::asset_symbol_type::from_nai_string(
      nai.c_str(),
      precision
    );
  }

  void add( const char* name, hive::protocol::json_string& v ) const
  {
    if(can_skip_missing_field(name))
      return;

    std::string str = jsval[name].template as<std::string>();
    v = hive::protocol::json_string{ str };
  }

  void add( const char* name, fc::ripemd160& v ) const
  {
    if(can_skip_missing_field(name))
      return;

    std::string str = jsval[name].template as<std::string>();
    v = fc::ripemd160{ str };
  }

  void add( const char* name, fc::sha256& v ) const
  {
    if(can_skip_missing_field(name))
      return;

    std::string str = jsval[name].template as<std::string>();
    v = fc::sha256{ str };
  }

  void add( const char* name, hive::protocol::public_key_type& v ) const
  {
    if(can_skip_missing_field(name))
      return;

    std::string str = jsval[name].template as<std::string>();
    v = hive::protocol::public_key_type{ str };
  }

  template<typename StorageT>
  void add( const char* name, hive::protocol::fixed_string_impl<StorageT>& v ) const
  {
    if(can_skip_missing_field(name))
      return;

    std::string str = jsval[name].template as<std::string>();
    v = str;
  }

  template<typename SafeT>
  void add( const char* name, fc::safe<SafeT>& v ) const
  {
    if(can_skip_missing_field(name))
      return;

    SafeT tmp;
    this->add(name, tmp);
    v.value = tmp;
  }

  void add( const char* name, std::vector<char>& v ) const
  {
    if(can_skip_missing_field(name))
      return;

    std::string str;
    jsval[name].as( str );
    v.resize(str.size() / 2);
    fc::from_hex(str, v.data(), str.size() / 2);
  }

  template<typename TArr, size_t NArr>
  void add( const char* name, fc::array<TArr, NArr>& v ) const
  {
    if(can_skip_missing_field(name))
      return;

    std::string str = jsval[name].template as<std::string>();
    fc::from_hex(str, reinterpret_cast<char *>(&v.data[0]), NArr);
  }

  void add( const char* name, hive::protocol::legacy_hive_asset& v ) const
  {
    if(can_skip_missing_field(name))
      return;

    val_protocol_visitor< ManagedObjectT, hive::protocol::legacy_hive_asset >{ jsval[name], v, is_protobuf }.add( "amount", v.amount );
  }

  void add( const char* name, fc::time_point_sec& v ) const
  {
    if(can_skip_missing_field(name))
      return;

    std::string time;
    jsval[name].as(time);
    if (time.empty())
      v = fc::time_point_sec::min();
    else
      v = fc::time_point_sec::from_iso_string( time );
  }

  template<uint32_t _SYMBOL>
  void add( const char* name, hive::protocol::tiny_asset<_SYMBOL>& v ) const
  {
    if(can_skip_missing_field(name))
      return;

    int64_t amount_value = jsval[name]["amount"].template as<int64_t>();
    v.amount = amount_value;
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
    jsval[name].as(v);
  }

  void add_scalar( const char* name, int64_t& v ) const
  {
    ManagedObjectT _val = jsval[name];
    if (_val.is_string())
    {
      std::string str = _val.template as<std::string>();
      v = boost::lexical_cast<int64_t>(str);
    }
    else
    {
      _val.as(v);
    }
  }

  void add_scalar( const char* name, uint64_t& v ) const
  {
    ManagedObjectT _val = jsval[name];
    if (_val.is_string())
    {
      std::string str = _val.template as<std::string>();
      v = boost::lexical_cast<uint64_t>(str);
    }
    else
    {
      _val.as(v);
    }
  }

  template<typename M>
  void add_array( const char* name, boost::container::flat_set<M>& v ) const
  {
    ManagedObjectT arr_val = jsval[name];

    auto arr_size = arr_val.array_length();
    v.reserve(arr_size);

    VAL_PROTOCOL_ILOG("Processing ${name} member: Attempting to load ${arr_size} items from ${arr_val} into flat_set container...", ("arr_val", arr_val.operator std::string())(arr_size)(name));

    for (size_t i = 0; i < arr_size; ++i)
    {
      M item;

      if constexpr( std::is_same< typename fc::reflector< M >::is_defined, fc::true_type >::value )
      {
        fc::reflector< M >::visit( val_protocol_visitor< ManagedObjectT, M >{ arr_val[i], item, is_protobuf } );
      }
      else
      {
        val_protocol_visitor< ManagedObjectT, M > visitor{ arr_val, item, is_protobuf };
        visitor.ignore_missing_fields = false;
        visitor.add( std::to_string( i ).c_str(), item );
      }

      VAL_PROTOCOL_ILOG("Attempting to insert into set another item # ${i}: ${item}", (i)(item));

      v.insert(item);
    }

    FC_ASSERT(v.size() == arr_size);
  }

  template<typename M>
  void add_array( const char* name, ::flat_set_ex<M>& v ) const
  {
    add_array(name, static_cast<boost::container::flat_set<M>&>(v));
  }

  template< typename M >
  void add_array( const char* name, M& v ) const
  {
    ManagedObjectT arr_val = jsval[name];

    auto arr_size = arr_val.array_length();

    VAL_PROTOCOL_ILOG("Processing ${name} member: Attempting to load ${arr_size} items from ${arr_val} into generic-array container...", ("arr_val", arr_val.operator std::string())(arr_size)(name));

    v.reserve(arr_size);

    for (size_t i = 0; i < arr_size; ++i)
    {
      using TVal = typename M::value_type;
      TVal item;

      if constexpr( std::is_same< typename fc::reflector< TVal >::is_defined, fc::true_type >::value )
      {
        fc::reflector< TVal >::visit( val_protocol_visitor< ManagedObjectT, TVal >{ arr_val[i], item, is_protobuf } );
      }
      else
      {
        val_protocol_visitor< ManagedObjectT, TVal > visitor { arr_val, item, is_protobuf };
        visitor.ignore_missing_fields = false;
        visitor.add( std::to_string( i ).c_str(), item );
      }

      VAL_PROTOCOL_ILOG("Attempting to push into array another item # ${i}: ${item}", (i)(item));
      v.emplace_back(item);
    }

    FC_ASSERT(v.size() == arr_size);
  }

  template<typename M>
  void add_object( const char* name, boost::container::flat_map<M, hive::protocol::weight_type>& v ) const
  {
    ManagedObjectT arr_val = jsval[name];

    if (is_protobuf)
    {
      for (const auto& key : arr_val.get_map_keys())
      {
        hive::protocol::weight_type weight = arr_val[key].template as<hive::protocol::weight_type>();

        VAL_PROTOCOL_ILOG("Attempting to push into map item ${key}/${weight}", (key)(weight));

        /// WARNING: According to compatibility to hive::protocol maps serialization (fc from_variant/unpack), duplicates SHALL BE IGNORED, and first key/value association preserved.
        auto insert_info = v.emplace(M{ key }, weight);
        if (insert_info.second == false)
        {
          VAL_PROTOCOL_WLOG("Ignored duplicate for item: ${key}", (key));
        }
      }
    }
    else
    {
      auto arr_size = arr_val.array_length();

      VAL_PROTOCOL_ILOG("Processing ${name} member: Attempting to load ${arr_size} items from ${arr_val} into flat_map container...", ("arr_val", arr_val.operator std::string())(arr_size)(name));

      for (size_t i = 0; i < arr_size; ++i)
      {
        auto el = arr_val[i];
        std::string key = el[0].template as<std::string>();
        hive::protocol::weight_type weight = el[1].template as<hive::protocol::weight_type>();

        VAL_PROTOCOL_ILOG("Attempting to push into map item # ${i}: ${key}/${weight}", (i)(key)(weight));

        /// WARNING: According to compatibility to hive::protocol maps serialization (fc from_variant/unpack), duplicates SHALL BE IGNORED, and first key/value association preserved.
        auto insert_info = v.emplace(M{key}, weight);

        if (insert_info.second == false)
        {
          VAL_PROTOCOL_WLOG("Ignored duplicate for item # ${i}: ${key}", (i)(key));
        }
      }
    }
  }

  template<typename M>
  void add_object( const char* name, M& v ) const
  {
    fc::reflector< M >::visit(
      cpp::val_protocol_visitor< ManagedObjectT, M >{ jsval[name], v, is_protobuf }
    );
  }

  void add_object( const char* name, boost::container::flat_map<std::string, std::vector<char>>& v ) const
  {
    ManagedObjectT arr_val = jsval[name];

    if (is_protobuf)
    {
      for (const auto& key : arr_val.get_map_keys())
      {
        std::vector<char> value;
        std::string hex_value;
        arr_val[key].as(hex_value);
        value.resize(hex_value.size() / 2);
        fc::from_hex(hex_value, value.data(), hex_value.size() / 2);

        auto insert_info = v.emplace(std::move(key), std::move(value));
        if (insert_info.second == false)
        {
          VAL_PROTOCOL_WLOG("Ignored duplicate for item ${key}", ("key", insert_info.first->first));
        }
      }
    }
    else
    {
      auto arr_size = arr_val.array_length();

      VAL_PROTOCOL_ILOG("Processing ${name} member: Attempting to load ${arr_size} items from ${arr_val} into flat_map container...", ("arr_val", arr_val.operator std::string())(arr_size)(name));

      for (size_t i = 0; i < arr_size; ++i)
      {
        ManagedObjectT el = arr_val[i];
        std::string key;
        el[0].as(key);
        std::vector<char> value;
        std::string hex_value;
        el[1].as(hex_value);
        value.resize(hex_value.size() / 2);
        fc::from_hex(hex_value, value.data(), hex_value.size() / 2);

        /// WARNING: According to compatibility to hive::protocol maps serialization (fc from_variant/unpack), duplicates SHALL BE IGNORED, and first value preserved.
        auto insert_info = v.emplace(std::move(key), std::move(value));
        if (insert_info.second == false)
        {
          VAL_PROTOCOL_WLOG("Ignored duplicate for item # ${i}: ${key}", (i)("key", insert_info.first->first));
        }
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
    if(can_skip_missing_field(key))
      return;

    add_member_impl(typename binary_view::node_type< M >::node(), key, value);
  }

  bool can_skip_missing_field(const char* name) const
  {
    if(ignore_missing_fields && jsval.is_optional_field_present(name) == false)
    {
      VAL_PROTOCOL_WLOG("Skipping missing member: ${name} of object: ${o}", (name)("o", this->jsval.operator std::string()));
      return true;
    }

    return false;
  }

  ManagedObjectT jsval;
  bool is_protobuf;
  /** true when missing field in source managedobject should be ignored.
      It must match fc::from_variant object initialization, which allows to skip members and use their C++ defaults.
  */
  bool ignore_missing_fields;
  T& val;
};

template<typename ManagedObjectT>
template<typename T>
typename val_to_static_variant<ManagedObjectT>::result_type val_to_static_variant<ManagedObjectT>::operator()( T& v )const
{
  static_assert( !binary_view::is_hive_array< T >::value, "We currently do not support arrays in static_variants when converting from ManagedObjectT" );
  static_assert( !std::is_scalar< T >::value, "We only support objects in static_variants when converting from ManagedObjectT" );

  VAL_PROTOCOL_ILOG("Processing SV item: Attempting to load  object from ${jsval}", ("jsval", jsval.operator std::string()));

  fc::reflector< T >::visit( val_protocol_visitor< ManagedObjectT, T >{ jsval, v, is_protobuf } );
}

} // namespac cpp

#undef VAL_PROTOCOL_ILOG
#undef VAL_PROTOCOL_WLOG
