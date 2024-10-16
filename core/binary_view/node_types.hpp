#pragma once

#include <string>

namespace cpp { namespace binary_view {

struct object_node {
  inline static std::string name{ "object" };
};
struct array_node {
  inline static std::string name{ "array" };
};
struct scalar_node {
  inline static std::string name{ "scalar" };
};

} } // cpp::binary_view
