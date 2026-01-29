# -*- coding: utf-8 -*-
# distutils: language = c++
# Transaction-related functions - serialization, binary conversion, etc.

from libcpp.string cimport string
from libcpp.vector cimport vector

import json

from cython_modules_common cimport protocol, binary_data, binary_data_node, convert_binary_data_node_to_python, hive_exception_data, exception_ptr, wrapped_exception_ptr_from_exception
from cython_modules_common import encode_str, decode_bytes, decode_list
from cython_modules_handles cimport WaxTransactionHandle, WaxOperationHandle, _create_wax_transaction, _handle_deserialize_transaction
from wax.wax_result import python_result, python_binary_data

# Include shared decorators (these are def functions, cannot be cimported)
include "_decorators.pxi"


@return_python_result
def serialize_transaction(transaction: str) -> python_result:
    """Serialize a transaction to binary format."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, False)
    return tx_to_binary(hTx, True, False)


@return_python_result
def deserialize_transaction(transaction: str) -> python_result:
    """Deserialize a binary transaction to JSON."""
    hTx = _handle_deserialize_transaction(encode_str(transaction))
    return tx_to_json(hTx)


def legacy_tx_to_json(transaction_data: str) -> str:
    """Convert legacy transaction format to JSON."""
    cdef protocol obj
    return decode_bytes(obj.cpp_legacy_tx_to_json(encode_str(transaction_data)))


def tx_add_operation(tx: WaxTransactionHandle, operation: WaxOperationHandle) -> None:
    """Add an operation to a transaction."""
    cdef protocol obj
    obj.cpp_tx_add_operation(tx.hTx, operation.hOp)


def tx_add_signature(tx: WaxTransactionHandle, signature: str) -> None:
    """Add a signature to a transaction."""
    cdef protocol obj
    obj.cpp_tx_add_signature(tx.hTx, encode_str(signature))


def tx_set_expiration(tx: WaxTransactionHandle, expiration: str) -> None:
    """Set the expiration time for a transaction."""
    cdef protocol obj
    obj.cpp_tx_set_expiration(tx.hTx, encode_str(expiration))


# =============================================================================
# cdef functions - for internal use by other Cython modules (via cimport)
# These functions are declared in cython_modules_transactions.pxd
# =============================================================================

cdef bytes _tx_to_legacy_json(WaxTransactionHandle wax_tx):
    """Internal: Convert a transaction to legacy JSON format."""
    cdef protocol obj
    return obj.cpp_tx_to_legacy_json(wax_tx.hTx)


cdef bytes _tx_to_binary(WaxTransactionHandle wax_tx, bint use_hf26_serialization, bint strip_to_unsigned_transaction):
    """Internal: Convert a transaction to binary format."""
    cdef protocol obj
    return obj.cpp_tx_to_binary(wax_tx.hTx, use_hf26_serialization, strip_to_unsigned_transaction)


cdef bytes _tx_to_json(WaxTransactionHandle wax_tx):
    """Internal: Convert a transaction to JSON format."""
    cdef protocol obj
    return obj.cpp_tx_to_json(wax_tx.hTx)


# =============================================================================
# def functions - public Python API (exported to wax package)
# =============================================================================

def tx_to_legacy_json(tx: WaxTransactionHandle) -> str:
    """Convert a transaction to legacy JSON format."""
    return decode_bytes(_tx_to_legacy_json(tx))


def tx_to_binary(tx: WaxTransactionHandle, use_hf26_serialization: bool = True, strip_to_unsigned_transaction: bool = False) -> str:
    """Convert a transaction to binary format."""
    return decode_bytes(_tx_to_binary(tx, use_hf26_serialization, strip_to_unsigned_transaction))


def tx_to_json(tx: WaxTransactionHandle) -> str:
    """Convert a transaction to JSON format."""
    return decode_bytes(_tx_to_json(tx))


def tx_binary(tx: WaxTransactionHandle, use_hf26_serialization: bool = True, strip_to_unsigned_transaction: bool = False) -> python_binary_data:
    """Get binary representation of a transaction with offset information."""
    cdef protocol obj
    cdef binary_data data = obj.cpp_tx_binary(tx.hTx, use_hf26_serialization, strip_to_unsigned_transaction)
    cdef list offsets = []
    for node in data.offsets:
        offsets.append(convert_binary_data_node_to_python(node))
    return python_binary_data(
        binary=decode_bytes(data.binary),
        offsets=offsets
    )


def tx_signature_keys(tx: WaxTransactionHandle, chain_id: str, use_hf26_serialization: bool = True) -> list[str]:
    """Get signature keys from a transaction."""
    cdef protocol obj
    return decode_list(obj.cpp_tx_signature_keys(tx.hTx, encode_str(chain_id), use_hf26_serialization))
