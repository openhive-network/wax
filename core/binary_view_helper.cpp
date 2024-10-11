#include <core/binary_view_helper.hpp>
#include <core/types.hpp>

#include <hive/protocol/misc_utilities.hpp>

#include <fc/crypto/hex.hpp>
#include <fc/io/iobuffer.hpp>
#include <fc/io/raw_fwd.hpp>

#include <fc/static_variant.hpp>

#include <cstdint>
#include <string>
#include <type_traits>
#include <vector>

namespace cpp {
template< typename T >
struct stringifier
{
  static std::string value( const T& v )
  {
    return fc::to_string( v );
  }
};
template<>
struct stringifier< bool >
{
  inline static std::string TRUE_STR{ "true" };
  inline static std::string FALSE_STR{ "false" };

  static std::string value( bool v )
  {
    return v ? TRUE_STR : FALSE_STR;
  }
};
template<>
struct stringifier< fc::string >
{
  static std::string value( const fc::string& v )
  {
    return v;
  }
};
template< typename T >
struct stringifier< std::vector< T > >
{
  static std::string value( const std::vector< T >& v )
  {
    return "Length: " + fc::to_string( v.size() );
  }
};

#define CPP_BINARY_VIEW_VISITOR_REGISTER_POD( type )                                           \
  void add( const char* name, type v ) const                                                   \
  {                                                                                            \
    binary_data_node node{                                                                     \
      std::string{ name }, POD_TYPE, offset, push_offset( v ), stringifier< type >::value( v ) \
    };                                                                                         \
    nodes.emplace_back( node );                                                                \
  }                                                                                            \
  void __unused_##type() const

class static_variant_visitor {
private:
  uint32_t& offset;
  std::vector< binary_data_node >& nodes;
  uint32_t whichsize;
  std::string whichname;

public:
  static_variant_visitor( std::vector< binary_data_node >& nodes, uint32_t& offset, uint32_t whichsize, const std::string& whichname )
    : nodes( nodes ), offset( offset ), whichsize( whichsize ), whichname( whichname )
  {}

  template< typename T >
  void operator()( const T& v ) const;
};

template< typename T >
class binary_view_visitor {
public:
  binary_view_visitor( std::vector< binary_data_node >& nodes, uint32_t& offset, const T& v )
    : nodes( nodes ), offset( offset ), val( v )
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

  CPP_BINARY_VIEW_VISITOR_REGISTER_POD( bool );
  CPP_BINARY_VIEW_VISITOR_REGISTER_POD( uint8_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_POD( int8_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_POD( uint16_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_POD( int16_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_POD( uint32_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_POD( int32_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_POD( uint64_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_POD( int64_t );

  // vector, flat_set, flat_set_ex

  template< typename M >
  void add( const char* name, const std::vector< M >& v ) const
  {
    uint32_t offset_fwd = offset + get_size( v.size() );
    std::vector< binary_data_node > nodes_fwd;

    for( const auto& item: v )
      // TODO: Static selection here
        if( std::is_same< typename fc::reflector< M >::is_defined, fc::true_type >::value )
          fc::reflector< M >::visit( binary_view_visitor< M >( nodes_fwd, offset_fwd, item ) );
        else
          pack_undefined( nodes_fwd, offset_fwd );

    binary_data_node node{
      std::string{ name }, ARRAY_TYPE, offset, push_offset( v ), stringifier< std::vector< M > >::value( v ), v.size(), nodes_fwd
    };
    nodes.emplace_back( node );
  }

  void add( const char* name, const fc::array< unsigned char, 65 >& v ) const
  {
    binary_data_node node{
      std::string{ name }, POD_TYPE, offset, push_offset( v ), fc::to_hex( fc::raw::pack_to_vector( v ) )
    };
    nodes.emplace_back( node );
  }

  template< typename M >
  void pack_undefined( std::vector< binary_data_node >& nodes, uint32_t& offset, const fc::static_variant< M >& v ) const
  {
    v.visit( static_variant_visitor{ nodes, offset, get_size( v.which() ), v.get_stored_type_name( true ) } );
  }

  template< typename M >
  void add( const char* name, const M& v ) const
  {
    push_offset( v ); // XXX: Just for debugging purposes. Should be replaced with the actual function code here
  }

  uint32_t& offset;
  std::vector< binary_data_node >& nodes;
  const T& val;

  inline static std::string POD_TYPE{ "pod" };
  inline static std::string ARRAY_TYPE{ "array" };
  inline static std::string OBJECT_TYPE{ "object" };
};

#undef CPP_BINARY_VIEW_VISITOR_REGISTER_POD

template< typename T >
void static_variant_visitor::operator()( const T& v ) const
{
  nodes.emplace_back( binary_data_node{
    "type", binary_view_visitor< T >::POD_TYPE, offset, whichsize, stringifier< T >::value( whichname ) } );

  uint32_t offset_fwd = offset + whichsize;
  std::vector< binary_data_node > nodes_fwd;

  fc::reflector< T >::visit( binary_view_visitor< T >( nodes_fwd, offset_fwd, v ) );

  binary_data_node node{
    // TODO: Handle array in static_variant here: (currently only OBJECT_TYPE is supported)
    "value", binary_view_visitor< T >::OBJECT_TYPE, offset, binary_view_visitor< T >::get_size( v ), "", 0, nodes_fwd
  };

  nodes.emplace_back( node );
}

binary_data generate_binary_transaction_metadata( const hive::protocol::signed_transaction& tx )
{
  binary_data result;
  result.binary = serialize_transaction( tx );

  std::vector< binary_data_node > nodes;

  uint32_t offset = 0;

  fc::reflector< hive::protocol::signed_transaction >::visit( binary_view_visitor< hive::protocol::signed_transaction >( nodes, offset, tx ) );

  result.offsets = nodes;

  return result;
}

std::string serialize_transaction( const hive::protocol::signed_transaction& tx )
{
  hive::protocol::serialization_mode_controller::mode_guard guard( hive::protocol::transaction_serialization_type::hf26 );
  hive::protocol::serialization_mode_controller::set_pack( hive::protocol::transaction_serialization_type::hf26 );

  return fc::to_hex( fc::raw::pack_to_vector( tx ) );
}
} // namespace cpp
