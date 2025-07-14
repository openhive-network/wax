#include "core/foundation.hpp"
#include "core/protocol_impl.hpp"
#include "core/protobuf_protocol_impl.hpp"

#include "core/protocol_impl.inl"
#include "core/protobuf_protocol_impl.inl"

#include "core/val_protocol.hpp"
#include "core/proto_converter.hpp"
#include "core/api_converter.hpp"

#include <emscripten/bind.h>

#include "emscripten_managed_object.hpp"

using namespace cpp;
using namespace emscripten;

using authority_verification_trace = hive::protocol::authority_verification_trace;

class foundation_wasm : public foundation
{
public:
bool cpp_get_js_object(val obj) const
{
  std::string author = obj["author"].as<std::string>();
  dlog((author));

  return author == "user";
}

hive_transaction_handle cpp_create_transaction_handle(val emval, bool is_protobuf)const
{
  return cpp::safe_exception_wrapper([&]() -> hive_transaction_handle {
    hive_transaction_handle h;

    hive::protocol::signed_transaction obj;

    fc::reflector< hive::protocol::signed_transaction >::visit(
      val_protocol_visitor< emscripten_managed_object, hive::protocol::signed_transaction >{ emscripten_managed_object{ emval }, obj, is_protobuf }
    );

    h.tx.reset(new hive_tx(std::move(obj)));

    return h;
  });
}

hive_operation_handle cpp_create_operation_handle(val emval, bool is_protobuf)const
{
  return cpp::safe_exception_wrapper([&]() -> hive_operation_handle {
    hive_operation_handle h;

    hive::protocol::operation obj;

    cpp::from_jsval(emscripten_managed_object{ emval }, obj, is_protobuf);

    h.op.reset(new hive_op(std::move(obj)));

    return h;
  });
}

void cpp_tx_proto_to_api(val emval)const
{
  cpp::safe_exception_wrapper([&]() -> void {
    fc::reflector< hive::protocol::signed_transaction >::visit(
      to_api_visitor< emscripten_managed_object, hive::protocol::signed_transaction >{ emscripten_managed_object{ emval } }
    );
  });
}
void cpp_tx_api_to_proto(val emval)const
{
  cpp::safe_exception_wrapper([&]() -> void {
    fc::reflector< hive::protocol::signed_transaction >::visit(
      to_proto_visitor< emscripten_managed_object, hive::protocol::signed_transaction >{ emscripten_managed_object{ emval } }
    );
  });
}

hive_transaction_handle cpp_deserialize_transaction(std::string hex)const
{
  return cpp::safe_exception_wrapper([&]() -> hive_transaction_handle {
    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

    std::vector<char> raw_data{hex.size()};
    fc::from_hex(hex, raw_data.data(), raw_data.size());

    hive::protocol::signed_transaction obj;
    fc::raw::unpack_from_char_array(raw_data.data(), static_cast<uint32_t>(raw_data.size()), obj, 0);

    hive_transaction_handle h;
    h.tx.reset(new hive_tx(std::move(obj)));

    return h;
  });
}
hive_operation_handle cpp_deserialize_operation(std::string hex)const
{
  return cpp::safe_exception_wrapper([&]() -> hive_transaction_handle {
    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

    std::vector<char> raw_data{hex.size()};
    fc::from_hex(hex, raw_data.data(), raw_data.size());

    hive::protocol::operation obj;
    fc::raw::unpack_from_char_array(raw_data.data(), static_cast<uint32_t>(raw_data.size()), obj, 0);

    hive_operation_handle h;
    h.op.reset(new hive_op(std::move(obj)));

    return h;
  });
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

  value_object<transaction_handle>("transaction_handle")
      .field("tx", &transaction_handle::tx)
      ;

  value_object<transaction_handle>("operation_handle")
      .field("op", &transaction_handle::op)
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
  register_smart_pointer<hive_tx>("hive_tx");
  register_smart_pointer<hive_op>("hive_op");

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
    .function("cpp_general_asset", &foundation_wasm::cpp_general_asset)
    .function("cpp_hive", &foundation_wasm::cpp_hive)
    .function("cpp_hbd", &foundation_wasm::cpp_hbd)
    .function("cpp_vests", &foundation_wasm::cpp_vests)

    .function("cpp_serialize_witness_set_properties", &foundation_wasm::cpp_serialize_witness_set_properties)
    .function("cpp_deserialize_witness_set_properties", &foundation_wasm::cpp_deserialize_witness_set_properties)

    .function("cpp_asset_value", &foundation_wasm::cpp_asset_value)
    .function("cpp_asset_symbol", &foundation_wasm::cpp_asset_symbol)

    .function("cpp_throws", &foundation_wasm::cpp_throws)

    .function("cpp_get_js_object", &foundation_wasm::cpp_get_js_object)

    .function("cpp_crypto_memo_from_string", &foundation_wasm::cpp_crypto_memo_from_string)
    .function("cpp_crypto_memo_dump_string", &foundation_wasm::cpp_crypto_memo_dump_string)

    .function("cpp_scan_text_for_matching_private_keys", &foundation_wasm::cpp_scan_text_for_matching_private_keys)

    .function("cpp_calculate_manabar_full_regeneration_time", &foundation_wasm::cpp_calculate_manabar_full_regeneration_time)
    .function("cpp_calculate_current_manabar_value", &foundation_wasm::cpp_calculate_current_manabar_value)

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
    .function("cpp_get_default_comment_options_operation", &protocol_wasm::cpp_get_default_comment_options_operation)
    .function("cpp_deserialize_transaction", &protocol_wasm::cpp_deserialize_transaction)
    .function("cpp_trace_authority_verification", &protocol_wasm::cpp_trace_authority_verification)
    .function("cpp_get_hive_protocol_config", &protocol_wasm::cpp_get_hive_protocol_config)
  ;
}

int main() {
  // Main should not be run during TypeScript generation.
  // abort();
  // std::cout << "This function does nothing... You have to instantiate wax_api on JS side to play with..." << std::endl;
  return 0;
}
