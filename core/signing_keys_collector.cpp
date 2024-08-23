#include "signing_keys_collector.hpp"

namespace cpp
{

std::vector<std::string> signing_keys_collector::collect_signing_keys(const hive::protocol::transaction& transaction)
{
  fc::flat_set<hive::protocol::public_key_type> keys;
  hive::protocol::signing_keys_collector::collect_signing_keys(&keys, transaction);
  std::vector<std::string> result;

  result.reserve(keys.size());
  for (const auto& key : keys)
    result.emplace_back(static_cast<std::string>(key));

  return result;
}

void signing_keys_collector::prepare_account_authority_data( const std::vector< account_name_type >& accounts )
{
  // Intentionally ignore prepare_account_authority_data calls
}

const hive::protocol::authority& signing_keys_collector::get_active( const account_name_type& account_name ) const
{
  return get_authorities(account_name).active;
}

const hive::protocol::authority& signing_keys_collector::get_owner( const account_name_type& account_name ) const
{
  return get_authorities(account_name).owner;
}

const hive::protocol::authority& signing_keys_collector::get_posting( const account_name_type& account_name ) const
{
  return get_authorities(account_name).posting;
}

inline
const signing_keys_collector::authorities_t& signing_keys_collector::get_authorities( const account_name_type& account_name ) const
{
  auto [it, inserted] = cached_account_authorities.emplace(account_name, authorities_t());
  if (inserted)
    it->second = get_account_authorities(account_name);
  return it->second;
}

} // namespace cpp
