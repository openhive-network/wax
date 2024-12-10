/// Implementation file for protocol_impl class template methods

#include "core/protocol_impl.hpp"
#include <core/binary_view_helper.hpp>

#include "core/utils.hpp"
#include "core/hive_protocol_types.hpp"
#include "core/signing_keys_collector.hpp"
#include "core/minimize_required_signatures_helper.hpp"

#include <hive/protocol/authority.hpp>
#include <hive/protocol/operations.hpp>
#include <hive/protocol/transaction.hpp>
#include <hive/protocol/forward_impacted.hpp>
#include <hive/protocol/types.hpp>
#include <hive/protocol/get_config.hpp>

#include <fc/io/json.hpp>
#include <fc/container/flat.hpp>
#include <fc/bitutil.hpp>
#include <fc/container/flat.hpp>

#include <fc/crypto/hex.hpp>

#include <algorithm>

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
std::vector<std::string> protocol_impl<FoundationProvider>::cpp_operation_get_impacted_accounts(const std::string& operation) const
{
  fc::variant _v = fc::json::from_string(operation, fc::json::format_validation_mode::full);
  hive::protocol::operation _operation = _v.as<hive::protocol::operation>();

  fc::flat_set<hive::protocol::account_name_type> impacted;
  hive::app::operation_get_impacted_accounts(_operation, impacted);

  return std::vector<std::string>{ impacted.begin(), impacted.end() };
}

template <class FoundationProvider>
inline
std::vector<std::string> protocol_impl<FoundationProvider>::cpp_transaction_get_impacted_accounts(const std::string& transaction) const
{
  fc::variant _v = fc::json::from_string(transaction, fc::json::format_validation_mode::full);

  hive::protocol::transaction _transaction = _v.as<hive::protocol::transaction>();

  fc::flat_set<hive::protocol::account_name_type> impacted;
  hive::app::transaction_get_impacted_accounts(_transaction, impacted);

  return std::vector<std::string>{ impacted.begin(), impacted.end() };
}

template <class FoundationProvider>
inline
binary_data protocol_impl<FoundationProvider>::cpp_generate_binary_transaction_metadata(const std::string& transaction, bool use_hf26_serialization) const
{
  fc::variant _v = fc::json::from_string(transaction, fc::json::format_validation_mode::full);

  hive::protocol::signed_transaction _transaction = _v.as<hive::protocol::signed_transaction>();

  return cpp::generate_binary_transaction_metadata(_transaction, use_hf26_serialization);
}

