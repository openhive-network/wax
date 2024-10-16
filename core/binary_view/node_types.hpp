#pragma once

#include <string>

namespace cpp { namespace binary_view {

  enum class node_type_enum
  {
    object,
    array,
    scalar
  };

  struct object_node
  {
    inline static std::string name{ "object" };

    static constexpr node_type_enum value{ node_type_enum::object };
  };
  struct array_node
  {
    inline static std::string name{ "array" };

    static constexpr node_type_enum value{ node_type_enum::array };
  };
  struct scalar_node
  {
    inline static std::string name{ "scalar" };

    static constexpr node_type_enum value{ node_type_enum::scalar };
  };

}} // namespace cpp::binary_view
