#include <cpython_interface.hpp>

#include <iostream>

#include <emscripten/bind.h>

using namespace cpp;
using namespace emscripten;

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

  class_<protocol>("protocol")
    .constructor<>()
    .function("cpp_validate_operation", &protocol::cpp_validate_operation)
    .function("cpp_validate_transaction", &protocol::cpp_validate_transaction)
    .function("cpp_calculate_transaction_id", &protocol::cpp_calculate_transaction_id)
    .function("cpp_calculate_sig_digest", &protocol::cpp_calculate_sig_digest)
    .function("cpp_serialize_transaction", &protocol::cpp_serialize_transaction)
    .function("cpp_calculate_public_key", &protocol::cpp_calculate_public_key)
    .function("cpp_generate_private_key", &protocol::cpp_generate_private_key)
    .function("cpp_calculate_manabar_full_regeneration_time", &protocol::cpp_calculate_manabar_full_regeneration_time)
    .function("cpp_calculate_current_manabar_value", &protocol::cpp_calculate_current_manabar_value)
  ;
}

int main() {
  // Main should not be run during TypeScript generation.
  //abort();
  std::cout << "This function does nothing... You have to instantiate wax_api on JS side to play with..." << std::endl;
  return 0;
}
