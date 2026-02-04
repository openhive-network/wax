#include "cpython_interface.hpp"

#include "py_object_ptr.hpp"
#include "python_managed_object.hpp"

#include "core/val_protocol.hpp"
#include "core/api_converter.hpp"
#include "core/proto_converter.hpp"

#include "core/utils.hpp"

namespace cpp
{
hive_exception_data protocol::cpp_translate_to_wax_exception_data(std::exception_ptr ex)const
{
  if (not ex)
    return { "WaxError", "Unknown exception" };

  try
  {
    std::rethrow_exception(ex);
  }
  catch(const cpp::wax_chain_assertion& e)
  {
    return { "WaxChainAssertionError", e.what() };
  }
  catch(const cpp::wax_protocol_assertion& e)
  {
    return { "WaxProtocolAssertionError", e.what() };
  }
  catch(const cpp::wax_assertion& e)
  {
    return { "WaxAssertionError", e.what() };
  }
  catch(const std::exception& e)
  {
    return { "WaxError", e.what() };
  }
  catch(...)
  {
    return { "WaxError", "Unknown exception" };
  }
}

hive_transaction_handle protocol::cpp_deserialize_transaction(std::string hex)const
{
  return safe_exception_wrapper([&]() -> hive_transaction_handle {
    hive_transaction_handle h;
    cpp_deserialize_hive_tx(hex, &h.get());
    return h;
  });
}

hive_transaction_handle protocol::cpp_create_transaction_handle(PyObject* ptr, bool is_protobuf)const
{
  return safe_exception_wrapper([&]() -> hive_transaction_handle {
    hive_transaction_handle h;

    fc::reflector< hive::protocol::signed_transaction >::visit(
      val_protocol_visitor< python_managed_object, hive::protocol::signed_transaction >{ python_managed_object{ py_object_ptr::share(ptr) }, h.get(), is_protobuf }
    );

    return h;
  });
}

hive_operation_handle protocol::cpp_create_operation_handle(PyObject* ptr, bool is_protobuf)const
{
  return safe_exception_wrapper([&]() -> hive_operation_handle {
    hive_operation_handle h;

    hive::protocol::operation obj;

    cpp::from_jsval(python_managed_object{ py_object_ptr::share(ptr) }, obj, is_protobuf);

    h.op.reset(new hive_op(std::move(obj)));

    return h;
  });
}

void protocol::cpp_tx_proto_to_api(PyObject* ptr)const
{
  safe_exception_wrapper([&]() -> void {
    fc::reflector< hive::protocol::signed_transaction >::visit(
      to_api_visitor< python_managed_object, hive::protocol::signed_transaction >{ python_managed_object{ py_object_ptr::share(ptr) } }
    );
  });
}

void protocol::cpp_tx_api_to_proto(PyObject* ptr)const
{
  safe_exception_wrapper([&]() -> void {
    fc::reflector< hive::protocol::signed_transaction >::visit(
      to_proto_visitor< python_managed_object, hive::protocol::signed_transaction >{ python_managed_object{ py_object_ptr::share(ptr) } }
    );
  });
}

} // namespace cpp
