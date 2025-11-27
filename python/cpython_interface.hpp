#pragma once

#include <memory>
#include <string>

#include "py_object_ptr.hpp"
#include "core/foundation.hpp"

#include <Python.h>

namespace cpp
{
  ///  Interface providing Hive protocol functionality operating on Hive.
  class protocol : public foundation {
  public:
    hive_transaction_handle cpp_create_transaction_handle(PyObject* ptr, bool is_protobuf, bool is_legacy)const;
    hive_operation_handle cpp_create_operation_handle(PyObject* ptr, bool is_protobuf, bool is_legacy)const;

    cpp::hive_transaction_handle cpp_deserialize_transaction(std::string hex)const;

    void cpp_tx_proto_to_api(PyObject* ptr, bool is_legacy)const;
    void cpp_tx_api_to_proto(PyObject* ptr, bool is_legacy)const;

    cpp::hive_exception_data cpp_translate_to_wax_exception_data(std::exception_ptr ex)const;
  };

} /// namespace cpp

