# -*- coding: utf-8 -*-
# Handle class declarations for WaxTransactionHandle and WaxOperationHandle

from cpp_python_bridge cimport hive_transaction_handle, hive_operation_handle

cdef class WaxTransactionHandle:
    cdef hive_transaction_handle hTx

cdef class WaxOperationHandle:
    cdef hive_operation_handle hOp

# Declare cdef functions for creating handles (used by other modules via cimport)
cdef WaxTransactionHandle _create_wax_transaction(object tx, bint is_protobuf)
cdef WaxOperationHandle _create_wax_operation(object op, bint is_protobuf)
cdef WaxTransactionHandle _handle_deserialize_transaction(bytes transaction_data)
cdef WaxOperationHandle _handle_deserialize_operation(bytes operation_data)
