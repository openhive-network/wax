#include <cpython_interface.hpp>

#include <iostream>

#include <emscripten/bind.h>

using namespace cpp;
using namespace emscripten;

class protocol_wasm : public protocol
{
  private:
    unsigned long long join_lh(int32_t low, int32_t high)const
    { return (unsigned long long) high << 32 | low; }

  public:
    result cpp_calculate_manabar_full_regeneration_time( const int32_t now, const int32_t max_mana_low, const int32_t max_mana_high, const int32_t current_mana_low, const int32_t current_mana_high, const uint32_t last_update_time )
    { return cpp::protocol::cpp_calculate_manabar_full_regeneration_time(now, join_lh(max_mana_low, max_mana_high), join_lh(current_mana_low, current_mana_high), last_update_time); }

    result cpp_calculate_current_manabar_value( const int32_t now, const int32_t max_mana_low, const int32_t max_mana_high, const int32_t current_mana_low, const int32_t current_mana_high, const uint32_t last_update_time )
    { return cpp::protocol::cpp_calculate_current_manabar_value(now, join_lh(max_mana_low, max_mana_high), join_lh(current_mana_low, current_mana_high), last_update_time); }

    json_asset general_asset(const uint32_t asset_num, const int32_t amount_low, const int32_t amount_high)const
    { return cpp::protocol::general_asset(asset_num, join_lh(amount_low, amount_high)); }

    json_asset hive(const int32_t amount_low, const int32_t amount_high)const
    { return cpp::protocol::hive(join_lh(amount_low, amount_high)); }

    json_asset hbd(const int32_t amount_low, const int32_t amount_high)const
    { return cpp::protocol::hbd(join_lh(amount_low, amount_high)); }

    json_asset vests(const int32_t amount_low, const int32_t amount_high)const
    { return cpp::protocol::vests(join_lh(amount_low, amount_high)); }
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
    // .function("general_asset", &protocol::general_asset)
    // .function("hive", &protocol::hive)
    // .function("hbd", &protocol::hbd)
    // .function("vests", &protocol::vests)
    // .function("cpp_calculate_manabar_full_regeneration_time", &protocol::cpp_calculate_manabar_full_regeneration_time) // <- overrode due to no emscripten int64 support
    // .function("cpp_calculate_current_manabar_value", &protocol::cpp_calculate_current_manabar_value) // <- overrode due to no emscripten int64 support
  ;

  class_<protocol_wasm, base<protocol>>("protocol")
    .constructor<>()
    // Based on https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#overloaded-functions:
    .function("cpp_calculate_manabar_full_regeneration_time", select_overload<manabar_fn_t>(&protocol_wasm::cpp_calculate_manabar_full_regeneration_time))
    .function("cpp_calculate_current_manabar_value", select_overload<manabar_fn_t>(&protocol_wasm::cpp_calculate_current_manabar_value))
    .function("general_asset", select_overload<json_asset(const uint32_t, const int32_t, const int32_t)const>(&protocol_wasm::general_asset))
    .function("hive", select_overload<ext_json_asset_fn_t>(&protocol_wasm::hive))
    .function("hbd", select_overload<ext_json_asset_fn_t>(&protocol_wasm::hbd))
    .function("vests", select_overload<ext_json_asset_fn_t>(&protocol_wasm::vests))
  ;
}

int main() {
  // Main should not be run during TypeScript generation.
  //abort();
  std::cout << "This function does nothing... You have to instantiate wax_api on JS side to play with..." << std::endl;
  return 0;
}
