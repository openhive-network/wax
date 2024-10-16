#pragma once

#include <core/binary_view/node_types.hpp>

#include <string>
#include <type_traits>

#include <fc/optional.hpp>

namespace cpp { namespace binary_view {

// static_variant + other reflected object types (e.g. hive::protocol::asset)
template< typename T >
struct node_type
{
  using type = T;
  using node = object_node;
};

template< typename T >
struct node_type<fc::optional<T>>
{
  using type = fc::optional<T>;
  using node = node_type<T>::node;
};

template< typename T >
struct node_type<fc::safe<T>>
{
  using type = fc::safe<T>;
  using node = node_type<T>::node;
};

template< typename T >
struct node_type<std::vector<T>>
{
  using type = std::vector<T>;
  using node = array_node;
};

template< typename T >
struct node_type<fc::flat_set<T>>
{
  using type = fc::flat_set<T>;
  using node = array_node;
};

template< typename T >
struct node_type<::flat_set_ex<T>>
{
  using type = ::flat_set_ex<T>;
  using node = array_node;
};

template<>
struct node_type<bool>
{
  using type = bool;
  using node = scalar_node;
};

template<>
struct node_type<uint8_t>
{
  using type = uint8_t;
  using node = scalar_node;
};

template<>
struct node_type<int8_t>
{
  using type = int8_t;
  using node = scalar_node;
};

template<>
struct node_type<uint16_t>
{
  using type = uint16_t;
  using node = scalar_node;
};

template<>
struct node_type<int16_t>
{
  using type = int16_t;
  using node = scalar_node;
};

template<>
struct node_type<uint32_t>
{
  using type = uint32_t;
  using node = scalar_node;
};

template<>
struct node_type<int32_t>
{
  using type = int32_t;
  using node = scalar_node;
};

template<>
struct node_type<uint64_t>
{
  using type = uint64_t;
  using node = scalar_node;
};

template<>
struct node_type<int64_t>
{
  using type = int64_t;
  using node = scalar_node;
};

template<>
struct node_type<std::string>
{
  using type = std::string;
  using node = scalar_node;
};

template<>
struct node_type<hive::protocol::fixed_string<16>>
{
  using type = hive::protocol::fixed_string<16>;
  using node = scalar_node;
};

template<>
struct node_type<fc::array< unsigned char, 65 >>
{
  using type = fc::array< unsigned char, 65 >;
  using node = scalar_node;
};

template<>
struct node_type<fc::time_point_sec>
{
  using type = fc::time_point_sec;
  using node = scalar_node;
};

template<>
struct node_type<hive::protocol::json_string>
{
  using type = hive::protocol::json_string;
  using node = scalar_node;
};

template<>
struct node_type<hive::protocol::public_key_type>
{
  using type = hive::protocol::public_key_type;
  using node = scalar_node;
};

template<>
struct node_type<std::vector<char>>
{
  using type = std::vector<char>;
  using node = scalar_node;
};

template<>
struct node_type<hive::protocol::fixed_string<32>>
{
  using type = hive::protocol::fixed_string<32>;
  using node = scalar_node;
};

template<>
struct node_type<fc::sha256>
{
  using type = fc::sha256;
  using node = scalar_node;
};

template<>
struct node_type<fc::ripemd160>
{
  using type = fc::ripemd160;
  using node = scalar_node;
};

template<>
struct node_type<hive::protocol::legacy_hive_asset_symbol_type>
{
  using type = hive::protocol::legacy_hive_asset_symbol_type;
  using node = scalar_node;
};
} } // namespace cpp::binary_view
