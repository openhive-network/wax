#pragma once

#include <memory>
#include <string>

#include "py_object_ptr.hpp"
#include "core/foundation.hpp"
#include "core/protocol_impl.hpp"
#include "core/protobuf_protocol_impl.hpp"

#include <Python.h>

namespace cpp
{
  ///  Interface providing Hive protocol functionality operating on Hive native JSON format.
  class protocol : public protocol_impl<foundation> {
  public:
  };

  ///  Interface providing Hive protocol functionality operating on Protobuf specific JSON format.
  class proto_protocol : public proto_protocol_impl<foundation> {
  public:
    hive_transaction_handle cpp_create_transaction_handle(PyObject* ptr, bool is_protobuf)const;
    hive_operation_handle cpp_create_operation_handle(PyObject* ptr, bool is_protobuf)const;

    void cpp_tx_proto_to_api(PyObject* ptr)const;
    void cpp_tx_api_to_proto(PyObject* ptr)const;
  };

  extern template class protocol_impl<foundation>;
  extern template class proto_protocol_impl<foundation>;

} /// namespace cpp

