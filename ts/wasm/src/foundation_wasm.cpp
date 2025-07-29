#include "foundation_wasm.hpp"

#include "core/utils.hpp"

bool foundation_wasm::cpp_get_js_object(emscripten::val obj) const
{
  std::string author = obj["author"].as<std::string>();
  dlog((author));

  return author == "user";
}

std::shared_ptr<cpp::hive_transaction_handle> foundation_wasm::cpp_create_transaction_handle(emscripten::val emval, bool is_protobuf)const
{
  return cpp::safe_exception_wrapper([&]() -> std::shared_ptr<cpp::hive_transaction_handle> {
    auto h = std::make_shared<cpp::hive_transaction_handle>();

    fc::reflector< hive::protocol::signed_transaction >::visit(
      cpp::val_protocol_visitor< emscripten_managed_object, hive::protocol::signed_transaction >{ emscripten_managed_object{ emval }, h->get(), is_protobuf }
    );

    return h;
  });
}

std::shared_ptr<cpp::hive_operation_handle> foundation_wasm::cpp_create_operation_handle(emscripten::val emval, bool is_protobuf)const
{
  return cpp::safe_exception_wrapper([&]() -> std::shared_ptr<cpp::hive_operation_handle> {
    cpp::hive_operation_handle h;

    hive::protocol::operation obj;

    cpp::from_jsval(emscripten_managed_object{ emval }, obj, is_protobuf);

    h.op.reset(new cpp::hive_op(std::move(obj)));

    return std::make_shared<cpp::hive_operation_handle>(std::move(h));
  });
}

std::shared_ptr<cpp::hive_transaction_handle> foundation_wasm::cpp_deserialize_transaction(std::string hex)const
{
  return cpp::safe_exception_wrapper([&]() -> std::shared_ptr<cpp::hive_transaction_handle> {
    auto h = std::make_shared<cpp::hive_transaction_handle>();
    cpp_deserialize_hive_tx(hex, &h->get());

    return h;
  });
}

std::shared_ptr<cpp::hive_operation_handle> foundation_wasm::cpp_deserialize_operation(std::string hex)const
{
  return cpp::safe_exception_wrapper([&]() -> std::shared_ptr<cpp::hive_operation_handle> {
    cpp::hive_operation_handle h = foundation::cpp_deserialize_operation(std::move(hex));

    return std::make_shared<cpp::hive_operation_handle>(std::move(h));
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
