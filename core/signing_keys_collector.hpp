#pragma once

#include <hive/protocol/transaction_util.hpp>

#include <vector>
#include <string>
#include <functional>
#include <map>

namespace cpp
{

class signing_keys_collector : public hive::protocol::signing_keys_collector
{
public:
  using authority = hive::protocol::authority;
  using account_name_type = hive::protocol::account_name_type;

  struct authorities_t
    {
    authority active;
    authority owner;
    authority posting;
    };

  using get_account_authorities_t = std::function<authorities_t(const std::string&)>;

  signing_keys_collector(const get_account_authorities_t& _get_account_authorities)
    : get_account_authorities(_get_account_authorities) {}
  virtual ~signing_keys_collector() {}

  std::vector<std::string> collect_signing_keys(const hive::protocol::transaction& transaction);

private:
  virtual void prepare_account_authority_data( const std::vector< account_name_type >& accounts ) override;

  virtual const authority& get_active( const account_name_type& account_name ) const override;
  virtual const authority& get_owner( const account_name_type& account_name ) const override;
  virtual const authority& get_posting( const account_name_type& account_name ) const override;

  inline const authorities_t& get_authorities( const account_name_type& account_name ) const;

private:
  get_account_authorities_t get_account_authorities;
  mutable std::map<account_name_type, authorities_t> cached_account_authorities;
};

} // namespace cpp
