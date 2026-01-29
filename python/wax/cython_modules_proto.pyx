# -*- coding: utf-8 -*-
# distutils: language = c++
# Protobuf-related functions - proto/api conversion, validation, serialization

from libcpp.string cimport string
from libcpp.vector cimport vector

import json

from cython_modules_common cimport protocol, hive_exception_data, exception_ptr, wrapped_exception_ptr_from_exception
from cython_modules_common import encode_str, decode_bytes, decode_list
from cython_modules_handles cimport WaxTransactionHandle, WaxOperationHandle, _create_wax_transaction, _create_wax_operation, _handle_deserialize_transaction
from cython_modules_validation cimport _op_impacted_accounts, _op_validate, _tx_impacted_accounts, _tx_validate, _tx_id, _tx_sig_digest
from cython_modules_transactions cimport _tx_to_binary, _tx_to_json, _tx_to_legacy_json
from wax.wax_result import python_result

# Include shared decorators (these are def functions, cannot be cimported)
include "_decorators.pxi"

# Note: tx_required_authorities from cython_modules_operations.pyx is a def function (returns Python object)
# so it cannot be cimported. It will be called directly since all modules compile to one .so.
# Forward declaration is not needed for def functions in the same compilation unit.


def proto_operation_get_impacted_accounts(operation: str) -> list[str]:
    """Get impacted accounts from a protobuf operation."""
    op = json.loads(operation)
    hOp = _create_wax_operation(op, True)
    return decode_list(_op_impacted_accounts(hOp))


def proto_transaction_get_impacted_accounts(transaction: str) -> list[str]:
    """Get impacted accounts from a protobuf transaction."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, True)
    return decode_list(_tx_impacted_accounts(hTx))


@return_python_result
def validate_proto_operation(operation: str) -> python_result:
    """Validate a protobuf operation."""
    op = json.loads(operation)
    hOp = _create_wax_operation(op, True)
    _op_validate(hOp)


@return_python_result
def validate_proto_transaction(transaction: str) -> python_result:
    """Validate a protobuf transaction."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, True)
    _tx_validate(hTx)


@return_python_result
def calculate_proto_transaction_id(transaction: str) -> python_result:
    """Calculate transaction ID from a protobuf transaction."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, True)
    return _tx_id(hTx, True)


@return_python_result
def calculate_proto_legacy_transaction_id(transaction: str) -> python_result:
    """Calculate legacy transaction ID from a protobuf transaction."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, True)
    return _tx_id(hTx, False)


@return_python_result
def calculate_proto_sig_digest(transaction: str, chain_id: str) -> python_result:
    """Calculate signature digest from a protobuf transaction."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, True)
    return _tx_sig_digest(hTx, encode_str(chain_id), True)


@return_python_result
def calculate_proto_legacy_sig_digest(transaction: str, chain_id: str) -> python_result:
    """Calculate legacy signature digest from a protobuf transaction."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, True)
    return _tx_sig_digest(hTx, encode_str(chain_id), False)


@return_python_result
def serialize_proto_transaction(transaction: str) -> python_result:
    """Serialize a protobuf transaction to binary."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, True)
    return _tx_to_binary(hTx, True, False)


@return_python_result
def deserialize_proto_transaction(transaction: str) -> python_result:
    """Deserialize a binary transaction to protobuf format."""
    hTx = _handle_deserialize_transaction(encode_str(transaction))
    # Convert from api to proto:
    tx = json.loads(_tx_to_json(hTx))
    tx_api_to_proto(tx)
    return json.dumps(tx)


@return_python_result
def proto_to_api(only_tx: str) -> python_result:
    """Convert a protobuf transaction to API format."""
    tx = json.loads(only_tx)
    if "ref_block_num" not in tx:
        raise ValueError("Invalid input: Expected a transaction object.")

    tx_proto_to_api(tx)
    return json.dumps(tx)


@return_python_result
def proto_to_legacy_api(only_tx: str) -> python_result:
    """Convert a protobuf transaction to legacy API format."""
    tx = json.loads(only_tx)
    if "ref_block_num" not in tx:
        raise ValueError("Invalid input: Expected a transaction object.")

    hTx = _create_wax_transaction(tx, True)
    return _tx_to_legacy_json(hTx)


@return_python_result
def api_to_proto(only_tx: str) -> python_result:
    """Convert an API transaction to protobuf format."""
    tx = json.loads(only_tx)
    if "ref_block_num" not in tx:
        raise ValueError("Invalid input: Expected a transaction object.")

    tx_api_to_proto(tx)
    return json.dumps(tx)


def tx_proto_to_api(tx: object) -> None:
    """Convert transaction from proto to API format (in-place)."""
    cdef protocol obj
    obj.cpp_tx_proto_to_api(tx)


def tx_api_to_proto(transaction: object) -> None:
    """Convert transaction from API to proto format (in-place)."""
    cdef protocol obj
    obj.cpp_tx_api_to_proto(transaction)


# Note: get_transaction_required_authorities was moved to cython_modules_operations.pyx
# because it depends on tx_required_authorities defined there.
