#include "core/foundation.hpp"
#include "core/protocol_impl.hpp"
#include "core/protobuf_protocol_impl.hpp"

#include "core/protocol_impl.inl"
#include "core/protobuf_protocol_impl.inl"

#include <iostream>

#include <emscripten/bind.h>

using namespace cpp;
using namespace emscripten;

using manabar_fn_t = result(const int32_t, const uint32_t, const uint32_t, const uint32_t, const uint32_t, const uint32_t);
using ext_json_asset_fn_t = json_asset(const int32_t, const int32_t)const;
using calculate_witness_votes_hp_fn_t = json_asset(const int32_t, const int32_t, const json_asset&, const json_asset&) const;

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

crypto_memo cpp_crypto_memo_from_string(const std::string& value) const
{ return foundation::cpp_crypto_memo_from_string(value); }

std::string cpp_crypto_memo_dump_string(const crypto_memo& value) const
{ return foundation::cpp_crypto_memo_dump_string(value); }

brain_key_data cpp_suggest_brain_key()
{ return foundation::cpp_suggest_brain_key(); }

result cpp_generate_private_key()
{ return foundation::cpp_generate_private_key(); }

private_key_data cpp_generate_private_key_password_based(const std::string& account, const std::string& role, const std::string& password)
{ return foundation::cpp_generate_private_key(account, role, password); }

result cpp_get_public_key_from_signature(const std::string& digest, const std::string& signature)
{ return foundation::cpp_get_public_key_from_signature(digest, signature); }

result cpp_calculate_public_key(const std::string& wif) 
{ return foundation::cpp_calculate_public_key(wif); }

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

json_asset cpp_calculate_witness_votes_hp(const int32_t vests_low, const int32_t vests_high, const json_asset& total_vesting_fund_hive, const json_asset& total_vesting_shares) const
{
  return foundation::cpp_vests_to_hp(cpp_vests(vests_low, vests_high), total_vesting_fund_hive, total_vesting_shares);
}

result cpp_calculate_inflation_rate_for_block(const uint32_t block_num) const 
{
    return foundation::cpp_calculate_inflation_rate_for_block( block_num );
}

json_asset cpp_estimate_hive_collateral( const json_price& current_median_history, const json_price& current_min_history, const json_asset& hbd_amount_to_get ) const
{
  return foundation::cpp_estimate_hive_collateral( current_median_history, current_min_history, hbd_amount_to_get );
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

  register_optional<std::string>();
  register_optional<uint32_t>();
  register_optional<uint16_t>();
  register_optional<int32_t>();
  register_optional<json_asset>();
  register_optional<json_price>();
  register_vector<std::string>("VectorString"); // Required for map binding -> keys() method
  register_vector<wax_authority>("VectorWaxAuthority");
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

  class_<foundation_wasm>("protocol_foundation")
    .constructor<>()
    .function("cpp_get_address_prefix", &foundation_wasm::cpp_get_address_prefix)
    .function("cpp_calculate_public_key", &foundation_wasm::cpp_calculate_public_key)
    .function("cpp_suggest_brain_key", &foundation_wasm::cpp_suggest_brain_key)
    .function("cpp_generate_private_key", &foundation_wasm::cpp_generate_private_key)
    .function("cpp_generate_private_key_password_based", &foundation_wasm::cpp_generate_private_key_password_based)
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

    .function("cpp_crypto_memo_from_string", &foundation_wasm::cpp_crypto_memo_from_string)
    .function("cpp_crypto_memo_dump_string", &foundation_wasm::cpp_crypto_memo_dump_string)

    .function("cpp_calculate_manabar_full_regeneration_time", select_overload<manabar_fn_t>(&foundation_wasm::cpp_calculate_manabar_full_regeneration_time))
    .function("cpp_calculate_current_manabar_value", select_overload<manabar_fn_t>(&foundation_wasm::cpp_calculate_current_manabar_value))

    .function("cpp_get_tapos_data", &foundation_wasm::cpp_get_tapos_data)

    .function("cpp_calculate_hp_apr", &foundation_wasm::cpp_calculate_hp_apr)
    .function("cpp_calculate_account_hp", &foundation_wasm::cpp_vests_to_hp)
    .function("cpp_calculate_witness_votes_hp", select_overload<calculate_witness_votes_hp_fn_t>(&foundation_wasm::cpp_calculate_witness_votes_hp))
    .function("cpp_calculate_inflation_rate_for_block", &foundation_wasm::cpp_calculate_inflation_rate_for_block)
    .function("cpp_vests_to_hp", &foundation_wasm::cpp_vests_to_hp)
    .function("cpp_hbd_to_hive", &foundation_wasm::cpp_hbd_to_hive)
    .function("cpp_hive_to_hbd", &foundation_wasm::cpp_hive_to_hbd)
    .function("cpp_estimate_hive_collateral", &foundation_wasm::cpp_estimate_hive_collateral)
    ;

  class_<protocol_wasm, base<foundation_wasm>>("protocol")
    .constructor<>()

    .function("cpp_validate_operation", &protocol_wasm::cpp_validate_operation)
    .function("cpp_validate_transaction", &protocol_wasm::cpp_validate_transaction)
    .function("cpp_calculate_transaction_id", &protocol_wasm::cpp_calculate_transaction_id)
    .function("cpp_calculate_legacy_transaction_id", &protocol_wasm::cpp_calculate_legacy_transaction_id)
    .function("cpp_calculate_sig_digest", &protocol_wasm::cpp_calculate_sig_digest)
    .function("cpp_calculate_legacy_sig_digest", &protocol_wasm::cpp_calculate_legacy_sig_digest)
    .function("cpp_serialize_transaction", &protocol_wasm::cpp_serialize_transaction)
    .function("cpp_collect_transaction_required_authorities", &protocol_wasm::cpp_collect_transaction_required_authorities)
  ;

  // We have to use it this way because JavaScript (and emscripten in conclusion) doesn't support multiple inheritance
  class_<proto_protocol_wasm, base<foundation_wasm>>("proto_protocol")
    .constructor<>()
    .function("cpp_validate_operation", &proto_protocol_wasm::cpp_validate_operation)
    .function("cpp_validate_transaction", &proto_protocol_wasm::cpp_validate_transaction)
    .function("cpp_calculate_transaction_id", &proto_protocol_wasm::cpp_calculate_transaction_id)
    .function("cpp_calculate_legacy_transaction_id", &proto_protocol_wasm::cpp_calculate_legacy_transaction_id)
    .function("cpp_calculate_sig_digest", &proto_protocol_wasm::cpp_calculate_sig_digest)
    .function("cpp_calculate_legacy_sig_digest", &proto_protocol_wasm::cpp_calculate_legacy_sig_digest)
    .function("cpp_serialize_transaction", &proto_protocol_wasm::cpp_serialize_transaction)
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
