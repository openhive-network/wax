#include "core/foundation.hpp"
#include "core/protocol_impl.hpp"
#include "core/protobuf_protocol_impl.hpp"

#include "core/protocol_impl.inl"
#include "core/protobuf_protocol_impl.inl"

#include <iostream>

#include "core/val_protocol.hpp"
#include "core/proto_converter.hpp"
#include "core/api_converter.hpp"

#include <emscripten/bind.h>
#include <emscripten/val.h>

using namespace cpp;
using namespace emscripten;

using manabar_fn_t = result(const int32_t, const uint32_t, const uint32_t, const uint32_t, const uint32_t, const uint32_t);
using ext_json_asset_fn_t = json_asset(const int32_t, const int32_t)const;

class emscripten_managed_object
{
public:
  emscripten_managed_object()
    : jsval(emscripten::val::undefined())
  {}

  emscripten_managed_object(emscripten::val jsval)
    : jsval(jsval)
  {}

  emscripten_managed_object(const std::string& str)
    : jsval(str)
  {}

  static emscripten_managed_object array(const std::vector<emscripten_managed_object>& vec)
  {
    std::vector<emscripten::val> items;
    items.reserve(vec.size());
    for (const auto& item : vec)
      items.emplace_back(emscripten::val(item.jsval));

    return emscripten_managed_object{ emscripten::val::array(items.begin(), items.end()) };
  }

  static emscripten_managed_object object()
  {
    return emscripten_managed_object{ emscripten::val::object() };
  }

  void set(const emscripten_managed_object& key, const emscripten_managed_object& obj)
  {
    jsval.set(key.jsval, obj.jsval);
  }

  void set(const char* key, const emscripten_managed_object& obj)
  {
    jsval.set(key, obj.jsval);
  }

  void set(const char* key, const std::string& obj)
  {
    jsval.set(key, obj);
  }

  bool is_optional_field_present(const char* name) const
  {
    return !jsval[name].isUndefined();
  }

  emscripten_managed_object operator[](const std::string& key)const
  {
    return emscripten_managed_object{ jsval.operator[](key) };
  }

  emscripten_managed_object operator[](const char* key)const
  {
    return emscripten_managed_object{ jsval.operator[](key) };
  }

  emscripten_managed_object operator[](size_t key)const
  {
    return emscripten_managed_object{ jsval.operator[](key) };
  }

  emscripten_managed_object operator[](int key)const
  {
    return emscripten_managed_object{ jsval.operator[](key) };
  }

  bool is_undefined()const
  {
    return jsval.isUndefined();
  }

  bool is_string()const
  {
    return jsval.isString();
  }

  void del(const std::string& key)
  {
    jsval.delete_(key);
  }

  template<typename T>
  void as(T& val)const
  {
    val = jsval.as<T>();
  }

  size_t array_length()const
  {
    return jsval["length"].as<size_t>();
  }

  std::string get_underlying_sv_type()const
  {
    emscripten::val keys = emscripten::val::global("Object").call<emscripten::val>("keys", jsval);
    size_t count = keys["length"].as<size_t>();
    FC_ASSERT(count > 0, "Expected a key in static variant");
    return keys[0].as<std::string>();
  }

  std::vector<std::string> get_map_keys()const
  {
    std::vector<std::string> out;

    emscripten::val keys = emscripten::val::global("Object").call<emscripten::val>("keys", jsval);
    size_t count = keys["length"].as<size_t>();

    out.resize(count);

    for (size_t i = 0; i < count; ++i)
      out[i] = keys[i].as<std::string>();

    return out;
  }

private:
  emscripten::val jsval;
};

/// unfortunetely emscripten can't handle correctly C++ set -> JS Set transformation, so we have to use a vector instead.
struct required_authority_collectionV
{
  typedef std::vector<std::string> account_vector;
  typedef account_vector account_collection_t;

  account_vector posting_accounts;
  account_vector active_accounts;
  account_vector owner_accounts;
  std::vector<wax_authority> other_authorities;
};

