#pragma once

#include <core/binary_view/node_types.hpp>

#include <string>
#include <type_traits>

#include <fc/optional.hpp>

namespace cpp { namespace binary_view {

  template< typename T >
  struct is_hive_array : public std::false_type
  {};

  template< typename T >
  struct is_hive_array< std::vector< T > > : public std::true_type
  {};

  template< typename T >
  struct is_hive_array< fc::flat_set< T > > : public std::true_type
  {};

  template< typename T >
  struct is_hive_array< ::flat_set_ex< T > > : public std::true_type
  {};

  // static_variant + other reflected object types (e.g. hive::protocol::asset)
  template< typename T, bool IsScalar = std::is_scalar< T >::value >
  struct node_type
  {
    using type = T;
    using node = object_node;
  };

  /** Specialization to be used for all scalar types instead of specific types */
  template< typename TScalarType >
  struct node_type< TScalarType, true >
  {
    using type = TScalarType;
    using node = scalar_node;
  };

  template< typename T, bool IsScalar >
  struct node_type< fc::optional< T >, IsScalar >
  {
    using type = fc::optional< T >;
    using node = typename node_type< T >::node;
  };

  template< bool IsScalar, typename T >
  struct node_type< fc::safe< T >, IsScalar >
  {
    using type = fc::safe< T >;
    using node = typename node_type< T >::node;
  };

  /** Specialization for std containers should also take other template arguments
   */
  template< bool IsScalar, typename T, typename... A >
  struct node_type< std::vector< T, A... >, IsScalar >
  {
    using type = std::vector< T, A... >;
    using node = array_node;
  };

  template< bool IsScalar, typename T, typename... A >
  struct node_type< fc::flat_set< T, A... >, IsScalar >
  {
    using type = fc::flat_set< T, A... >;
    using node = array_node;
  };

  template< bool IsScalar, typename T >
  struct node_type< ::flat_set_ex< T >, IsScalar >
  {
    using type = ::flat_set_ex< T >;
    using node = array_node;
  };

  template<bool IsScalar>
  struct node_type< std::string, IsScalar >
  {
    using type = std::string;
    using node = scalar_node;
  };

  template<bool IsScalar, typename StorageT>
  struct node_type< hive::protocol::fixed_string_impl< StorageT >, IsScalar >
  {
    using type = hive::protocol::fixed_string_impl< StorageT >;
    using node = scalar_node;
  };

  template<bool IsScalar, typename T, size_t N>
  struct node_type< fc::array< T, N >, IsScalar >
  {
    using type = fc::array< T, N >;
    using node = scalar_node;
  };

  template<bool IsScalar>
  struct node_type< fc::time_point_sec, IsScalar >
  {
    using type = fc::time_point_sec;
    using node = scalar_node;
  };

  template<bool IsScalar>
  struct node_type< hive::protocol::json_string, IsScalar >
  {
    using type = hive::protocol::json_string;
    using node = scalar_node;
  };

  template<bool IsScalar>
  struct node_type< hive::protocol::public_key_type, IsScalar >
  {
    using type = hive::protocol::public_key_type;
    using node = scalar_node;
  };

  template<bool IsScalar>
  struct node_type< std::vector< char >, IsScalar >
  {
    using type = std::vector< char >;
    using node = scalar_node;
  };

  template<bool IsScalar>
  struct node_type< fc::sha256, IsScalar >
  {
    using type = fc::sha256;
    using node = scalar_node;
  };

  template<bool IsScalar>
  struct node_type< fc::ripemd160, IsScalar >
  {
    using type = fc::ripemd160;
    using node = scalar_node;
  };

  template<bool IsScalar>
  struct node_type< hive::protocol::asset_symbol_type, IsScalar >
  {
    using type = hive::protocol::asset_symbol_type;
    using node = scalar_node;
  };
}} // namespace cpp::binary_view
