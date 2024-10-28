#include <core/binary_view_helper.hpp>
#include <core/types.hpp>

#include <core/binary_view/node_types.hpp>
#include <core/binary_view/stringify.hpp>
#include <core/binary_view/traits.hpp>

#include <hive/protocol/misc_utilities.hpp>
#include <hive/protocol/types.hpp>
#include <hive/protocol/types_fwd.hpp>

#include <fc/crypto/hex.hpp>
#include <fc/crypto/ripemd160.hpp>
#include <fc/crypto/sha256.hpp>
#include <fc/io/iobuffer.hpp>
#include <fc/io/raw_fwd.hpp>
#include <fc/io/varint.hpp>
#include <fc/optional.hpp>
#include <fc/safe.hpp>
#include <fc/time.hpp>

#include <fc/static_variant.hpp>

#include <cstdint>
#include <string>
#include <type_traits>
#include <vector>

namespace cpp {
class static_variant_visitor : public fc::visitor< uint32_t > {
private:
  uint32_t& offset;
  std::vector< binary_data_node >& nodes;

public:
  static_variant_visitor( std::vector< binary_data_node >& nodes, uint32_t& offset )
    : offset(offset), nodes( nodes )
  {}

  template< typename T >
  uint32_t operator()( const T& v ) const;
};

template< typename T >
class binary_view_visitor {
public:
  binary_view_visitor( std::vector< binary_data_node >& nodes, uint32_t& offset, const T& v )
    : offset(offset), nodes( nodes ), val( v )
  {}

  template< typename Member, class Class, Member( Class::*member ) >
  void operator()( const char* name ) const
  {
    this->add( name, ( val.*member ) );
  }

  template< typename GetSizeT >
  static uint32_t get_size( const GetSizeT& v )
  {
    auto ss = fc::size_stream{};

    fc::raw::pack( ss, v );

    return (uint32_t) ss.size();
  }

  /** Calculates the value binary size and appends returned value to the local offset variable */
  template< typename GetSizeT >
  uint32_t push_offset( const GetSizeT& v ) const
  {
    const uint32_t size = get_size( v );

    offset += size;

    return size;
  }

  // Other types:
  template< typename M >
  void add( const char* name, const fc::optional< M >& v ) const
  {
    uint32_t child_offset = offset + get_size( fc::unsigned_int{ (uint32_t) v.valid() } );
    std::vector< binary_data_node > child_nodes;

    binary_data_node node{
      std::string{ name }, binary_view::scalar_node::name, offset, push_offset( v ), std::string{ "" }, 0, child_nodes
    };

    if( v.valid() )
    {
      binary_view_visitor< M >{ child_nodes, child_offset, *v }.add( name, *v );

      FC_ASSERT( child_nodes.size() == 1, "Optional type should have only one child node - internal error" );

      node.value    = child_nodes[0].value;
      node.length   = child_nodes[0].length;
      node.type     = child_nodes[0].type;
      node.children = child_nodes[0].children;
    }

    nodes.emplace_back( std::move(node) );
  }

  template< typename... Ts >
  void add( const char* name, const fc::static_variant< Ts... >& v ) const
  {
    uint32_t child_offset = offset;
    std::vector< binary_data_node > child_nodes;

    // Dynamic size
    uint32_t whichsize = get_size( fc::unsigned_int{ (uint32_t) v.which() } );

    binary_data_node whichnode{
      std::string{ "type" }, binary_view::scalar_node::name, child_offset, whichsize, v.get_stored_type_name( true )
    };
    child_nodes.emplace_back( whichnode );

    uint32_t offset_fwd = child_offset + whichsize;
    std::vector< binary_data_node > nodes_fwd;

    uint32_t valuesize = v.visit( static_variant_visitor{ nodes_fwd, offset_fwd } );

    binary_data_node valuenode{
      std::string{ "value" }, binary_view::object_node::name, child_offset + whichsize, valuesize, "", 0, nodes_fwd
    };
    child_nodes.emplace_back( std::move(valuenode) );

    binary_data_node child_node{
      name, binary_view::object_node::name, offset, whichsize + valuesize, "", 0, child_nodes
    };
    nodes.emplace_back( std::move(child_node) );
  }

