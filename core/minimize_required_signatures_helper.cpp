#include "core/minimize_required_signatures_helper.hpp"

#include <hive/protocol/transaction.hpp>

using namespace hive::protocol;
using namespace fc;

namespace cpp
{

namespace
{

/// Provides authorities passed by the caller and signing keys of witnesses obtained through caller's callback.
class cached_authority_getter final : public authority_getter_i
{
public:
  cached_authority_getter(const authorities_map_t& authorities_map,
    witness_public_key_getter_cb_t get_witness_key_cb, void* get_witness_key_fn)
    : _authorities_map(authorities_map), _get_witness_key_cb(get_witness_key_cb), _get_witness_key_fn(get_witness_key_fn) {}

  virtual std::optional<authority> get_active(const std::string& account_name) const override
  {
    return get_authorities(account_name).active;
  }

  virtual std::optional<authority> get_owner(const std::string& account_name) const override
  {
    return get_authorities(account_name).owner;
  }

  virtual std::optional<authority> get_posting(const std::string& account_name) const override
  {
    return get_authorities(account_name).posting;
  }

  virtual std::optional<public_key_type> get_witness_key(const std::string& witness_name) const override
  {
    try
    {
      return public_key_type(_get_witness_key_cb(witness_name, _get_witness_key_fn));
    }
    catch(const fc::exception&)
    {
      return {}; // callback gave no valid key (f.e. empty string) - witness is not known
    }
  }

private:
  /// The caller passes only authorities it fetched before, so account missing in the map is not necessarily
  /// nonexistent - throws instead of returning empty optional (which would mean that the account does not exist).
  const authorities_t& get_authorities(const std::string& account_name) const
  {
    auto it = _authorities_map.find(account_name);
    FC_ASSERT( it != _authorities_map.end(),
      "Tried to access authority for account ${a} but not cached.", ( "a", account_name ) );
    return it->second;
  }

  const authorities_map_t& _authorities_map;
  witness_public_key_getter_cb_t _get_witness_key_cb;
  void* _get_witness_key_fn;
};

} // namespace

std::vector<std::string> minimize_required_signatures_helper::minimize_required_signatures(
  const signed_transaction& transaction,
  const std::string& chain_id,
  const std::vector<std::string>& available_keys,
  const authorities_map_t& authorities_map,
  witness_public_key_getter_cb_t get_witness_key_cb,
  void* get_witness_key_fn,
  std::optional<uint32_t> max_recursion,
  std::optional<uint32_t> max_membership,
  std::optional<uint32_t> max_account_auths,
  bool allow_strict_and_mixed_authorities)
{
  flat_set<public_key_type> _available_keys;
  for (const auto& key : available_keys)
    _available_keys.emplace(key);
  cached_authority_getter authority_getters(authorities_map, get_witness_key_cb, get_witness_key_fn);
  uint32_t _max_recursion = max_recursion ? *max_recursion : HIVE_MAX_SIG_CHECK_DEPTH;
  uint32_t _max_membership = max_membership ? *max_membership : HIVE_MAX_AUTHORITY_MEMBERSHIP;
  uint32_t _max_account_auths = max_account_auths ? *max_account_auths : HIVE_MAX_SIG_CHECK_ACCOUNTS;

  const auto signatures = transaction.minimize_required_signatures(allow_strict_and_mixed_authorities, chain_id_type(chain_id), _available_keys,
    authority_getters, _max_recursion, _max_membership, _max_account_auths);

  std::vector<std::string> result;
  for (const auto& signature : signatures)
    result.emplace_back(static_cast<std::string>(signature));

  return result;
}

} // namespace cpp
