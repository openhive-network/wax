#pragma once

#include <map>

#include <hive/protocol/authority.hpp>

namespace hive::protocol
{
struct authorities_t
  {
  authority active;
  authority owner;
  authority posting;
  };

using authorities_map_t = std::map<account_name_type, authorities_t>;

} // namespace hive::protocol