  // Ignore default FC_REFLECT behavior and apply default scalar logic for asset symbol type
  // This will use stringifier for asset symbol type which handles pack type (legacy/hf26)
  void add( const char* name, const hive::protocol::asset_symbol_type& v ) const
  {
    add_scalar( name, v );
  }
  void add( const char* name, const hive::protocol::legacy_hive_asset_symbol_type& ) const
  {
    add_scalar( name, HIVE_SYMBOL );
  }

  template< typename M >
  void add_scalar( const char* name, const M& v ) const
  {
    binary_data_node node{
      std::string{ name }, binary_view::scalar_node::name, offset, push_offset( v ), binary_view::stringifier< M, binary_view::scalar_node >::stringify( v )
    };
    nodes.emplace_back( std::move(node) );
  }

  template< typename M >
  void add_array( const char* name, const M& v ) const
  { /* Dynamic size */
    uint32_t array_offset = offset + get_size( fc::unsigned_int{ (uint32_t) v.size() } );
    std::vector< binary_data_node > array_nodes;
    array_nodes.reserve(v.size());

    size_t i = 0;
    for( const auto& item: v )
    {
      uint32_t item_offset = array_offset;
      uint32_t item_size   = get_size( item );

      if constexpr( std::is_same< typename fc::reflector< typename M::value_type >::is_defined, fc::true_type >::value )
      { /* All reflected types are objects, so we have to create another nested level of object type */
        std::vector< binary_data_node > item_nodes;

        fc::reflector< typename M::value_type >::visit( binary_view_visitor< typename M::value_type >{ item_nodes, item_offset, item } );

        binary_data_node node{
          std::to_string( i ), binary_view::object_node::name, array_offset, item_size, "", 0, item_nodes
        };
        array_nodes.emplace_back( std::move(node) );
      }
      else /* Rest of the cases has to handle offsets and pushing elements to arrays by themselves*/
        binary_view_visitor< typename M::value_type >{ array_nodes, item_offset, item }.add( std::to_string( i ).c_str(), item );

      array_offset += item_size;
      ++i;
    }

    binary_data_node node{
      std::string{ name }, binary_view::array_node::name, offset, push_offset( v ), binary_view::stringifier< M, binary_view::array_node >::stringify( v ), static_cast<uint32_t>(v.size()), array_nodes
    };
    nodes.emplace_back( node );
  }

  template< typename M >
  void add_object( const char* name, const M& v ) const
  {
    /* Dynamic size */
    uint32_t object_offset = offset + get_size( fc::unsigned_int{ (uint32_t) v.size() } );
    std::vector< binary_data_node > object_nodes;

    object_nodes.reserve(v.size());

    for( const auto& [key, value]: v )
    {
      uint32_t key_size      = get_size( key );
      uint32_t nested_offset = object_offset;
      std::vector< binary_data_node > nested_nodes;

      binary_data_node node{
        std::string{ key }, binary_view::object_node::name, nested_offset, key_size + get_size( value ), std::string{ "" }, 0, nested_nodes
      };
      nested_offset += key_size;
      if constexpr( std::is_same< typename fc::reflector< typename M::mapped_type >::is_defined, fc::true_type >::value )
        /* All reflected types are objects, so we have to create another nested level of object type */
        fc::reflector< typename M::mapped_type >::visit( binary_view_visitor< typename M::mapped_type >{ nested_nodes, nested_offset, value } );
      else /* Rest of the cases has to handle offsets and pushing elements to object by themselves */
        binary_view_visitor< typename M::mapped_type >{ nested_nodes, nested_offset, value }.add( std::string{ key }.c_str(), value );

      if( nested_nodes[0].type == binary_view::scalar_node::name )
      { /* When we have only one scalar value, we can merge it with the parent object and change its display view */
        FC_ASSERT( nested_nodes.size() == 1, "Map with scalar value type should have only one child node - internal error" );

        node.value = nested_nodes[0].value;
        node.type  = nested_nodes[0].type;
        node.children.clear();
      }

      object_nodes.emplace_back( std::move(node) );

      object_offset += nested_offset;
    }

    binary_data_node node{
      std::string{ name }, binary_view::object_node::name, offset, push_offset( v ), std::string{ "" }, 0, object_nodes
    };
    nodes.emplace_back( std::move(node) );
  }

