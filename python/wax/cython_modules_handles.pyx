# -*- coding: utf-8 -*-
# distutils: language = c++
# Handle classes and handle creation/deserialization functions

from libcpp.utility cimport move

from cython_modules_common cimport protocol, hive_transaction_handle, hive_operation_handle, hive_exception_data, exception_ptr, wrapped_exception_ptr_from_exception
from cython_modules_common import encode_str

# Include shared decorators (these are def functions, cannot be cimported)
include "_decorators.pxi"

# Note: WaxTransactionHandle and WaxOperationHandle classes are fully declared
# in cython_modules_handles.pxd (including their cdef attributes).
# In Cython, when a cdef class is declared in a .pxd file, it must NOT be
# redeclared in the .pyx file - only methods can be defined here.


# =============================================================================
# cdef functions - for internal use by other Cython modules (via cimport)
# These functions are declared in cython_modules_handles.pxd
# =============================================================================

cdef WaxTransactionHandle _create_wax_transaction(object tx, bint is_protobuf):
    """Internal: Create a WaxTransactionHandle from a transaction dict."""
    cdef protocol obj
    cdef hive_transaction_handle hTx = obj.cpp_create_transaction_handle(tx, is_protobuf)
    cdef WaxTransactionHandle wax_tx = WaxTransactionHandle.__new__(WaxTransactionHandle)
    wax_tx.hTx = move(hTx)
    return wax_tx


cdef WaxOperationHandle _create_wax_operation(object op, bint is_protobuf):
    """Internal: Create a WaxOperationHandle from an operation dict."""
    cdef protocol obj
    cdef hive_operation_handle hOp = obj.cpp_create_operation_handle(op, is_protobuf)
    cdef WaxOperationHandle wax_op = WaxOperationHandle.__new__(WaxOperationHandle)
    wax_op.hOp = move(hOp)
    return wax_op


cdef WaxTransactionHandle _handle_deserialize_transaction(bytes transaction_data):
    """Internal: Deserialize binary transaction data into a WaxTransactionHandle."""
    cdef protocol obj
    cdef hive_transaction_handle hTx = obj.cpp_deserialize_transaction(transaction_data)
    cdef WaxTransactionHandle wax_tx = WaxTransactionHandle.__new__(WaxTransactionHandle)
    wax_tx.hTx = move(hTx)
    return wax_tx


cdef WaxOperationHandle _handle_deserialize_operation(bytes operation_data):
    """Internal: Deserialize binary operation data into a WaxOperationHandle."""
    cdef protocol obj
    cdef hive_operation_handle hOp = obj.cpp_deserialize_operation(operation_data)
    cdef WaxOperationHandle wax_op = WaxOperationHandle.__new__(WaxOperationHandle)
    wax_op.hOp = move(hOp)
    return wax_op


# =============================================================================
# def functions - public Python API (exported to wax package)
# These wrap the cdef functions with exception handling decorators
# =============================================================================

@wax_error_boundary
def create_wax_transaction(tx: object, is_protobuf: bool) -> WaxTransactionHandle:
    """Create a WaxTransactionHandle from a transaction dict."""
    return _create_wax_transaction(tx, is_protobuf)


@wax_error_boundary
def create_wax_operation(op: object, is_protobuf: bool) -> WaxOperationHandle:
    """Create a WaxOperationHandle from an operation dict."""
    return _create_wax_operation(op, is_protobuf)


def handle_deserialize_transaction(transaction_data: str) -> WaxTransactionHandle:
    """Deserialize binary transaction data into a WaxTransactionHandle."""
    return _handle_deserialize_transaction(encode_str(transaction_data))


def handle_deserialize_operation(operation_data: str) -> WaxOperationHandle:
    """Deserialize binary operation data into a WaxOperationHandle."""
    return _handle_deserialize_operation(encode_str(operation_data))
