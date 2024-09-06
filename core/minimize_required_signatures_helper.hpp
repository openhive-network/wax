#pragma once

#include <string>
#include <vector>
#include <optional>

#include "core/types.hpp"
#include "core/hive_protocol_types.hpp"

namespace hive::protocol
{
class signed_transaction;
} // namespace hive::protocol

namespace cpp
{

class minimize_required_signatures_helper
{
public:
  static std::vector<std::string> minimize_required_signatures(
    const hive::protocol::signed_transaction& transaction,
    const std::string& chain_id,
    const std::vector<std::string>& available_keys,
    const hive::protocol::authorities_map_t& authorities_map,
    witness_public_key_getter_cb_t get_witness_key_cb,
    void* get_witness_key_fn,
    std::optional<uint32_t> max_recursion,
    std::optional<uint32_t> max_membership,
    std::optional<uint32_t> max_account_auths);
};

} // namespace cpp
