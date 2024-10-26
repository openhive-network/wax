#pragma once

#include <core/binary_view/node_types.hpp>
#include <core/binary_view/traits.hpp>

#include <fc/optional.hpp>
#include <fc/static_variant.hpp>

#include <string>

namespace cpp { namespace binary_view {
  template< typename T, class NodeT >
  struct stringifier
  {
    // no need to static_assert here - general purpose trait does not contain `stringify` method so, even instantiated, compilation will fail. Otherwise GCC fails trying to generate some "implicit" code for this template.
    //static_assert( false, "Given type is not supported by binary view stringifier" );
  };

  template< typename T >
  struct stringifier< T, object_node >
  {
    static std::string stringify( const T& v )
    {
      return std::string{ "" };
    }
  };

  template< typename T, class NodeT >
  struct stringifier< fc::optional< T >, NodeT >
  {
    static std::string stringify( const T& v )
    {
      return std::string{ v.valid() ? stringifier< typename node_type< T >::node, T >::stringify( v.value() ) : "" };
    }
  };

  namespace detail {
    class static_variant_binary_stringify_visitor : public fc::visitor< std::string > {
    public:
      template< typename T >
      std::string operator()( const T& v ) const
      {
        return stringifier< typename node_type< T >::node, T >::stringify( v );
      }
    };
  } // namespace detail

  template< class NodeT, typename... Ts >
  struct stringifier< fc::static_variant< Ts... >, NodeT >
  {
    static std::string stringify( const fc::static_variant< Ts... >& v )
    {
      return v.visit( detail::static_variant_binary_stringify_visitor{} );
    }
  };

  template< typename T >
  struct stringifier< T, array_node >
  {
    static std::string stringify( const T& v )
    {
      return "Length: " + std::to_string( v.size() );
    }
  };

  template< typename T >
  struct stringifier< T, scalar_node >
  {
    static std::string stringify( const T& v )
    {
      return std::to_string( v );
    }
  };

  template< typename T >
  struct stringifier< fc::safe< T >, scalar_node >
  {
    static std::string stringify( const fc::safe< T >& v )
    {
      return stringifier< T, scalar_node >::stringify( v.value );
    }
  };

  template<>
  struct stringifier< bool, scalar_node >
  {
    inline static std::string TRUE_STR{ "true" };
    inline static std::string FALSE_STR{ "false" };

    static std::string stringify( bool v )
    {
      return v ? TRUE_STR : FALSE_STR;
    }
  };

  template<>
  struct stringifier< std::string, scalar_node >
  {
    static std::string stringify( const std::string& v )
    {
      return v;
    }
  };

  template<>
  struct stringifier< hive::protocol::fixed_string< 16 >, scalar_node >
  {
    static std::string stringify( const hive::protocol::fixed_string< 16 >& v )
    {
      return std::string{ v };
    }
  };

  template<>
  struct stringifier< hive::protocol::fixed_string< 32 >, scalar_node >
  {
    static std::string stringify( const hive::protocol::fixed_string< 32 >& v )
    {
      return std::string{ v };
    }
  };

  template<>
  struct stringifier< hive::protocol::json_string, scalar_node >
  {
    static std::string stringify( const hive::protocol::json_string& v )
    {
      return std::string{ v };
    }
  };

  template<>
  struct stringifier< hive::protocol::public_key_type, scalar_node >
  {
    static std::string stringify( const hive::protocol::public_key_type& v )
    {
      return std::string{ v };
    }
  };

  template<>
  struct stringifier< fc::sha256, scalar_node >
  {
    static std::string stringify( const fc::sha256& v )
    {
      return std::string{ v };
    }
  };

  template<>
  struct stringifier< fc::ripemd160, scalar_node >
  {
    static std::string stringify( const fc::ripemd160& v )
    {
      return std::string{ v };
    }
  };

  template<typename T, size_t N>
  struct stringifier< fc::array< T, N >, scalar_node >
  {
    static std::string stringify( const fc::array< T, N >& v )
    {
      return fc::to_hex( fc::raw::pack_to_vector( v ) );
    }
  };

  template<>
  struct stringifier< std::vector< char >, scalar_node >
  {
    static std::string stringify( const std::vector< char >& v )
    {
      return fc::to_hex( v );
    }
  };

  template<>
  struct stringifier< fc::time_point_sec, scalar_node >
  {
    static std::string stringify( const fc::time_point_sec& v )
    {
      return v.to_iso_string();
    }
  };

  template<>
  struct stringifier< hive::protocol::legacy_hive_asset_symbol_type, scalar_node >
  {
    static std::string stringify( const hive::protocol::legacy_hive_asset_symbol_type& v )
    {
      return fc::to_string( v.ser );
    }
  };
}} // namespace cpp::binary_view
