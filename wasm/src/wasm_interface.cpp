#include <cpython_interface.hpp>

#include <iostream>

#include <emscripten/bind.h>

using namespace cpp;
using namespace emscripten;

#define PROTOCOL_WASM_BASE_IMPL(base_class_name)               \
  private:                                                     \
    unsigned long long join_lh(int32_t low, int32_t high)const \
    { return (unsigned long long) high << 32 | low; }          \
                                                               \
  public:                                                      \
    result cpp_calculate_manabar_full_regeneration_time( const int32_t now, const int32_t max_mana_low, const int32_t max_mana_high, const int32_t current_mana_low, const int32_t current_mana_high, const uint32_t last_update_time ) \
    { return cpp::base_class_name::cpp_calculate_manabar_full_regeneration_time(now, join_lh(max_mana_low, max_mana_high), join_lh(current_mana_low, current_mana_high), last_update_time); } \
                                                               \
    result cpp_calculate_current_manabar_value( const int32_t now, const int32_t max_mana_low, const int32_t max_mana_high, const int32_t current_mana_low, const int32_t current_mana_high, const uint32_t last_update_time ) \
    { return cpp::base_class_name::cpp_calculate_current_manabar_value(now, join_lh(max_mana_low, max_mana_high), join_lh(current_mana_low, current_mana_high), last_update_time); } \
                                                               \
    json_asset cpp_general_asset(const uint32_t asset_num, const int32_t amount_low, const int32_t amount_high)const \
    { return cpp::base_class_name::cpp_general_asset(asset_num, join_lh(amount_low, amount_high)); } \
                                                               \
    json_asset cpp_hive(const int32_t amount_low, const int32_t amount_high)const \
    { return cpp::base_class_name::cpp_hive(join_lh(amount_low, amount_high)); } \
                                                               \
    json_asset cpp_hbd(const int32_t amount_low, const int32_t amount_high)const \
    { return cpp::base_class_name::cpp_hbd(join_lh(amount_low, amount_high)); } \
                                                               \
    json_asset cpp_vests(const int32_t amount_low, const int32_t amount_high)const \
    { return cpp::base_class_name::cpp_vests(join_lh(amount_low, amount_high)); } \

class protocol_wasm : public protocol
{
  PROTOCOL_WASM_BASE_IMPL(protocol);
};

class proto_protocol_wasm : public proto_protocol
{
  PROTOCOL_WASM_BASE_IMPL(proto_protocol);
};

using manabar_fn_t = result(const int32_t, const int32_t, const int32_t, const int32_t, const int32_t, const uint32_t);
using ext_json_asset_fn_t = json_asset(const int32_t, const int32_t)const;

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

  class_<protocol>("protocol_base")
    .constructor<>()
    .function("cpp_validate_operation", &protocol::cpp_validate_operation)
    .function("cpp_validate_transaction", &protocol::cpp_validate_transaction)
    .function("cpp_calculate_transaction_id", &protocol::cpp_calculate_transaction_id)
    .function("cpp_calculate_sig_digest", &protocol::cpp_calculate_sig_digest)
    .function("cpp_serialize_transaction", &protocol::cpp_serialize_transaction)
    .function("cpp_calculate_public_key", &protocol::cpp_calculate_public_key)
    .function("cpp_generate_private_key", &protocol::cpp_generate_private_key)
  ;

  class_<proto_protocol>("proto_protocol_base")
    .constructor<>()
    .function("cpp_validate_operation", &proto_protocol::cpp_validate_operation)
    .function("cpp_validate_transaction", &proto_protocol::cpp_validate_transaction)
    .function("cpp_calculate_transaction_id", &proto_protocol::cpp_calculate_transaction_id)
    .function("cpp_calculate_sig_digest", &proto_protocol::cpp_calculate_sig_digest)
    .function("cpp_serialize_transaction", &proto_protocol::cpp_serialize_transaction)
    .function("cpp_calculate_public_key", &proto_protocol::cpp_calculate_public_key)
    .function("cpp_generate_private_key", &proto_protocol::cpp_generate_private_key)

    .function("cpp_proto_to_api", &proto_protocol::cpp_proto_to_api)
    .function("cpp_api_to_proto", &proto_protocol::cpp_api_to_proto)
  ;

  class_<protocol_wasm, base<protocol>>("protocol")
    .constructor<>()
    // Based on https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#overloaded-functions:
    .function("cpp_calculate_manabar_full_regeneration_time", select_overload<manabar_fn_t>(&protocol_wasm::cpp_calculate_manabar_full_regeneration_time))
    .function("cpp_calculate_current_manabar_value", select_overload<manabar_fn_t>(&protocol_wasm::cpp_calculate_current_manabar_value))
    .function("cpp_general_asset", select_overload<json_asset(const uint32_t, const int32_t, const int32_t)const>(&protocol_wasm::cpp_general_asset))
    .function("cpp_hive", select_overload<ext_json_asset_fn_t>(&protocol_wasm::cpp_hive))
    .function("cpp_hbd", select_overload<ext_json_asset_fn_t>(&protocol_wasm::cpp_hbd))
    .function("cpp_vests", select_overload<ext_json_asset_fn_t>(&protocol_wasm::cpp_vests))
  ;

  // We have to use it this way because JavaScript (and emscripten in conclusion) doesn't support multiple inheritance
  class_<proto_protocol_wasm, base<proto_protocol>>("proto_protocol")
    .constructor<>()
    .function("cpp_calculate_manabar_full_regeneration_time", select_overload<manabar_fn_t>(&proto_protocol_wasm::cpp_calculate_manabar_full_regeneration_time))
    .function("cpp_calculate_current_manabar_value", select_overload<manabar_fn_t>(&proto_protocol_wasm::cpp_calculate_current_manabar_value))
    .function("cpp_general_asset", select_overload<json_asset(const uint32_t, const int32_t, const int32_t)const>(&proto_protocol_wasm::cpp_general_asset))
    .function("cpp_hive", select_overload<ext_json_asset_fn_t>(&proto_protocol_wasm::cpp_hive))
    .function("cpp_hbd", select_overload<ext_json_asset_fn_t>(&proto_protocol_wasm::cpp_hbd))
    .function("cpp_vests", select_overload<ext_json_asset_fn_t>(&proto_protocol_wasm::cpp_vests))
  ;
}

int main() {
  // Main should not be run during TypeScript generation.
  //abort();
  std::cout << "This function does nothing... You have to instantiate wax_api on JS side to play with..." << std::endl;
  return 0;
}
