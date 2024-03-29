/// Implementation file for protocol_impl class template methods

#include "core/protocol_impl.hpp"

#include "core/utils.hpp"
#include "core/signing_keys_collector.hpp"

#include <hive/protocol/authority.hpp>
#include <hive/protocol/operations.hpp>
#include <hive/protocol/transaction.hpp>
#include <hive/protocol/types.hpp>

#include <fc/io/json.hpp>
#include <fc/bitutil.hpp>

namespace cpp {

struct validate_visitor
{
  typedef void result_type;

  template< typename T >
  void operator()(const T& x)
  {
    x.validate();
  }
};

hive::protocol::signed_transaction get_transaction(const std::string& trx)
{
  return fc::json::from_string(trx, fc::json::format_validation_mode::full).as<hive::protocol::signed_transaction>();
}

template <class FoundationProvider>
inline
result protocol_impl<FoundationProvider>::cpp_validate_operation(const std::string& operation)
{
  return method_wrapper([&](result&)
    {
      fc::variant _v = fc::json::from_string(operation, fc::json::format_validation_mode::full);
      hive::protocol::operation _operation = _v.as<hive::protocol::operation>();

      validate_visitor _visitor;
      _operation.visit(_visitor);
    });
}

template <class FoundationProvider>
inline
result protocol_impl<FoundationProvider>::cpp_validate_transaction(const std::string& transaction)
{
  return method_wrapper([&](result&)
    {
      get_transaction(transaction).validate();
    });
}

template <class FoundationProvider>
inline
result protocol_impl<FoundationProvider>::cpp_calculate_transaction_id(const std::string& transaction)
{
  return method_wrapper([&](result& _result)
    {
      _result.content = get_transaction(transaction).id(hive::protocol::transaction_serialization_type::hf26).str();
    });
}

template <class FoundationProvider>
inline
result protocol_impl<FoundationProvider>::cpp_calculate_legacy_transaction_id(const std::string& transaction)
{
  return method_wrapper([&](result& _result)
    {
      _result.content = get_transaction(transaction).id(hive::protocol::transaction_serialization_type::legacy).str();
    });
}

template <class FoundationProvider>
inline
result protocol_impl<FoundationProvider>::cpp_calculate_sig_digest(const std::string& transaction, const std::string& chain_id)
{
  return method_wrapper([&](result& _result)
    {
      const auto _transaction = get_transaction(transaction);
      const auto _digest = _transaction.sig_digest(hive::protocol::chain_id_type(chain_id), hive::protocol::pack_type::hf26);

      _result.content = _digest.str();
    });
}

template <class FoundationProvider>
inline
result protocol_impl<FoundationProvider>::cpp_calculate_legacy_sig_digest(const std::string& transaction, const std::string& chain_id)
  {
  return method_wrapper([&](result& _result)
    {
      const auto _transaction = get_transaction(transaction);
      const auto _digest = _transaction.sig_digest(hive::protocol::chain_id_type(chain_id), hive::protocol::pack_type::legacy);

      _result.content = _digest.str();
    });
  }

template <class FoundationProvider>
inline
result protocol_impl<FoundationProvider>::cpp_serialize_transaction(const std::string& transaction)
{
  return method_wrapper([&](result& _result)
    {
      hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
      hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

      const auto _transaction = get_transaction(transaction);
      const auto _packed = fc::to_hex(fc::raw::pack_to_vector(_transaction));
      _result.content = std::string(_packed.data(), _packed.size());
    });
}

template <class FoundationProvider>
inline
result protocol_impl<FoundationProvider>::cpp_deserialize_transaction(const std::string& transaction)
{
  return method_wrapper([&](result& _result)
    {
      hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
      hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

      //std::string raw_data(transaction);
      std::vector<char> raw_data(transaction.size());
      fc::from_hex(transaction, raw_data.data(), raw_data.size());

      hive::protocol::signed_transaction _transaction;
      fc::raw::unpack_from_char_array(raw_data.data(), static_cast<uint32_t>(raw_data.size()), _transaction, 0);

      _result.content = fc::json::to_string(_transaction);
    });
}

template <class FoundationProvider>
inline
required_authority_collection protocol_impl<FoundationProvider>::cpp_collect_transaction_required_authorities(const std::string& transaction)
{
  return cpp::safe_exception_wrapper([&]() -> required_authority_collection {
  const auto _transaction = get_transaction(transaction);

  typedef flat_set<hive::protocol::account_name_type> raw_account_set;

  raw_account_set active;
  raw_account_set owner;
  raw_account_set posting;
  raw_account_set witness;
  std::vector<hive::protocol::authority> other_authorities;
  _transaction.get_required_authorities(active, owner, posting, witness, other_authorities);

  required_authority_collection ret_val;
  ret_val.posting_accounts.insert(ret_val.posting_accounts.end(), posting.cbegin(), posting.cend());
  ret_val.owner_accounts.insert(ret_val.owner_accounts.end(), owner.cbegin(), owner.cend());
  ret_val.active_accounts.insert(ret_val.active_accounts.end(), active.cbegin(), active.cend());

  for(const auto& auth : other_authorities)
  {
    wax_authority wa;
    wa.weight_threshold = auth.weight_threshold;

    for(const auto& [account, weight] : auth.account_auths)
      wa.account_auths.emplace(account.operator std::string(), weight);

    for(const auto& [key, weight] : auth.key_auths)
      wa.key_auths.emplace(key.operator std::string(), weight);

    ret_val.other_authorities.emplace_back(wa);
  }

  return ret_val;
  });
}

static inline
signing_keys_collector::authorities_t convert_wax_authorities_to_authorities(const wax_authorities& w_authorities)
{
  using authority = hive::protocol::authority;
  auto convert_wax_key_auth_map_to_hive_key_auth_map = [](const wax_authority::authority_map& auth_map) -> authority::key_authority_map {
    authority::key_authority_map result;
    for (const auto& auth : auth_map)
      result.emplace(auth.first, auth.second);
    return result;
    };

  authority active;
  const auto& wax_active = w_authorities.active;
  active.weight_threshold = wax_active.weight_threshold;
  active.key_auths = convert_wax_key_auth_map_to_hive_key_auth_map(wax_active.key_auths);
  active.account_auths = authority::account_authority_map(wax_active.account_auths.cbegin(), wax_active.account_auths.cend());

  authority owner;
  const auto& wax_owner = w_authorities.owner;
  owner.weight_threshold = wax_owner.weight_threshold;
  owner.key_auths = convert_wax_key_auth_map_to_hive_key_auth_map(wax_owner.key_auths);
  owner.account_auths = authority::account_authority_map(wax_owner.account_auths.cbegin(), wax_owner.account_auths.cend());

  authority posting;
  const auto& wax_posting = w_authorities.posting;
  posting.weight_threshold = wax_posting.weight_threshold;
  posting.key_auths = convert_wax_key_auth_map_to_hive_key_auth_map(wax_posting.key_auths);
  posting.account_auths = authority::account_authority_map(wax_posting.account_auths.cbegin(), wax_posting.account_auths.cend());

  return { std::move(active), std::move(owner), std::move(posting) };
}

template <class FoundationProvider>
inline
std::vector<std::string> protocol_impl<FoundationProvider>::cpp_collect_signing_keys(
  const std::string& transaction, retrieve_authorities_cb_t retrieve_authorities_cb, void* retrieve_authorities_user_data)
{
  return cpp::safe_exception_wrapper([&]() -> std::vector<std::string> {
    const auto tx = get_transaction(transaction);
    signing_keys_collector::retrieve_authorities_t retrieve_authorities = [&] (const std::vector<std::string>& accounts)
      {
      const auto wax_authorities_map = retrieve_authorities_cb(accounts, retrieve_authorities_user_data);
      signing_keys_collector::authorities_map_t authorities_map;
      for (const auto& wax_authorities_info : wax_authorities_map)
      {
        signing_keys_collector::account_name_type account = wax_authorities_info.first;
        signing_keys_collector::authorities_t authorities = convert_wax_authorities_to_authorities(wax_authorities_info.second);
        authorities_map.emplace(account, std::move(authorities));
      }

      return authorities_map;
      };

    signing_keys_collector signing_keys_collector(retrieve_authorities);
    std::vector<std::string> result = signing_keys_collector.collect_signing_keys(tx);

    return result;
  });
}

} /// namespace cpp
