#include <core/binary_view_helper.hpp>
#include <core/types.hpp>

#include <hive/protocol/misc_utilities.hpp>
#include <hive/protocol/types_fwd.hpp>

#include <fc/crypto/hex.hpp>
#include <fc/io/iobuffer.hpp>
#include <fc/io/raw_fwd.hpp>
#include <fc/io/varint.hpp>
#include <fc/time.hpp>

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
template<>
struct stringifier< hive::protocol::fixed_string<16> >
{
  static std::string value( const hive::protocol::fixed_string<16>& v )
  {
    return v.operator std::string();
  }
};
template<>
struct stringifier< fc::array< unsigned char, 65 > >
{
  static std::string value( const fc::array< unsigned char, 65 >& v )
  {
    return fc::to_hex( fc::raw::pack_to_vector( v ) );
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
template< typename T >
struct stringifier< fc::flat_set< T > >
{
  static std::string value( const fc::flat_set< T >& v )
  {
    return "Length: " + fc::to_string( v.size() );
  }
};
template< typename T >
struct stringifier< ::flat_set_ex< T > >
{
  static std::string value( const ::flat_set_ex< T >& v )
  {
    return "Length: " + fc::to_string( v.size() );
  }
};

template< typename T >
struct is_hive_array : public std::false_type {};

template<typename T>
struct is_hive_array<std::vector<T>> : public std::true_type {};

template<typename T>
struct is_hive_array< fc::flat_set<T>> : public std::true_type {};

template<typename T>
struct is_hive_array< ::flat_set_ex<T>> : public std::true_type {};

#define CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR( ... )                                           \
  void add( const char* name, const __VA_ARGS__ & v ) const                                                   \
  {                                                                                            \
    binary_data_node node{                                                                     \
      std::string{ name }, SCALAR_TYPE, offset, push_offset( v ), stringifier< __VA_ARGS__ >::value( v ) \
    };                                                                                         \
    nodes.emplace_back( node );                                                                \
  }                                                                                            \
  void __unused_scalar_( __VA_ARGS__ ) const

#define CPP_BINARY_VIEW_VISITOR_REGISTER_ARRAY( ... ) \
  template< typename M > \
  void add( const char* name, const __VA_ARGS__ & v ) const\
  {\
    /* Dynamic size */ \
    uint32_t array_offset = offset + get_size( fc::unsigned_int{ (uint32_t) v.size()} );\
    std::vector< binary_data_node > array_nodes; \
    size_t i = 0; \
    for( const auto& item : v )\
    {\
      uint32_t item_offset = array_offset + get_size( item );\
\
      if constexpr( std::is_same< typename fc::reflector< M >::is_defined, fc::true_type >::value )\
      { /* All reflected types are objects, so we have to create another nested level of object type */\
        std::vector< binary_data_node > item_nodes;\
\
        fc::reflector< M >::visit( binary_view_visitor< M >{ item_nodes, item_offset, item } );\
\
        binary_data_node node{\
          std::to_string(i), OBJECT_TYPE, array_offset, push_offset( item ), "", 0, item_nodes\
        };\
        array_nodes.emplace_back( node );\
      }\
      else /* Rest of the cases has to handle offsets and pushing elements to arrays by themselves*/ \
        binary_view_visitor< M >{ array_nodes, array_offset, item }.add(std::to_string(i).c_str(), item);\
\
      array_offset = item_offset;\
      ++i;\
    }\
\
    binary_data_node node{\
      std::string{ name }, ARRAY_TYPE, offset, push_offset( v ), stringifier< __VA_ARGS__ >::value( v ), v.size(), array_nodes\
    };\
    nodes.emplace_back( node );\
  } \
  template< typename M > \
  void __unused_array_( const __VA_ARGS__ & v ) const

class static_variant_visitor : public fc::visitor<uint32_t> {
private:
  uint32_t& offset;
  std::vector< binary_data_node >& nodes;

public:
  static_variant_visitor( std::vector< binary_data_node >& nodes, uint32_t& offset )
    : nodes( nodes ), offset( offset )
  {}

  template< typename T >
  uint32_t operator()( const T& v ) const;
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

  // Scalar types:
  CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR( bool );
  CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR( uint8_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR( int8_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR( uint16_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR( int16_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR( uint32_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR( int32_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR( uint64_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR( int64_t );
  CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR( fc::string );
  CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR( hive::protocol::fixed_string<16> ); // account_name_type
  CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR( fc::array< unsigned char, 65 > ); // compact_signature

  // Array types:
  CPP_BINARY_VIEW_VISITOR_REGISTER_ARRAY( std::vector<M> );
  CPP_BINARY_VIEW_VISITOR_REGISTER_ARRAY( fc::flat_set<M> );
  CPP_BINARY_VIEW_VISITOR_REGISTER_ARRAY( ::flat_set_ex<M> );

  // Other types:
  void add( const char* name, const fc::time_point_sec& v ) const
  {
    binary_data_node node{
      std::string{ name }, SCALAR_TYPE, offset, push_offset( v ), v.to_iso_string()
    };
    nodes.emplace_back( node );
  }

  template< typename... Ts >
  void add( const char* name, const fc::static_variant< Ts... >& v ) const
  {
    // Dynamic size
    uint32_t whichsize = get_size( fc::unsigned_int{ (uint32_t) v.which() } );

    binary_data_node whichnode{
      std::string{ "type" }, SCALAR_TYPE, offset, whichsize, v.get_stored_type_name( true )
    };
    nodes.emplace_back( whichnode );

    uint32_t offset_fwd = offset + whichsize;
    std::vector< binary_data_node > nodes_fwd;

    uint32_t valuesize = v.visit( static_variant_visitor{ nodes_fwd, offset_fwd } );

    binary_data_node valuenode{
      std::string{ "value" }, OBJECT_TYPE, offset + whichsize, valuesize, "", 0, nodes_fwd
    };
    nodes.emplace_back( valuenode );
  }

  template< typename M >
  void add( const char* name, const M& v ) const
  {
    push_offset( v ); // XXX: Just for debugging purposes. Should be replaced with the actual function code here
  }

  uint32_t& offset;
  std::vector< binary_data_node >& nodes;
  const T& val;

  inline static std::string SCALAR_TYPE{ "scalar" };
  inline static std::string ARRAY_TYPE{ "array" };
  inline static std::string OBJECT_TYPE{ "object" };
};

#undef CPP_BINARY_VIEW_VISITOR_REGISTER_ARRAY
#undef CPP_BINARY_VIEW_VISITOR_REGISTER_SCALAR

template< typename T >
uint32_t static_variant_visitor::operator()( const T& v ) const
{
  static_assert(!is_hive_array< T >::value, "We currently do not support arrays in static_variants when converting to binary view");
  static_assert(!std::is_scalar< T >::value, "We only support objects in static_variants when converting to binary view");

  fc::reflector< T >::visit( binary_view_visitor< T >{ nodes, offset, v } );

  return binary_view_visitor< T >::get_size( v );
}

binary_data generate_binary_transaction_metadata( const hive::protocol::signed_transaction& tx )
{
  binary_data result;
  result.binary = serialize_transaction( tx );

  std::vector< binary_data_node > nodes;

  uint32_t offset = 0;

  fc::reflector< hive::protocol::signed_transaction >::visit( binary_view_visitor< hive::protocol::signed_transaction >{ nodes, offset, tx } );

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
