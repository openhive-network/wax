#pragma once
#include <core/binary_view/traits.hpp>
#include <core/binary_view/node_types.hpp>
#include <core/binary_view/stringify.hpp>
#include <core/types.hpp>

#include <fc/io/iobuffer.hpp>
#include <fc/io/raw.hpp>

#include <cstdint>

namespace cpp { namespace binary_view {

namespace detail {
  template< typename GetSizeT >
  uint32_t get_size( const GetSizeT& v )
  {
    auto ss = fc::size_stream{};

    fc::raw::pack( ss, v );

    return (uint32_t) ss.size();
  }

  /** Calculates the value binary size and appends returned value to the local offset variable */
  template< typename GetSizeT >
  uint32_t push_offset( uint32_t& offset, const GetSizeT& v )
  {
    const uint32_t size = get_size( v );

    offset += size;

    return size;
  }
} // namespace detail

template<typename NodeT, typename T>
struct node_appender
{
  static void append(const char* name, std::vector< binary_data_node >& nodes, uint32_t& offset, const T& v)
  {
    binary_data_node node{
      std::string{ name }, node_type<T>::node::name, offset, detail::push_offset( offset, v ), stringifier< NodeT, T >::stringify( v )
    };

    nodes.emplace_back( node );
  }
};

} } // namespace cpp::binary_view