using authority_verification_trace = hive::protocol::authority_verification_trace;

class wasm_transaction
{
public:
  wasm_transaction(val obj, bool is_protobuf)
  {
    cpp::safe_exception_wrapper([&]() -> void {
      fc::reflector< hive::protocol::signed_transaction >::visit(
        val_protocol_visitor< emscripten_managed_object, hive::protocol::signed_transaction >{ emscripten_managed_object{ obj }, this->_transaction, is_protobuf }
      );
    });
  }

  void add_operation(val obj, bool is_protobuf)
  {
    cpp::safe_exception_wrapper([&]() -> void {
      hive::protocol::operation op;
      cpp::from_jsval(emscripten_managed_object{obj}, op, is_protobuf);

      this->_transaction.operations.emplace_back(op);
    });
  }

  void add_signature(const std::string& signature)
  {
    cpp::safe_exception_wrapper([&]() -> void {
      hive::protocol::signature_type sig;
      fc::from_hex(signature, reinterpret_cast<char *>(&sig.data[0]), sig.size());

      this->_transaction.signatures.emplace_back(sig);
    });
  }

  void set_expiration(const std::string& expiration)
  {
    cpp::safe_exception_wrapper([&]() -> void {
      this->_transaction.expiration = fc::time_point_sec::from_iso_string( expiration );
    });
  }

