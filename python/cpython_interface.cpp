#include "cpython_interface.hpp"

#include "py_object_ptr.hpp"
#include "python_managed_object.hpp"

#include "core/val_protocol.hpp"
#include "core/api_converter.hpp"
#include "core/proto_converter.hpp"
#include "core/protocol_impl.inl"
#include "core/protobuf_protocol_impl.inl"

namespace cpp
{

template class protocol_impl<foundation>;
template class proto_protocol_impl<foundation>;

hive_transaction_handle proto_protocol::cpp_create_transaction_handle(PyObject* ptr, bool is_protobuf)const
{
  return cpp::safe_exception_wrapper([&]() -> hive_transaction_handle {
    hive_transaction_handle h;

    hive::protocol::signed_transaction obj;

    fc::reflector< hive::protocol::signed_transaction >::visit(
      val_protocol_visitor< python_managed_object, hive::protocol::signed_transaction >{ python_managed_object{ py_object_ptr::share(ptr) }, obj, is_protobuf }
    );

    h.tx.reset(new hive_tx(std::move(obj)));

    return h;
  });
}

hive_operation_handle proto_protocol::cpp_create_operation_handle(PyObject* ptr, bool is_protobuf)const
{
  return cpp::safe_exception_wrapper([&]() -> hive_operation_handle {
    hive_operation_handle h;

    hive::protocol::operation obj;

    cpp::from_jsval(python_managed_object{ py_object_ptr::share(ptr) }, obj, is_protobuf);

    h.op.reset(new hive_op(std::move(obj)));

    return h;
  });
}

void proto_protocol::cpp_tx_proto_to_api(PyObject* ptr)const
{
  cpp::safe_exception_wrapper([&]() -> void {
    fc::reflector< hive::protocol::signed_transaction >::visit(
      to_api_visitor< python_managed_object, hive::protocol::signed_transaction >{ python_managed_object{ py_object_ptr::share(ptr) } }
    );
  });
}

void proto_protocol::cpp_tx_api_to_proto(PyObject* ptr)const
{
  cpp::safe_exception_wrapper([&]() -> void {
    fc::reflector< hive::protocol::signed_transaction >::visit(
      to_proto_visitor< python_managed_object, hive::protocol::signed_transaction >{ python_managed_object{ py_object_ptr::share(ptr) } }
    );
  });
}

} // namespace cpp
