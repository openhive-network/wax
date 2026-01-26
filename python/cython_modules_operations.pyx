# -*- coding: utf-8 -*-
# distutils: language = c++
# Operation-related functions - serialization, binary conversion, etc.

from libcpp.string cimport string
from libcpp.vector cimport vector

import json

from cython_modules_common cimport protocol, binary_data, binary_data_node, required_authority_collection, convert_binary_data_node_to_python
from cython_modules_handles cimport WaxOperationHandle, WaxTransactionHandle, _create_wax_transaction
from wax.wax_result import python_binary_data, python_required_authority_collection, python_authority


def op_to_binary(wax_op: WaxOperationHandle, use_hf26_serialization: bool = True) -> bytes:
    """Convert an operation to binary format."""
    cdef protocol obj
    return obj.cpp_op_to_binary(wax_op.hOp, use_hf26_serialization)


def op_to_json(wax_op: WaxOperationHandle) -> bytes:
    """Convert an operation to JSON format."""
    cdef protocol obj
    return obj.cpp_op_to_json(wax_op.hOp)


def op_binary(wax_op: WaxOperationHandle, use_hf26_serialization: bool = True) -> python_binary_data:
    """Get binary representation of an operation with offset information."""
    cdef protocol obj
    cdef binary_data data = obj.cpp_op_binary(wax_op.hOp, use_hf26_serialization)
    cdef list offsets = []
    for node in data.offsets:
        offsets.append(convert_binary_data_node_to_python(node))
    return python_binary_data(
        binary=data.binary,
        offsets=offsets
    )


def op_required_authorities(wax_op: WaxOperationHandle) -> python_required_authority_collection:
    """Get required authorities for an operation."""
    cdef protocol obj
    cdef required_authority_collection collection = obj.cpp_op_required_authorities(wax_op.hOp)

    op = set(collection.posting_accounts)
    oa = set(collection.active_accounts)
    oo = set(collection.owner_accounts)
    other_auths = []
    for auth in collection.other_authorities:
        other_auths.append(python_authority(
            weight_threshold=auth.weight_threshold,
            key_auths=auth.key_auths,
            account_auths=auth.account_auths
        ))

    return python_required_authority_collection(
        posting_accounts=op,
        active_accounts=oa,
        owner_accounts=oo,
        other_authorities=other_auths,
    )


def tx_required_authorities(tx: WaxTransactionHandle) -> python_required_authority_collection:
    """Get required authorities for a transaction."""
    cdef protocol obj
    cdef required_authority_collection collection = obj.cpp_tx_required_authorities(tx.hTx)

    op = set(collection.posting_accounts)
    oa = set(collection.active_accounts)
    oo = set(collection.owner_accounts)
    other_auths = []
    for auth in collection.other_authorities:
        other_auths.append(python_authority(
            weight_threshold=auth.weight_threshold,
            key_auths=auth.key_auths,
            account_auths=auth.account_auths
        ))

    return python_required_authority_collection(
        posting_accounts=op,
        active_accounts=oa,
        owner_accounts=oo,
        other_authorities=other_auths,
    )


def get_transaction_required_authorities(transaction: bytes) -> python_required_authority_collection:
    """Get required authorities for a transaction from JSON bytes."""
    tx = json.loads(transaction)
    hTx = _create_wax_transaction(tx, False)
    return tx_required_authorities(hTx)
