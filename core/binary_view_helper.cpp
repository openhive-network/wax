#include <core/binary_view_helper.hpp>
#include <core/types.hpp>

#include <hive/protocol/misc_utilities.hpp>

#include <fc/crypto/hex.hpp>
#include <fc/io/iobuffer.hpp>
#include <fc/io/raw_fwd.hpp>

#include <cstdint>
#include <string>
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

#define CPP_BINARY_VIEW_VISITOR_REGISTER_POD( type )                                           \
  void add( const char* name, type v ) const                                                   \
  {                                                                                            \
    binary_data_node node{                                                                     \
      std::string{ name }, POD_TYPE, offset, push_offset( v ), stringifier< type >::value( v ) \
    };                                                                                         \
    nodes.emplace_back( node );                                                                \
  }                                                                                            \
  void __unused_##type() const

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

private:
  /** Calculates the value binary size and appends returned value to the local offset variable */
  template< typename GetSizeT >
  uint32_t push_offset( const GetSizeT& v ) const
  {
    auto ss = fc::size_stream{};

    fc::raw::pack( ss, v );

    const uint32_t size = (uint32_t) ss.size();

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

  template< typename M >
  void add( const char* name, const M& v ) const
  {
    push_offset(v); // XXX: Just for debugging purposes. Should be replaced with the actual function code here
  }

  uint32_t& offset;
  std::vector< binary_data_node >& nodes;
  const T& val;

  inline static std::string POD_TYPE{ "pod" };
  inline static std::string ARRAY_TYPE{ "array" };
  inline static std::string OBJECT_TYPE{ "object" };
};

#undef CPP_BINARY_VIEW_VISITOR_REGISTER_POD

binary_data generate_binary_transaction_metadata( const hive::protocol::signed_transaction& tx )
{
  binary_data result;
  result.binary = serialize_transaction( tx );

  std::vector< binary_data_node > nodes;

  uint32_t offset;

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
