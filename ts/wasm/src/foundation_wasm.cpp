#include "foundation_wasm.hpp"

#include "core/utils.hpp"

bool foundation_wasm::cpp_get_js_object(emscripten::val obj) const
{
  std::string author = obj["author"].as<std::string>();
  dlog((author));

  return author == "user";
}

cpp::hive_transaction_handle foundation_wasm::cpp_create_transaction_handle(emscripten::val emval, bool is_protobuf)const
{
  return cpp::safe_exception_wrapper([&]() -> cpp::hive_transaction_handle {
    cpp::hive_transaction_handle h;

    hive::protocol::signed_transaction obj;

    fc::reflector< hive::protocol::signed_transaction >::visit(
      cpp::val_protocol_visitor< emscripten_managed_object, hive::protocol::signed_transaction >{ emscripten_managed_object{ emval }, obj, is_protobuf }
    );

    h.tx.reset(new cpp::hive_tx(std::move(obj)));

    return h;
  });
}

cpp::hive_operation_handle foundation_wasm::cpp_create_operation_handle(emscripten::val emval, bool is_protobuf)const
{
  return cpp::safe_exception_wrapper([&]() -> cpp::hive_operation_handle {
    cpp::hive_operation_handle h;

    hive::protocol::operation obj;

    cpp::from_jsval(emscripten_managed_object{ emval }, obj, is_protobuf);

    h.op.reset(new cpp::hive_op(std::move(obj)));

    return h;
  });
}

void foundation_wasm::cpp_tx_proto_to_api(emscripten::val emval)const
{
  cpp::safe_exception_wrapper([&]() -> void {
    fc::reflector< hive::protocol::signed_transaction >::visit(
      cpp::to_api_visitor< emscripten_managed_object, hive::protocol::signed_transaction >{ emscripten_managed_object{ emval } }
    );
  });
}
void foundation_wasm::cpp_tx_api_to_proto(emscripten::val emval)const
{
  cpp::safe_exception_wrapper([&]() -> void {
    fc::reflector< hive::protocol::signed_transaction >::visit(
      cpp::to_proto_visitor< emscripten_managed_object, hive::protocol::signed_transaction >{ emscripten_managed_object{ emval } }
    );
  });
}

cpp::hive_transaction_handle foundation_wasm::cpp_deserialize_transaction(std::string hex)const
{
  return cpp::safe_exception_wrapper([&]() -> cpp::hive_transaction_handle {
    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

    std::vector<char> raw_data(hex.size());
    fc::from_hex(hex, raw_data.data(), raw_data.size());

    hive::protocol::signed_transaction obj;
    fc::raw::unpack_from_char_array(raw_data.data(), static_cast<uint32_t>(raw_data.size()), obj, 0);

    cpp::hive_transaction_handle h;
    h.tx.reset(new cpp::hive_tx(std::move(obj)));

    return h;
  });
}
cpp::hive_operation_handle foundation_wasm::cpp_deserialize_operation(std::string hex)const
{
  return cpp::safe_exception_wrapper([&]() -> cpp::hive_operation_handle {
    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

    std::vector<char> raw_data(hex.size());
    fc::from_hex(hex, raw_data.data(), raw_data.size());

    hive::protocol::operation obj;
    fc::raw::unpack_from_char_array(raw_data.data(), static_cast<uint32_t>(raw_data.size()), obj, 0);

    cpp::hive_operation_handle h;
    h.op.reset(new cpp::hive_op(std::move(obj)));

    return h;
  });
}