  template <typename M>
  void add_member_impl(const binary_view::object_node&, const char* name, const M& value) const
  {
    add_object(name, value);
  }

  template <typename M>
  void add_member_impl(const binary_view::array_node&, const char* name, const M& value) const
  {
    add_array(name, value);
  }

  template <typename M>
  void add_member_impl(const binary_view::scalar_node&, const char* name, const M& value) const
  {
    add_scalar(name, value);
  }

  template< typename M >
  void add( const char* key, const M& value ) const
  {
    if constexpr( std::is_same< typename fc::reflector< M >::is_defined, fc::true_type >::value )
    {
      uint32_t child_offset = offset;
      std::vector< binary_data_node > child_nodes;

      fc::reflector< M >::visit( binary_view_visitor< M >{ child_nodes, child_offset, value } );

      binary_data_node child_node{
        std::string{ key }, binary_view::object_node::name, offset, push_offset( value ), "", 0, child_nodes
      };
      nodes.emplace_back( std::move(child_node));
    }
    else
    {
      add_member_impl(typename binary_view::node_type< M >::node(), key, value);
    }
  }

  uint32_t& offset;
  std::vector< binary_data_node >& nodes;
  const T& val;
};

template< typename T >
uint32_t static_variant_visitor::operator()( const T& v ) const
{
  static_assert( !binary_view::is_hive_array< T >::value, "We currently do not support arrays in static_variants when converting to binary view" );
  static_assert( !std::is_scalar< T >::value, "We only support objects in static_variants when converting to binary view" );

  fc::reflector< T >::visit( binary_view_visitor< T >{ nodes, offset, v } );

  return binary_view_visitor< T >::get_size( v );
}

binary_data generate_binary_transaction_metadata( const hive::protocol::signed_transaction& tx, bool use_hf26_serialization )
{
  const auto serialization_type = use_hf26_serialization ? hive::protocol::transaction_serialization_type::hf26 : hive::protocol::transaction_serialization_type::legacy;

  hive::protocol::serialization_mode_controller::mode_guard guard( serialization_type );
  hive::protocol::serialization_mode_controller::set_pack( serialization_type );

  binary_data result;
  result.binary = serialize_transaction( tx, use_hf26_serialization );

  std::vector< binary_data_node > nodes;

  uint32_t offset = 0;

  fc::reflector< hive::protocol::signed_transaction >::visit( binary_view_visitor< hive::protocol::signed_transaction >{ nodes, offset, tx } );

  result.offsets = nodes;

  return result;
}

binary_data generate_binary_operation_metadata( const hive::protocol::operation& op, bool use_hf26_serialization )
{
  const auto serialization_type = use_hf26_serialization ? hive::protocol::transaction_serialization_type::hf26 : hive::protocol::transaction_serialization_type::legacy;

  hive::protocol::serialization_mode_controller::mode_guard guard( serialization_type );
  hive::protocol::serialization_mode_controller::set_pack( serialization_type );

  binary_data result;
  result.binary = fc::to_hex( fc::raw::pack_to_vector( op ) );

  std::vector< binary_data_node > nodes;

  uint32_t offset = 0;

  binary_view_visitor< hive::protocol::operation >{ nodes, offset, op }.add( "", op );

  FC_ASSERT( nodes.size() == 1, "Operation (static variant) should have only one child node - internal error" );

  result.offsets = nodes[0].children;

  return result;
}

std::string serialize_transaction( const hive::protocol::signed_transaction& tx, bool use_hf26_serialization )
{
  const auto serialization_type = use_hf26_serialization ? hive::protocol::transaction_serialization_type::hf26 : hive::protocol::transaction_serialization_type::legacy;

  hive::protocol::serialization_mode_controller::mode_guard guard( serialization_type );
  hive::protocol::serialization_mode_controller::set_pack( serialization_type );

  return fc::to_hex( fc::raw::pack_to_vector( tx ) );
}
} // namespace cpp
