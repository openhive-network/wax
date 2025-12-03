# -*- coding: utf-8 -*-
# distutils: language = c++
# Operation-related functions - serialization, binary conversion, etc.

from libcpp.string cimport string
from libcpp.vector cimport vector

import json

from cython_modules_common cimport protocol, binary_data, binary_data_node, required_authority_collection, convert_binary_data_node_to_python
from cython_modules_common import decode_bytes, decode_dict_bytes_int
from cython_modules_handles cimport WaxOperationHandle, WaxTransactionHandle, _create_wax_transaction
from wax.wax_result import python_binary_data, python_required_authority_collection, python_authority
from wax.exceptions.wax_specialised_errors import wax_error_boundary


@wax_error_boundary
def op_to_binary(wax_op: WaxOperationHandle, use_hf26_serialization: bool = True) -> str:
    """Convert an operation to binary format."""
    cdef protocol obj
    return decode_bytes(obj.cpp_op_to_binary(wax_op.hOp, use_hf26_serialization))


@wax_error_boundary
def op_to_json(wax_op: WaxOperationHandle) -> str:
    """Convert an operation to JSON format."""
    cdef protocol obj
    return decode_bytes(obj.cpp_op_to_json(wax_op.hOp))


@wax_error_boundary
def op_binary(wax_op: WaxOperationHandle, use_hf26_serialization: bool = True) -> python_binary_data:
    """Get binary representation of an operation with offset information."""
    cdef protocol obj
    cdef binary_data data = obj.cpp_op_binary(wax_op.hOp, use_hf26_serialization)
    cdef list offsets = []
    for node in data.offsets:
        offsets.append(convert_binary_data_node_to_python(node))
    return python_binary_data(
        binary=decode_bytes(data.binary),
        offsets=offsets
    )


@wax_error_boundary
def op_required_authorities(wax_op: WaxOperationHandle) -> python_required_authority_collection:
    """Get required authorities for an operation."""
    cdef protocol obj
    cdef required_authority_collection collection = obj.cpp_op_required_authorities(wax_op.hOp)

    op = {decode_bytes(acc) for acc in collection.posting_accounts}
    oa = {decode_bytes(acc) for acc in collection.active_accounts}
    oo = {decode_bytes(acc) for acc in collection.owner_accounts}
    other_auths = []
    for auth in collection.other_authorities:
        other_auths.append(python_authority(
            weight_threshold=auth.weight_threshold,
            key_auths=decode_dict_bytes_int(auth.key_auths),
            account_auths=decode_dict_bytes_int(auth.account_auths)
        ))

    return python_required_authority_collection(
        posting_accounts=op,
        active_accounts=oa,
        owner_accounts=oo,
        other_authorities=other_auths,
    )


@wax_error_boundary
def tx_required_authorities(tx: WaxTransactionHandle) -> python_required_authority_collection:
    """Get required authorities for a transaction."""
    cdef protocol obj
    cdef required_authority_collection collection = obj.cpp_tx_required_authorities(tx.hTx)

    op = {decode_bytes(acc) for acc in collection.posting_accounts}
    oa = {decode_bytes(acc) for acc in collection.active_accounts}
    oo = {decode_bytes(acc) for acc in collection.owner_accounts}
    other_auths = []
    for auth in collection.other_authorities:
        other_auths.append(python_authority(
            weight_threshold=auth.weight_threshold,
            key_auths=decode_dict_bytes_int(auth.key_auths),
            account_auths=decode_dict_bytes_int(auth.account_auths)
        ))

    return python_required_authority_collection(
        posting_accounts=op,
        active_accounts=oa,
        owner_accounts=oo,
        other_authorities=other_auths,
    )


@wax_error_boundary
def get_transaction_required_authorities(transaction: str) -> python_required_authority_collection:
    """Get required authorities for a transaction from JSON string."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, False)
    return tx_required_authorities(hTx)
