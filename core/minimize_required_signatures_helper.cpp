#include "core/minimize_required_signatures_helper.hpp"

#include <hive/protocol/transaction.hpp>

using namespace hive::protocol;
using namespace fc;

namespace cpp
{

std::vector<std::string> minimize_required_signatures_helper::minimize_required_signatures(
  const signed_transaction& transaction,
  const std::string& chain_id,
  const std::vector<std::string>& available_keys,
  const authorities_map_t& authorities_map,
  witness_public_key_getter_cb_t get_witness_key_cb,
  void* get_witness_key_fn,
  std::optional<uint32_t> max_recursion,
  std::optional<uint32_t> max_membership,
  std::optional<uint32_t> max_account_auths)
{
  flat_set<public_key_type> _available_keys;
  for (const auto& key : available_keys)
    _available_keys.emplace(key);
  auto get_authorities = [&] (const std::string& account_name) -> const authorities_t& {
    auto it = authorities_map.find(account_name);
    FC_ASSERT( it != authorities_map.end(),
      "Tried to access authority for account ${a} but not cached.", ( "a", account_name ) );
    return it->second;
    };
  authority_getter get_active = [&] (const std::string& account_name) {
    return get_authorities(account_name).active;
    };
  authority_getter get_owner = [&] (const std::string& account_name) {
    return get_authorities(account_name).owner;
    };
  authority_getter get_posting = [&] (const std::string& account_name) {
    return get_authorities(account_name).posting;
    };
  witness_public_key_getter _get_witness_key = [&] (const std::string& witness_name) {
    return public_key_type(get_witness_key_cb(witness_name, get_witness_key_fn));
    };
  uint32_t _max_recursion = max_recursion ? *max_recursion : HIVE_MAX_SIG_CHECK_DEPTH;
  uint32_t _max_membership = max_membership ? *max_membership : HIVE_MAX_AUTHORITY_MEMBERSHIP;
  uint32_t _max_account_auths = max_account_auths ? *max_account_auths : HIVE_MAX_SIG_CHECK_ACCOUNTS;

  const auto signatures = transaction.minimize_required_signatures(chain_id_type(chain_id), _available_keys,
    get_active, get_owner, get_posting, _get_witness_key, _max_recursion, _max_membership, _max_account_auths);

  std::vector<std::string> result;
  for (const auto& signature : signatures)
    result.emplace_back(static_cast<std::string>(signature));

  return result;
}

} // namespace cpp