  std::string to_legacy_json()const
  {
    return cpp::safe_exception_wrapper([&]() -> std::string {
      hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::legacy);
      hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::legacy);

      return fc::json::to_string(this->_transaction);
    });
  }

  std::string to_binary(bool use_hf26_serialization = true, bool strip_to_unsigned_transaction = false)const
  {
    return cpp::safe_exception_wrapper([&]() -> std::string {
      return cpp::serialize_transaction(this->_transaction, use_hf26_serialization, strip_to_unsigned_transaction);
    });
  }

  std::string to_json()const
  {
    return cpp::safe_exception_wrapper([&]() -> std::string {
      return fc::json::to_string(this->_transaction);
    });
  }

  std::string id(bool use_hf26_serialization = true)const
  {
    return cpp::safe_exception_wrapper([&]() -> std::string {
      return this->_transaction.id(use_hf26_serialization ? hive::protocol::serialization_type::hf26 : hive::protocol::serialization_type::legacy).str();
    });
  }

  binary_data binary(bool use_hf26_serialization = true, bool strip_to_unsigned_transaction = false)const
  {
    return cpp::safe_exception_wrapper([&]() -> binary_data {
      return cpp::generate_binary_transaction_metadata(_transaction, use_hf26_serialization, strip_to_unsigned_transaction);
    });
  }

  required_authority_collectionV required_authorities()const
  {
    return cpp::safe_exception_wrapper([&]() -> required_authority_collectionV {
      typedef flat_set<hive::protocol::account_name_type> raw_account_set;

      raw_account_set active;
      raw_account_set owner;
      raw_account_set posting;
      raw_account_set witness;
      std::vector<hive::protocol::authority> other_authorities;
      _transaction.get_required_authorities(active, owner, posting, witness, other_authorities);

      required_authority_collectionV ret_val;
      using account_collection_t = typename required_authority_collectionV::account_collection_t;
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

  std::vector<std::string> impacted_accounts()const
  {
    return cpp::safe_exception_wrapper([&]() -> std::vector<std::string> {
      std::vector<std::string> result;
      for (const auto& op : this->_transaction.operations)
      {
        fc::flat_set<hive::protocol::account_name_type> impacted;
        hive::app::operation_get_impacted_accounts(op, impacted);
        result.insert( result.end(), impacted.begin(), impacted.end() );
      }
      return result;
    });
  }

  std::vector<std::string> signature_keys(const std::string& chain_id, bool use_hf26_serialization = true)const
  {
    return cpp::safe_exception_wrapper([&]() -> std::vector<std::string> {
      std::vector<std::string> result;
      for (const auto& sig : this->_transaction.signatures)
      {
        result.emplace_back(fc::ecc::public_key::to_base58_with_prefix(
          fc::ecc::public_key{ sig, _transaction.sig_digest(hive::protocol::chain_id_type{ chain_id }, use_hf26_serialization ? hive::protocol::serialization_type::hf26 : hive::protocol::serialization_type::legacy) },
          HIVE_ADDRESS_PREFIX
        ));
      }
      return result;
    });
  }

  std::string sig_digest(const std::string& chain_id, bool use_hf26_serialization = true)const
  {
    return cpp::safe_exception_wrapper([&]() -> std::string {
      return _transaction.sig_digest(hive::protocol::chain_id_type{ chain_id }, use_hf26_serialization ? hive::protocol::serialization_type::hf26 : hive::protocol::serialization_type::legacy).str();
    });
  }

  void validate()const
  {
    return cpp::safe_exception_wrapper([&]() -> void {
      _transaction.validate();
    });
  }

private:
  hive::protocol::signed_transaction _transaction;
};

class foundation_wasm : public foundation
{
private:
  long long join_lh(int32_t low, int32_t high)const
{ return (long long) high << 32 | (uint32_t) low; }

  unsigned long long join_lh(uint32_t low, uint32_t high)const
{ return (unsigned long long) high << 32 | low; }

public:
  using required_authority_collection_t = required_authority_collectionV;

  result cpp_calculate_manabar_full_regeneration_time(const int32_t now, const uint32_t max_mana_low, const uint32_t max_mana_high, const uint32_t current_mana_low, const uint32_t current_mana_high, const uint32_t last_update_time) 
{ return foundation::cpp_calculate_manabar_full_regeneration_time(now, join_lh(max_mana_low, max_mana_high), join_lh(current_mana_low, current_mana_high), last_update_time); }

result cpp_calculate_current_manabar_value(const int32_t now, const uint32_t max_mana_low, const uint32_t max_mana_high, const uint32_t current_mana_low, const uint32_t current_mana_high, const uint32_t last_update_time) 
{ return foundation::cpp_calculate_current_manabar_value(now, join_lh(max_mana_low, max_mana_high), join_lh(current_mana_low, current_mana_high), last_update_time); }

json_asset cpp_general_asset(const uint32_t asset_num, const int32_t amount_low, const int32_t amount_high)const 
{ return foundation::cpp_general_asset(asset_num, join_lh(amount_low, amount_high)); }

json_asset cpp_hive(const int32_t amount_low, const int32_t amount_high)const 
{ return foundation::cpp_hive(join_lh(amount_low, amount_high)); }

json_asset cpp_hbd(const int32_t amount_low, const int32_t amount_high)const 
{ return foundation::cpp_hbd(join_lh(amount_low, amount_high)); }

wasm_transaction cpp_create_wasm_transaction(val obj, bool is_protobuf)const
{ return wasm_transaction{ obj, is_protobuf }; }

json_asset cpp_vests(const int32_t amount_low, const int32_t amount_high)const 
{ return foundation::cpp_vests(join_lh(amount_low, amount_high)); }

witness_set_properties_serialized cpp_serialize_witness_set_properties(const witness_set_properties_data& value) const
{ return foundation::cpp_serialize_witness_set_properties(value); }

witness_set_properties_data cpp_deserialize_witness_set_properties(const witness_set_properties_serialized& value) const
{ return foundation::cpp_deserialize_witness_set_properties(value); }

std::string cpp_asset_value(const json_asset& value) const
{ return foundation::cpp_asset_value(value); }

std::string cpp_asset_symbol(const json_asset& value) const
{ return foundation::cpp_asset_symbol(value); }

void cpp_throws(int value) const
{ foundation::cpp_throws(value); }

bool cpp_get_js_object(val obj) const
{
  std::string author = obj["author"].as<std::string>();
  dlog((author));

  return author == "user";
}

void tx_proto_to_api(val obj) const
{
  cpp::safe_exception_wrapper([&]() -> void {
    fc::reflector< hive::protocol::signed_transaction >::visit(
      to_api_visitor< emscripten_managed_object, hive::protocol::signed_transaction >{ emscripten_managed_object{ obj } }
    );
  });
}

void tx_api_to_proto(val obj) const
{
  cpp::safe_exception_wrapper([&]() -> void {
    fc::reflector< hive::protocol::signed_transaction >::visit(
      to_proto_visitor< emscripten_managed_object, hive::protocol::signed_transaction >{ emscripten_managed_object{ obj } }
    );
  });
}

crypto_memo cpp_crypto_memo_from_string(const std::string& value) const
{ return foundation::cpp_crypto_memo_from_string(value); }

std::string cpp_crypto_memo_dump_string(const crypto_memo& value) const
{ return foundation::cpp_crypto_memo_dump_string(value); }

void cpp_scan_text_for_matching_private_keys(const std::string& text, const std::string& account, const wax_authorities& auths, const std::string& memo_key,
  const std::vector<std::string>& imported_keys) const
{
  return foundation::cpp_check_memo_for_private_keys(text, account, auths, memo_key, imported_keys);
}

brain_key_data cpp_suggest_brain_key()
{ return foundation::cpp_suggest_brain_key(); }

result cpp_generate_private_key()
{ return foundation::cpp_generate_private_key(); }

private_key_data cpp_generate_private_key_password_based(const std::string& account, const std::string& role, const std::string& password)
{ return foundation::cpp_generate_private_key(account, role, password); }

std::string cpp_convert_raw_private_key_to_wif(const std::string& hexData)
{
  return foundation::cpp_convert_raw_private_key_to_wif(hexData);
}

std::string cpp_convert_raw_public_key_to_wif(const std::string& hexData)
{
  return foundation::cpp_convert_raw_public_key_to_wif(hexData);
}

result cpp_get_public_key_from_signature(const std::string& digest, const std::string& signature)
{ return foundation::cpp_get_public_key_from_signature(digest, signature); }

result cpp_calculate_public_key(const std::string& wif) 
{ return foundation::cpp_calculate_public_key(wif); }

std::map<std::string, std::string> cpp_get_hive_protocol_config(const std::string& chain_id)
{ return foundation::cpp_get_hive_protocol_config(chain_id); }

ref_block_data cpp_get_tapos_data(const std::string& block_id)
{ return foundation::cpp_get_tapos_data(block_id); }

std::string cpp_get_address_prefix()
{ return HIVE_ADDRESS_PREFIX; }

result cpp_calculate_hp_apr(
  const uint32_t head_block_num,
  const uint16_t vesting_reward_percent,
  const json_asset& virtual_supply,
  const json_asset& total_vesting_fund_hive) const
{
  return foundation::cpp_calculate_hp_apr(
    head_block_num, vesting_reward_percent, virtual_supply, total_vesting_fund_hive);
}

json_asset cpp_hbd_to_hive(const json_asset &hbd, const json_asset& base, const json_asset& quote) const
{
  return foundation::cpp_hbd_to_hive(hbd, base, quote);
}

json_asset cpp_hive_to_hbd(const json_asset& amount, const json_asset& base, const json_asset& quote) const
{
  return foundation::cpp_hive_to_hbd(amount, base, quote);
}

json_asset cpp_vests_to_hp(const json_asset& vests, const json_asset& total_vesting_fund_hive, const json_asset& total_vesting_shares) const
{
  return foundation::cpp_vests_to_hp(vests, total_vesting_fund_hive, total_vesting_shares);
}

json_asset cpp_hp_to_vests(const json_asset& vests, const json_asset& total_vesting_fund_hive, const json_asset& total_vesting_shares) const
{
  return foundation::cpp_hp_to_vests(vests, total_vesting_fund_hive, total_vesting_shares);
}

result cpp_calculate_inflation_rate_for_block(const uint32_t block_num) const 
{
    return foundation::cpp_calculate_inflation_rate_for_block( block_num );
}

json_asset cpp_estimate_hive_collateral( const json_price& current_median_history, const json_price& current_min_history, const json_asset& hbd_amount_to_get ) const
{
  return foundation::cpp_estimate_hive_collateral( current_median_history, current_min_history, hbd_amount_to_get );
}

bool cpp_is_valid_account_name( const std::string& name ) const
{
  return foundation::cpp_is_valid_account_name( name );
}

};

class AccountAuthorityProviderWrapper final : public emscripten::wrapper<IAccountAuthorityProvider>
{
public:
  EMSCRIPTEN_WRAPPER(AccountAuthorityProviderWrapper);

  virtual std::optional<wax_authority> getAuthority(std::string account_name, std::string authorityRole) override
  {
    return call<std::optional<wax_authority>>("getAuthority", account_name, authorityRole);
  }

  virtual std::optional<std::string> getWitnessPublicKey(std::string account_name) override
  {
    return call<std::optional<std::string>>("getWitnessPublicKey", account_name);
  }
};

using protocol_wasm = cpp::protocol_impl<foundation_wasm>;
using proto_protocol_wasm = cpp::proto_protocol_impl<foundation_wasm>;

EMSCRIPTEN_BINDINGS(wax_api_instance) {
  enum_<error_code>("error_code")
      .value("fail", error_code::fail)
      .value("ok", error_code::ok)
      ;

  value_object<result>("result")
      .field("value", &result::value)
      .field("content", &result::content)
      .field("exception_message", &result::exception_message)
      ;

  value_object<brain_key_data>("brain_key_data")
      .field("associated_public_key", &brain_key_data::associated_public_key)
      .field("brain_key", &brain_key_data::brain_key)
      .field("wif_private_key", &brain_key_data::wif_private_key)
      ;

  value_object<private_key_data>("private_key_data")
      .field("associated_public_key", &private_key_data::associated_public_key)
      .field("wif_private_key", &private_key_data::wif_private_key)
      ;

  value_object<json_asset>("json_asset")
      .field("amount", &json_asset::amount)
      .field("precision", &json_asset::precision)
      .field("nai", &json_asset::nai)
      ;

  value_object<crypto_memo>("crypto_memo")
      .field("from", &crypto_memo::_from)
      .field("to", &crypto_memo::to)
      .field("content", &crypto_memo::content)
      ;

  value_object<wax_authority>("wax_authority")
      .field("weight_threshold", &wax_authority::weight_threshold)
      .field("account_auths", &wax_authority::account_auths)
      .field("key_auths", &wax_authority::key_auths)
      ;

  value_object<wax_authorities>("wax_authorities")
    .field("active", &wax_authorities::active)
    .field("owner", &wax_authorities::owner)
    .field("posting", &wax_authorities::posting)
    ;

  value_object<required_authority_collectionV>("required_authority_collection")
      .field("posting_accounts", &required_authority_collectionV::posting_accounts)
      .field("active_accounts", &required_authority_collectionV::active_accounts)
      .field("owner_accounts", &required_authority_collectionV::owner_accounts)
      .field("other_authorities", &required_authority_collectionV::other_authorities)
      ;

  value_object<ref_block_data>("ref_block_data")
      .field("ref_block_num", &ref_block_data::ref_block_num)
      .field("ref_block_prefix", &ref_block_data::ref_block_prefix)
      ;

  value_object<json_price>("json_price")
      .field("base", &json_price::base)
      .field("quote", &json_price::quote)
      ;

  value_object<binary_data_node>("binary_data_node")
      .field("key", &binary_data_node::key)
      .field("type", &binary_data_node::type)
      .field("offset", &binary_data_node::offset)
      .field("size", &binary_data_node::size)
      .field("value", &binary_data_node::value)
      .field("length", &binary_data_node::length)
      .field("children", &binary_data_node::children)
      ;

  value_object<binary_data>("binary_data")
      .field("binary", &binary_data::binary)
      .field("offsets", &binary_data::offsets)
      ;

  register_optional<std::string>();
  register_optional<uint32_t>();
  register_optional<uint16_t>();
  register_optional<int32_t>();
  register_optional<bool>();
  register_optional<json_asset>();
  register_optional<json_price>();
  register_vector<std::string>("VectorString"); // Required for map binding -> keys() method
  register_vector<wax_authority>("VectorWaxAuthority");
  register_vector<binary_data_node>("VectorBinaryDataNode");
  register_vector<authority_verification_trace::path_entry>("VectorPathEntry");
  register_map<std::string, std::string>("MapStringString");
  register_map<std::string, uint16_t>("MapStringUInt16");

  value_object<witness_set_properties_data>("witness_set_properties_data")
      .field("key",                     &witness_set_properties_data::key)
      .field("new_signing_key",         &witness_set_properties_data::new_signing_key)
      .field("account_creation_fee",    &witness_set_properties_data::account_creation_fee)
      .field("url",                     &witness_set_properties_data::url)
      .field("hbd_exchange_rate",       &witness_set_properties_data::hbd_exchange_rate)
      .field("maximum_block_size",      &witness_set_properties_data::maximum_block_size)
      .field("hbd_interest_rate",       &witness_set_properties_data::hbd_interest_rate)
      .field("account_subsidy_budget",  &witness_set_properties_data::account_subsidy_budget)
      .field("account_subsidy_decay",   &witness_set_properties_data::account_subsidy_decay)
      ;

  value_object<authority_verification_trace::path_entry>("path_entry")
    .field("processed_entry", &authority_verification_trace::path_entry::processed_entry)
    .field("processed_role", &authority_verification_trace::path_entry::processed_role)
    .field("recursion_depth", &authority_verification_trace::path_entry::recursion_depth)
    .field("threshold", &authority_verification_trace::path_entry::threshold)
    .field("weight", &authority_verification_trace::path_entry::weight)
    .field("flags", &authority_verification_trace::path_entry::flags)
    .field("visited_entries", &authority_verification_trace::path_entry::visited_entries)
    ;

  value_object<authority_verification_trace>("authority_verification_trace")
    .field("root", &authority_verification_trace::root)
    .field("final_authority_path", &authority_verification_trace::final_authority_path)
    .field("verification_status", &authority_verification_trace::verification_status)
    ;

  class_<IAccountAuthorityProvider>("IAccountAuthorityProvider")
    .allow_subclass<AccountAuthorityProviderWrapper>("AccountAuthorityProviderWrapper")
    .function("getAuthority", &IAccountAuthorityProvider::getAuthority, pure_virtual())
    .function("getWitnessPublicKey", &IAccountAuthorityProvider::getWitnessPublicKey, pure_virtual())
    ;

  class_<wasm_transaction>("WasmTransaction")
    .function("id", &wasm_transaction::id)
    .function("binary", &wasm_transaction::binary)
    .function("impactedAccounts", &wasm_transaction::impacted_accounts)
    .function("requiredAuthorities", &wasm_transaction::required_authorities)
    .function("sigDigest", &wasm_transaction::sig_digest)
    .function("signatureKeys", &wasm_transaction::signature_keys)
    .function("validate", &wasm_transaction::validate)
    .function("push", &wasm_transaction::add_operation)
    .function("sign", &wasm_transaction::add_signature)
    .function("setExpiration", &wasm_transaction::set_expiration)
    .function("toLegacyString", &wasm_transaction::to_legacy_json)
    .function("toBinary", &wasm_transaction::to_binary)
    .function("toString", &wasm_transaction::to_json)
  ;

  class_<foundation_wasm>("protocol_foundation")
    .constructor<>()
    .function("cpp_get_address_prefix", &foundation_wasm::cpp_get_address_prefix)
    .function("cpp_calculate_public_key", &foundation_wasm::cpp_calculate_public_key)
    .function("cpp_suggest_brain_key", &foundation_wasm::cpp_suggest_brain_key)
    .function("cpp_get_hive_protocol_config", &foundation_wasm::cpp_get_hive_protocol_config)

    .function("cpp_tx_api_to_proto", &foundation_wasm::tx_api_to_proto)
    .function("cpp_tx_proto_to_api", &foundation_wasm::tx_proto_to_api)

    .function("cpp_create_wasm_transaction", &protocol_wasm::cpp_create_wasm_transaction, return_value_policy::take_ownership())

    .function("cpp_generate_private_key", &foundation_wasm::cpp_generate_private_key)
    .function("cpp_generate_private_key_password_based", &foundation_wasm::cpp_generate_private_key_password_based)
    .function("cpp_convert_raw_private_key_to_wif", &foundation_wasm::cpp_convert_raw_private_key_to_wif)
    .function("cpp_convert_raw_public_key_to_wif", &foundation_wasm::cpp_convert_raw_public_key_to_wif)
    .function("cpp_get_public_key_from_signature", &foundation_wasm::cpp_get_public_key_from_signature)

    // Based on https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#overloaded-functions:
    .function("cpp_general_asset", select_overload<json_asset(const uint32_t, const int32_t, const int32_t)const>(&foundation_wasm::cpp_general_asset))
    .function("cpp_hive", select_overload<ext_json_asset_fn_t>(&foundation_wasm::cpp_hive))
    .function("cpp_hbd", select_overload<ext_json_asset_fn_t>(&foundation_wasm::cpp_hbd))
    .function("cpp_vests", select_overload<ext_json_asset_fn_t>(&foundation_wasm::cpp_vests))

    .function("cpp_serialize_witness_set_properties", &foundation_wasm::cpp_serialize_witness_set_properties)
    .function("cpp_deserialize_witness_set_properties", &foundation_wasm::cpp_deserialize_witness_set_properties)

    .function("cpp_asset_value", &foundation_wasm::cpp_asset_value)
    .function("cpp_asset_symbol", &foundation_wasm::cpp_asset_symbol)

    .function("cpp_throws", &foundation_wasm::cpp_throws)

    .function("cpp_get_js_object", &foundation_wasm::cpp_get_js_object)

    .function("cpp_crypto_memo_from_string", &foundation_wasm::cpp_crypto_memo_from_string)
    .function("cpp_crypto_memo_dump_string", &foundation_wasm::cpp_crypto_memo_dump_string)

    .function("cpp_scan_text_for_matching_private_keys", &foundation_wasm::cpp_scan_text_for_matching_private_keys)

    .function("cpp_calculate_manabar_full_regeneration_time", select_overload<manabar_fn_t>(&foundation_wasm::cpp_calculate_manabar_full_regeneration_time))
    .function("cpp_calculate_current_manabar_value", select_overload<manabar_fn_t>(&foundation_wasm::cpp_calculate_current_manabar_value))

    .function("cpp_get_tapos_data", &foundation_wasm::cpp_get_tapos_data)

    .function("cpp_calculate_hp_apr", &foundation_wasm::cpp_calculate_hp_apr)
    .function("cpp_calculate_inflation_rate_for_block", &foundation_wasm::cpp_calculate_inflation_rate_for_block)
    .function("cpp_vests_to_hp", &foundation_wasm::cpp_vests_to_hp)
    .function("cpp_hp_to_vests", &foundation_wasm::cpp_hp_to_vests)
    .function("cpp_hbd_to_hive", &foundation_wasm::cpp_hbd_to_hive)
    .function("cpp_hive_to_hbd", &foundation_wasm::cpp_hive_to_hbd)
    .function("cpp_estimate_hive_collateral", &foundation_wasm::cpp_estimate_hive_collateral)
    .function("cpp_is_valid_account_name", &foundation_wasm::cpp_is_valid_account_name)
    ;


  class_<protocol_wasm, base<foundation_wasm>>("protocol")
    .constructor<>()

    .function("cpp_operation_get_impacted_accounts", &protocol_wasm::cpp_operation_get_impacted_accounts)
    .function("cpp_transaction_get_impacted_accounts", &protocol_wasm::cpp_transaction_get_impacted_accounts)
    .function("cpp_generate_binary_transaction_metadata", &protocol_wasm::cpp_generate_binary_transaction_metadata)
    .function("cpp_generate_binary_operation_metadata", &protocol_wasm::cpp_generate_binary_operation_metadata)
    .function("cpp_validate_operation", &protocol_wasm::cpp_validate_operation)
    .function("cpp_validate_transaction", &protocol_wasm::cpp_validate_transaction)
    .function("cpp_calculate_transaction_id", &protocol_wasm::cpp_calculate_transaction_id)
    .function("cpp_calculate_legacy_transaction_id", &protocol_wasm::cpp_calculate_legacy_transaction_id)
    .function("cpp_calculate_sig_digest", &protocol_wasm::cpp_calculate_sig_digest)
    .function("cpp_calculate_legacy_sig_digest", &protocol_wasm::cpp_calculate_legacy_sig_digest)
    .function("cpp_serialize_transaction", &protocol_wasm::cpp_serialize_transaction)
    .function("cpp_deserialize_transaction", &protocol_wasm::cpp_deserialize_transaction)
    .function("cpp_collect_transaction_required_authorities", &protocol_wasm::cpp_collect_transaction_required_authorities)
    .function("cpp_trace_authority_verification", &protocol_wasm::cpp_trace_authority_verification)
    .function("cpp_get_hive_protocol_config", &protocol_wasm::cpp_get_hive_protocol_config)
  ;

  // We have to use it this way because JavaScript (and emscripten in conclusion) doesn't support multiple inheritance
  class_<proto_protocol_wasm, base<foundation_wasm>>("proto_protocol")
    .constructor<>()
    .function("cpp_operation_get_impacted_accounts", &proto_protocol_wasm::cpp_operation_get_impacted_accounts)
    .function("cpp_transaction_get_impacted_accounts", &proto_protocol_wasm::cpp_transaction_get_impacted_accounts)
    .function("cpp_generate_binary_transaction_metadata", &proto_protocol_wasm::cpp_generate_binary_transaction_metadata)
    .function("cpp_generate_binary_operation_metadata", &proto_protocol_wasm::cpp_generate_binary_operation_metadata)
    .function("cpp_validate_operation", &proto_protocol_wasm::cpp_validate_operation)
    .function("cpp_validate_transaction", &proto_protocol_wasm::cpp_validate_transaction)
    .function("cpp_calculate_transaction_id", &proto_protocol_wasm::cpp_calculate_transaction_id)
    .function("cpp_calculate_legacy_transaction_id", &proto_protocol_wasm::cpp_calculate_legacy_transaction_id)
    .function("cpp_calculate_sig_digest", &proto_protocol_wasm::cpp_calculate_sig_digest)
    .function("cpp_calculate_legacy_sig_digest", &proto_protocol_wasm::cpp_calculate_legacy_sig_digest)
    .function("cpp_serialize_transaction", &proto_protocol_wasm::cpp_serialize_transaction)
    .function("cpp_deserialize_transaction", &proto_protocol_wasm::cpp_deserialize_transaction)
    .function("cpp_proto_to_api", &proto_protocol_wasm::cpp_proto_to_api)
    .function("cpp_proto_to_legacy_api", &proto_protocol_wasm::cpp_proto_to_legacy_api)
    .function("cpp_api_to_proto", &proto_protocol_wasm::cpp_api_to_proto)
    .function("cpp_collect_transaction_required_authorities", &proto_protocol_wasm::cpp_collect_transaction_required_authorities)
    ;
}

int main() {
  // Main should not be run during TypeScript generation.
  // abort();
  // std::cout << "This function does nothing... You have to instantiate wax_api on JS side to play with..." << std::endl;
  return 0;
}
