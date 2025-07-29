#pragma once

#include "core/foundation.hpp"

#include "core/val_protocol.hpp"
#include "core/proto_converter.hpp"
#include "core/api_converter.hpp"

#include "emscripten_managed_object.hpp"

#include <emscripten/val.h>

class foundation_wasm : public cpp::foundation
{
public:
bool cpp_get_js_object(emscripten::val obj) const;

unsigned int cpp_report_transaction_handle_stats() const;
std::shared_ptr<cpp::hive_transaction_handle> cpp_create_transaction_handle(emscripten::val emval, bool is_protobuf)const;
std::shared_ptr<cpp::hive_operation_handle> cpp_create_operation_handle(emscripten::val emval, bool is_protobuf)const;

std::shared_ptr<cpp::hive_transaction_handle> cpp_deserialize_transaction(std::string hex)const;
std::shared_ptr<cpp::hive_operation_handle> cpp_deserialize_operation(std::string hex)const;

void cpp_tx_proto_to_api(emscripten::val emval)const;
void cpp_tx_api_to_proto(emscripten::val emval)const;
};
