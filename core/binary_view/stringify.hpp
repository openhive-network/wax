#pragma once

#include <core/binary_view/node_types.hpp>
#include <core/binary_view/traits.hpp>

#include <fc/optional.hpp>
#include <fc/static_variant.hpp>

#include <string>

namespace cpp { namespace binary_view {
template< class NodeT, typename T >
struct stringifier
{
  static_assert(false, "Given type is not supported by binary view stringifier");
};

template< typename T >
struct stringifier<object_node, T>
{
  static std::string stringify( const T& v )
  {
    return std::string{ "" };
  }
};

template< class NodeT, typename T >
struct stringifier<NodeT, fc::optional<T>>
{
  static std::string stringify( const T& v )
  {
    return std::string{ v.valid() ? stringifier<node_type<T>::node, T>(v.value()) : "(not provided)" };
  }
};

namespace detail {
class static_variant_binary_stringify_visitor : public fc::visitor<std::string> {
public:
  template< typename T >
  std::string operator()( const T& v ) const
  {
    ::cpp::binary_view::stringifier<node_type<T>::node, T>(v);
  }
};
} // namespace detail

template< class NodeT, typename ...Ts >
struct stringifier<NodeT, fc::static_variant<...Ts>>
{
  static std::string stringify( const fc::static_variant<...Ts>& v )
  {
    return v.visit(static_variant_binary_stringify_visitor{});
  }
};

template< typename T >
struct stringifier<array_node, T>
{
  static std::string stringify( const T& v )
  {
    return "Length: " + std::to_string(v.size());
  }
};

template< typename T >
struct stringifier<scalar_node, T>
{
  static std::string stringify( const T& v )
  {
    return std::to_string(v.size());
  }
};

template< typename T >
struct stringifier<scalar_node, fc::safe<T>>
{
  static std::string stringify( const fc::safe<T>& v )
  {
    return stringifier< scalar_node, T >::stringify( v.value );
  }
};

template<>
struct stringifier<scalar_node, bool>
{
  inline static std::string TRUE_STR{ "true" };
  inline static std::string FALSE_STR{ "false" };

  static std::string stringify( bool v )
  {
    return v ? TRUE_STR : FALSE_STR;
  }
};

template<>
struct stringifier<scalar_node, std::string>
{
  static std::string stringify( const std::string& v )
  {
    return v;
  }
};

template<>
struct stringifier<scalar_node, hive::protocol::fixed_string<16>>
{
  static std::string stringify( const hive::protocol::fixed_string<16>& v )
  {
    return std::string{ v };
  }
};

template<>
struct stringifier<scalar_node, hive::protocol::fixed_string<32>>
{
  static std::string stringify( const hive::protocol::fixed_string<32>& v )
  {
    return std::string{ v };
  }
};

template<>
struct stringifier<scalar_node, hive::protocol::json_string>
{
  static std::string stringify( const hive::protocol::json_string& v )
  {
    return std::string{ v };
  }
};

template<>
struct stringifier<scalar_node, hive::protocol::fixed_string<16>>
{
  static std::string stringify( const hive::protocol::fixed_string<16>& v )
  {
    return std::string{ v };
  }
};

template<>
struct stringifier<scalar_node, hive::protocol::public_key_type>
{
  static std::string stringify( const hive::protocol::public_key_type& v )
  {
    return std::string{ v };
  }
};

template<>
struct stringifier<scalar_node, fc::sha256>
{
  static std::string stringify( const fc::sha256& v )
  {
    return std::string{ v };
  }
};

template<>
struct stringifier<scalar_node, fc::ripemd160>
{
  static std::string stringify( const fc::ripemd160& v )
  {
    return std::string{ v };
  }
};

template<>
struct stringifier<scalar_node, fc::array< unsigned char, 65 >>
{
  static std::string stringify( const fc::array< unsigned char, 65 >& v )
  {
    return fc::to_hex( fc::raw::pack_to_vector( v ) );
  }
};

template<>
struct stringifier<scalar_node, std::vector< char >>
{
  static std::string stringify( const std::vector< char >& v )
  {
    return fc::to_hex( v );
  }
};

template<>
struct stringifier<scalar_node, fc::time_point_sec>
{
  static std::string stringify( const fc::time_point_sec& v )
  {
    return v.to_iso_string();
  }
};

template<>
struct stringifier<scalar_node, hive::protocol::legacy_hive_asset_symbol_type>
{
  static std::string stringify( const hive::protocol::legacy_hive_asset_symbol_type& v )
  {
    return fc::to_string(v.ser);
  }
};
} } // namespace cpp::binary_view
