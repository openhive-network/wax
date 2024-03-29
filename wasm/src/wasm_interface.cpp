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

class foundation_wasm : public foundation
{
private:
  long long join_lh(int32_t low, int32_t high)const
{ return (long long) high << 32 | (uint32_t) low; }

  unsigned long long join_lh(uint32_t low, uint32_t high)const
{ return (unsigned long long) high << 32 | low; }

public:
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

std::string cpp_asset_value(const json_asset& value) const
{ return foundation::cpp_asset_value(value); }

std::string cpp_asset_symbol(const json_asset& value) const
{ return foundation::cpp_asset_symbol(value); }

result cpp_generate_private_key() 
{ return foundation::cpp_generate_private_key(); }

result cpp_get_public_key_from_signature(const std::string& digest, const std::string& signature)
{ return foundation::cpp_get_public_key_from_signature(digest, signature); }

result cpp_calculate_public_key(const std::string& wif) 
{ return foundation::cpp_calculate_public_key(wif); }

ref_block_data cpp_get_tapos_data(const std::string& block_id)
{ return foundation::cpp_get_tapos_data(block_id); }

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

  value_object<json_asset>("json_asset")
      .field("amount", &json_asset::amount)
      .field("precision", &json_asset::precision)
      .field("nai", &json_asset::nai)
      ;

  value_object<ref_block_data>("ref_block_data")
      .field("ref_block_num", &ref_block_data::ref_block_num)
      .field("ref_block_prefix", &ref_block_data::ref_block_prefix)
      ;

  class_<foundation_wasm>("protocol_foundation")
    .constructor<>()
    .function("cpp_calculate_public_key", &foundation_wasm::cpp_calculate_public_key)
    .function("cpp_generate_private_key", &foundation_wasm::cpp_generate_private_key)
    .function("cpp_get_public_key_from_signature", &foundation_wasm::cpp_get_public_key_from_signature)

    // Based on https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#overloaded-functions:
    .function("cpp_general_asset", select_overload<json_asset(const uint32_t, const int32_t, const int32_t)const>(&foundation_wasm::cpp_general_asset))
    .function("cpp_hive", select_overload<ext_json_asset_fn_t>(&foundation_wasm::cpp_hive))
    .function("cpp_hbd", select_overload<ext_json_asset_fn_t>(&foundation_wasm::cpp_hbd))
    .function("cpp_vests", select_overload<ext_json_asset_fn_t>(&foundation_wasm::cpp_vests))

    .function("cpp_asset_value", &foundation_wasm::cpp_asset_value)
    .function("cpp_asset_symbol", &foundation_wasm::cpp_asset_symbol)

    .function("cpp_calculate_manabar_full_regeneration_time", select_overload<manabar_fn_t>(&foundation_wasm::cpp_calculate_manabar_full_regeneration_time))
    .function("cpp_calculate_current_manabar_value", select_overload<manabar_fn_t>(&foundation_wasm::cpp_calculate_current_manabar_value))

    .function("cpp_get_tapos_data", &foundation_wasm::cpp_get_tapos_data)

    .function("cpp_calculate_hp_apr", &foundation_wasm::cpp_calculate_hp_apr)
    .function("cpp_calculate_account_hp", &foundation_wasm::cpp_vests_to_hp)
    .function("cpp_calculate_witness_votes_hp", select_overload<calculate_witness_votes_hp_fn_t>(&foundation_wasm::cpp_calculate_witness_votes_hp))
    .function("cpp_calculate_inflation_rate_for_block", &foundation_wasm::cpp_calculate_inflation_rate_for_block)
    .function("cpp_vests_to_hp", &foundation_wasm::cpp_vests_to_hp)
    .function("cpp_hbd_to_hive", &foundation_wasm::cpp_hbd_to_hive)
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

    ;
}

int main() {
  // Main should not be run during TypeScript generation.
  // abort();
  // std::cout << "This function does nothing... You have to instantiate wax_api on JS side to play with..." << std::endl;
  return 0;
}
