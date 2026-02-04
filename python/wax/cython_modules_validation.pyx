# -*- coding: utf-8 -*-
# distutils: language = c++
# Validation functions for operations and transactions

from libcpp.string cimport string
from libcpp.vector cimport vector

import json

from cython_modules_common cimport protocol, hive_exception_data, exception_ptr, wrapped_exception_ptr_from_exception
from cython_modules_handles cimport WaxTransactionHandle, WaxOperationHandle, _create_wax_transaction, _create_wax_operation
from wax.wax_result import python_result

# Include shared decorators (these are def functions, cannot be cimported)
include "_decorators.pxi"


def operation_get_impacted_accounts(operation: bytes) -> vector[string]:
    """Get list of accounts impacted by an operation."""
    op = json.loads(operation)
    hOp = _create_wax_operation(op, False)
    return _op_impacted_accounts(hOp)


def transaction_get_impacted_accounts(transaction: bytes) -> vector[string]:
    """Get list of accounts impacted by a transaction."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, False)
    return _tx_impacted_accounts(hTx)


@return_python_result
def validate_operation(operation: bytes) -> python_result:
    """Validate an operation."""
    op = json.loads(operation)
    hOp = _create_wax_operation(op, False)
    _op_validate(hOp)


@return_python_result
def validate_transaction(transaction: bytes) -> python_result:
    """Validate a transaction."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, False)
    return _tx_validate(hTx)


@return_python_result
def calculate_transaction_id(transaction: bytes) -> python_result:
    """Calculate transaction ID using HF26 serialization."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, False)
    return _tx_id(hTx, True)


@return_python_result
def calculate_legacy_transaction_id(transaction: bytes) -> python_result:
    """Calculate transaction ID using legacy serialization."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, False)
    return _tx_id(hTx, False)


@return_python_result
def calculate_sig_digest(transaction: bytes, chain_id: bytes) -> python_result:
    """Calculate signature digest using HF26 serialization."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, False)
    return _tx_sig_digest(hTx, chain_id, True)


@return_python_result
def calculate_legacy_sig_digest(transaction: bytes, chain_id: bytes) -> python_result:
    """Calculate signature digest using legacy serialization."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, False)
    return _tx_sig_digest(hTx, chain_id, False)


def is_valid_account_name(account_name: bytes) -> bool:
    """Check if account name is valid."""
    cdef protocol obj
    return obj.cpp_is_valid_account_name(account_name)


# =============================================================================
# cdef functions - for internal use by other Cython modules (via cimport)
# These functions are declared in cython_modules_validation.pxd
# =============================================================================

cdef vector[string] _op_impacted_accounts(WaxOperationHandle wax_op):
    """Internal: Get impacted accounts from operation handle."""
    cdef protocol obj
    return obj.cpp_op_impacted_accounts(wax_op.hOp)


cdef void _op_validate(WaxOperationHandle wax_op):
    """Internal: Validate operation handle."""
    cdef protocol obj
    obj.cpp_op_validate(wax_op.hOp)


cdef vector[string] _tx_impacted_accounts(WaxTransactionHandle wax_tx):
    """Internal: Get impacted accounts from transaction handle."""
    cdef protocol obj
    return obj.cpp_tx_impacted_accounts(wax_tx.hTx)


cdef void _tx_validate(WaxTransactionHandle wax_tx):
    """Internal: Validate transaction handle."""
    cdef protocol obj
    obj.cpp_tx_validate(wax_tx.hTx)


cdef bytes _tx_id(WaxTransactionHandle wax_tx, bint use_hf26_serialization):
    """Internal: Get transaction ID from handle."""
    cdef protocol obj
    return obj.cpp_tx_id(wax_tx.hTx, use_hf26_serialization)


cdef bytes _tx_sig_digest(WaxTransactionHandle wax_tx, bytes chain_id, bint use_hf26_serialization):
    """Internal: Get signature digest from transaction handle."""
    cdef protocol obj
    return obj.cpp_tx_sig_digest(wax_tx.hTx, chain_id, use_hf26_serialization)


# =============================================================================
# def functions - public Python API (exported to wax package)
# These wrap the cdef functions for Python access
# =============================================================================

def op_impacted_accounts(wax_op: WaxOperationHandle) -> vector[string]:
    """Get impacted accounts from operation handle."""
    return _op_impacted_accounts(wax_op)


def op_validate(wax_op: WaxOperationHandle) -> None:
    """Validate operation handle."""
    _op_validate(wax_op)


def tx_impacted_accounts(tx: WaxTransactionHandle) -> vector[string]:
    """Get impacted accounts from transaction handle."""
    return _tx_impacted_accounts(tx)


def tx_validate(tx: WaxTransactionHandle) -> None:
    """Validate transaction handle."""
    _tx_validate(tx)


def tx_id(tx: WaxTransactionHandle, use_hf26_serialization: bool = True) -> bytes:
    """Get transaction ID from handle."""
    return _tx_id(tx, use_hf26_serialization)


def tx_sig_digest(tx: WaxTransactionHandle, chain_id: bytes, use_hf26_serialization: bool = True) -> bytes:
    """Get signature digest from transaction handle."""
    return _tx_sig_digest(tx, chain_id, use_hf26_serialization)
