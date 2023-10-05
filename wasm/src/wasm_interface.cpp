#include <cpython_interface.hpp>

#include <iostream>

#include <emscripten/bind.h>

using namespace cpp;
using namespace emscripten;

using manabar_fn_t = result(const int32_t, const int32_t, const int32_t, const int32_t, const int32_t, const uint32_t);
using ext_json_asset_fn_t = json_asset(const int32_t, const int32_t)const;

class foundation_wasm : public foundation
{
private:
  unsigned long long join_lh(int32_t low, int32_t high)const 
{ return (unsigned long long) high << 32 | low; }

public:
  result cpp_calculate_manabar_full_regeneration_time(const int32_t now, const int32_t max_mana_low, const int32_t max_mana_high, const int32_t current_mana_low, const int32_t current_mana_high, const uint32_t last_update_time) 
{ return foundation::cpp_calculate_manabar_full_regeneration_time(now, join_lh(max_mana_low, max_mana_high), join_lh(current_mana_low, current_mana_high), last_update_time); }

result cpp_calculate_current_manabar_value(const int32_t now, const int32_t max_mana_low, const int32_t max_mana_high, const int32_t current_mana_low, const int32_t current_mana_high, const uint32_t last_update_time) 
{ return foundation::cpp_calculate_current_manabar_value(now, join_lh(max_mana_low, max_mana_high), join_lh(current_mana_low, current_mana_high), last_update_time); }

json_asset cpp_general_asset(const uint32_t asset_num, const int32_t amount_low, const int32_t amount_high)const 
{ return foundation::cpp_general_asset(asset_num, join_lh(amount_low, amount_high)); }

json_asset cpp_hive(const int32_t amount_low, const int32_t amount_high)const 
{ return foundation::cpp_hive(join_lh(amount_low, amount_high)); }

json_asset cpp_hbd(const int32_t amount_low, const int32_t amount_high)const 
{ return foundation::cpp_hbd(join_lh(amount_low, amount_high)); }

json_asset cpp_vests(const int32_t amount_low, const int32_t amount_high)const 
{ return foundation::cpp_vests(join_lh(amount_low, amount_high)); }

result cpp_generate_private_key() 
{ return foundation::cpp_generate_private_key(); }

result cpp_calculate_public_key(const std::string& wif) 
{ return foundation::cpp_calculate_public_key(wif); }
};

class protocol_wasm : public foundation_wasm
{
public:
  result cpp_validate_operation(const std::string& operation)
  {
    protocol p;
    return p.cpp_validate_operation(operation);
  }
  result cpp_validate_transaction(const std::string& transaction)
  {
    protocol p;
    return p.cpp_validate_transaction(transaction);
  }

  result cpp_calculate_transaction_id(const std::string& transaction)
  {
    protocol p;
    return p.cpp_calculate_transaction_id(transaction);
  }
  result cpp_calculate_sig_digest(const std::string& transaction, const std::string& chain_id)
  {
    protocol p;
    return p.cpp_calculate_sig_digest(transaction, chain_id);
  }
  result cpp_serialize_transaction(const std::string& transaction)
  {
    protocol p;
    return p.cpp_serialize_transaction(transaction);
  }

};

class proto_protocol_wasm : public foundation_wasm
{
public:
  result cpp_validate_operation(const std::string& operation)
  {
    proto_protocol p;
    return p.cpp_validate_operation(operation);
  }

  result cpp_validate_transaction(const std::string& transaction)
  {
    proto_protocol p;
    return p.cpp_validate_transaction(transaction);
  }

  result cpp_calculate_transaction_id(const std::string& transaction)
  {
    proto_protocol p;
    return p.cpp_calculate_transaction_id(transaction);
  }

  result cpp_calculate_sig_digest(const std::string& transaction, const std::string& chain_id)
  {
    proto_protocol p;
    return p.cpp_calculate_sig_digest(transaction, chain_id);
  }

  result cpp_serialize_transaction(const std::string& transaction)
  {
    proto_protocol p;
    return p.cpp_serialize_transaction(transaction);
  }


  // TODO: Implement block bi-directional protobuf JSON conversion
  result cpp_proto_to_api(const std::string& operation_or_tx)
  {
    proto_protocol p;
    return p.cpp_proto_to_api(operation_or_tx);
  }

  result cpp_api_to_proto(const std::string& operation_or_tx)
  {
    proto_protocol p;
    return p.cpp_api_to_proto(operation_or_tx);
  }

};

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

  class_<foundation_wasm>("protocol_foundation")
    .constructor<>()
    .function("cpp_calculate_public_key", &foundation_wasm::cpp_calculate_public_key)
    .function("cpp_generate_private_key", &foundation_wasm::cpp_generate_private_key)

    // Based on https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#overloaded-functions:
    .function("cpp_general_asset", select_overload<json_asset(const uint32_t, const int32_t, const int32_t)const>(&foundation_wasm::cpp_general_asset))
    .function("cpp_hive", select_overload<ext_json_asset_fn_t>(&foundation_wasm::cpp_hive))
    .function("cpp_hbd", select_overload<ext_json_asset_fn_t>(&foundation_wasm::cpp_hbd))
    .function("cpp_vests", select_overload<ext_json_asset_fn_t>(&foundation_wasm::cpp_vests))

    .function("cpp_calculate_manabar_full_regeneration_time", select_overload<manabar_fn_t>(&foundation_wasm::cpp_calculate_manabar_full_regeneration_time))
    .function("cpp_calculate_current_manabar_value", select_overload<manabar_fn_t>(&foundation_wasm::cpp_calculate_current_manabar_value))
    ;

  class_<protocol_wasm, base<foundation_wasm>>("protocol")
    .constructor<>()

    .function("cpp_validate_operation", &protocol_wasm::cpp_validate_operation)
    .function("cpp_validate_transaction", &protocol_wasm::cpp_validate_transaction)
    .function("cpp_calculate_transaction_id", &protocol_wasm::cpp_calculate_transaction_id)
    .function("cpp_calculate_sig_digest", &protocol_wasm::cpp_calculate_sig_digest)
    .function("cpp_serialize_transaction", &protocol_wasm::cpp_serialize_transaction)
  ;

  // We have to use it this way because JavaScript (and emscripten in conclusion) doesn't support multiple inheritance
  class_<proto_protocol_wasm, base<foundation_wasm>>("proto_protocol")
    .constructor<>()
    .function("cpp_validate_operation", &proto_protocol_wasm::cpp_validate_operation)
    .function("cpp_validate_transaction", &proto_protocol_wasm::cpp_validate_transaction)
    .function("cpp_calculate_transaction_id", &proto_protocol_wasm::cpp_calculate_transaction_id)
    .function("cpp_calculate_sig_digest", &proto_protocol_wasm::cpp_calculate_sig_digest)
    .function("cpp_serialize_transaction", &proto_protocol_wasm::cpp_serialize_transaction)
    .function("cpp_proto_to_api", &proto_protocol_wasm::cpp_proto_to_api)
    .function("cpp_api_to_proto", &proto_protocol_wasm::cpp_api_to_proto)

    ;
}

int main() {
  // Main should not be run during TypeScript generation.
  //abort();
  std::cout << "This function does nothing... You have to instantiate wax_api on JS side to play with..." << std::endl;
  return 0;
}