template <class FoundationProvider>
inline
binary_data protocol_impl<FoundationProvider>::cpp_generate_binary_operation_metadata(const std::string& operation, bool use_hf26_serialization) const
{
  fc::variant _v = fc::json::from_string(operation, fc::json::format_validation_mode::full);
  hive::protocol::operation _operation = _v.as<hive::protocol::operation>();

  return cpp::generate_binary_operation_metadata(_operation, use_hf26_serialization);
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
      const auto _transaction = get_transaction(transaction);

      _result.content = serialize_transaction(_transaction);
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
typename protocol_impl<FoundationProvider>::required_authority_collection_t protocol_impl<FoundationProvider>::cpp_collect_transaction_required_authorities(const std::string& transaction)
{
  return cpp::safe_exception_wrapper([&]() -> required_authority_collection_t {
  const auto _transaction = get_transaction(transaction);

  typedef flat_set<hive::protocol::account_name_type> raw_account_set;

  raw_account_set active;
  raw_account_set owner;
  raw_account_set posting;
  raw_account_set witness;
  std::vector<hive::protocol::authority> other_authorities;
  _transaction.get_required_authorities(active, owner, posting, witness, other_authorities);

  required_authority_collection_t ret_val;
  using account_collection_t = typename required_authority_collection_t::account_collection_t;
  ret_val.posting_accounts = std::move(account_collection_t(posting.cbegin(), posting.cend()));
  ret_val.owner_accounts = std::move(account_collection_t(owner.cbegin(), owner.cend()));
  ret_val.active_accounts = std::move(account_collection_t(active.cbegin(), active.cend()));

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
hive::protocol::authority convert_wax_authority_to_protocol_authority(const wax_authority& w_authority)
{
  using authority = hive::protocol::authority;
  auto convert_wax_key_auth_map_to_hive_key_auth_map = [](const wax_authority::authority_map& auth_map) -> authority::key_authority_map {
    authority::key_authority_map result;
    for (const auto& auth : auth_map)
      result.emplace(auth.first, auth.second);
    return result;
    };

  authority a;
  a.weight_threshold = w_authority.weight_threshold;
  a.key_auths = convert_wax_key_auth_map_to_hive_key_auth_map(w_authority.key_auths);
  a.account_auths = authority::account_authority_map(w_authority.account_auths.cbegin(), w_authority.account_auths.cend());

  return a;
}

static inline
hive::protocol::authorities_t convert_wax_authorities_to_authorities(const wax_authorities& w_authorities)
{
  using authority = hive::protocol::authority;

  authority active = convert_wax_authority_to_protocol_authority(w_authorities.active);
  authority owner = convert_wax_authority_to_protocol_authority(w_authorities.owner);
  authority posting = convert_wax_authority_to_protocol_authority(w_authorities.posting);

  return { std::move(active), std::move(owner), std::move(posting) };
}

template <class FoundationProvider>
inline
hive::protocol::authority_verification_trace protocol_impl<FoundationProvider>::cpp_trace_authority_verification(
  const required_authority_collection_t& required_authorities,
  const std::vector<std::string>& decodedSignaturePublicKeys,
  IAccountAuthorityProvider& authorityProvider)
{
  struct Impl final : public hive::protocol::authority_getter_i
  {
    explicit Impl(IAccountAuthorityProvider& authorityProvider) : _authorityProvider(authorityProvider) {}
    virtual ~Impl() = default;

    using authority = hive::protocol::authority;
    using public_key_type = hive::protocol::public_key_type;

    virtual std::optional<authority> get_active(const std::string& a) const override
    {
      return acquireAuthority(a, "active");
    }

    virtual std::optional<authority> get_owner(const std::string& a) const override
    {
      return acquireAuthority(a, "owner");
    }

    virtual std::optional<authority> get_posting(const std::string& a) const override
    {
      return acquireAuthority(a, "posting");
    }

    virtual std::optional<public_key_type> get_witness_key(const std::string& account) const override
    {
      std::optional<public_key_type> retval;
      const std::string signingKey = _authorityProvider.getWitnessPublicKey(account);
      if(signingKey.empty() == false)
        retval = fc::ecc::public_key::from_base58_with_prefix(signingKey, HIVE_ADDRESS_PREFIX);
      return retval;
    }

  private:
    std::optional<authority> acquireAuthority(const std::string& account, const char* role) const
    {
      const wax_authority wAuth = _authorityProvider.getAuthority(account, role);
      return convert_wax_authority_to_protocol_authority(wAuth);
    }

  private:
    IAccountAuthorityProvider& _authorityProvider;
  };

  return cpp::safe_exception_wrapper([&]() ->hive::protocol::authority_verification_trace {
  flat_set<hive::protocol::public_key_type> _signatureDecodedPublicKeys;
  for(const auto& decodedKey : decodedSignaturePublicKeys)
  {
    auto key = fc::ecc::public_key::from_base58_with_prefix(decodedKey, HIVE_ADDRESS_PREFIX);
    _signatureDecodedPublicKeys.insert(key);
  }

  hive::protocol::required_authorities_type _requiredAuths;

  _requiredAuths.required_active.insert(required_authorities.active_accounts.cbegin(), required_authorities.active_accounts.end());
  _requiredAuths.required_owner.insert(required_authorities.owner_accounts.cbegin(), required_authorities.owner_accounts.end());
  _requiredAuths.required_posting.insert(required_authorities.posting_accounts.cbegin(), required_authorities.posting_accounts.end());

  ///_requiredAuths.required_witness; /// ? missing field in required_authority_collection_t?
  for(const auto& o : required_authorities.other_authorities)
  {
    _requiredAuths.other.emplace_back(convert_wax_authority_to_protocol_authority(o));
  }

  /// TODO: FIXME allow to pass by params
  const bool allow_strict_and_mixed_authorities = false;
  const bool allow_redundant_signatures = false;

  Impl protocolDataProvider(authorityProvider);

  hive::protocol::authority_verification_trace trace = hive::protocol::verify_authority_with_tracing(
    allow_strict_and_mixed_authorities,
    allow_redundant_signatures,
    _requiredAuths,
    _signatureDecodedPublicKeys,
    protocolDataProvider);

  return trace;
  });
}

template <class FoundationProvider>
inline
std::vector<std::string> protocol_impl<FoundationProvider>::cpp_collect_signing_keys(
  const std::string& transaction, retrieve_authorities_cb_t retrieve_authorities_cb, void* retrieve_authorities_fn)
{
  return cpp::safe_exception_wrapper([&]() -> std::vector<std::string> {
    const auto tx = get_transaction(transaction);
    signing_keys_collector::retrieve_authorities_t retrieve_authorities = [&] (const std::vector<std::string>& accounts)
      {
      const auto wax_authorities_map = retrieve_authorities_cb(accounts, retrieve_authorities_fn);
      hive::protocol::authorities_map_t authorities_map;
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

template <class FoundationProvider>
inline
std::vector<std::string> protocol_impl<FoundationProvider>::cpp_minimize_required_signatures(
  const std::string& signed_transaction, const minimize_required_signatures_data_t& minimize_required_signatures_data)
{
  return cpp::safe_exception_wrapper([&]() -> std::vector<std::string> {
    const auto tx = get_transaction(signed_transaction);
    hive::protocol::authorities_map_t authorities_map;
    for (const auto& wax_authorities_info : minimize_required_signatures_data.authorities_map)
    {
      hive::protocol::account_name_type account = wax_authorities_info.first;
      hive::protocol::authorities_t authorities = convert_wax_authorities_to_authorities(wax_authorities_info.second);
      authorities_map.emplace(account, std::move(authorities));
    }

    auto result = minimize_required_signatures_helper::minimize_required_signatures(
      tx, minimize_required_signatures_data.chain_id, minimize_required_signatures_data.available_keys, authorities_map,
      minimize_required_signatures_data.get_witness_key_cb, minimize_required_signatures_data.get_witness_key_fn,
      minimize_required_signatures_data.max_recursion, minimize_required_signatures_data.max_membership, minimize_required_signatures_data.max_account_auths,
      minimize_required_signatures_data.allow_strict_and_mixed_authorities);

    return result;
    });
}

} /// namespace cpp
