#pragma once

#include "core/hive_protocol_types.hpp"

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
  using authorities_t = hive::protocol::authorities_t;
  using authorities_map_t = hive::protocol::authorities_map_t;
  using retrieve_authorities_t = std::function<authorities_map_t(const std::vector<std::string>&)>;

  signing_keys_collector(const retrieve_authorities_t& _retrieve_authorities)
    : retrieve_authorities(_retrieve_authorities) {}
  virtual ~signing_keys_collector() {}

  std::vector<std::string> collect_signing_keys(const hive::protocol::transaction& transaction);

private:
  virtual void prepare_account_authority_data( const std::vector< account_name_type >& accounts ) override;

  virtual const authority& get_active( const account_name_type& account_name ) const override;
  virtual const authority& get_owner( const account_name_type& account_name ) const override;
  virtual const authority& get_posting( const account_name_type& account_name ) const override;

  inline const authorities_t& get_authorities( const account_name_type& account_name ) const;

private:
  retrieve_authorities_t retrieve_authorities;
  std::map<account_name_type, authorities_t> account_authorities;
};

} // namespace cpp
