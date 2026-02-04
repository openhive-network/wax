# -*- coding: utf-8 -*-
# distutils: language = c++
# Authority-related functions - signing keys collection, signature minimization, memo key checking

from typing import Callable

from libcpp.string cimport string as cppstring
from libcpp.vector cimport vector
from libcpp.map cimport map as cppmap
from libc.stdint cimport uint32_t

import json

from cython_modules_common cimport (
    protocol,
    wax_authority,
    wax_authorities,
    minimize_required_signatures_data_t,
)
from cython_modules_handles cimport WaxTransactionHandle, _create_wax_transaction
from wax.wax_result import python_authorities, python_minimize_required_signatures_data


cdef wax_authority python_authority_to_wax_authority(object auth_obj):
    """Convert Python authority to C++ wax_authority."""
    auth = wax_authority()
    auth.weight_threshold = auth_obj.weight_threshold
    auth.key_auths = auth_obj.key_auths
    auth.account_auths = auth_obj.account_auths
    return auth


cdef wax_authorities python_authorities_to_wax_authorities(object auths_obj):
    """Convert Python authorities to C++ wax_authorities."""
    auths = wax_authorities()
    auths.active = python_authority_to_wax_authority(auths_obj.active)
    auths.owner = python_authority_to_wax_authority(auths_obj.owner)
    auths.posting = python_authority_to_wax_authority(auths_obj.posting)
    return auths


cdef cppmap[cppstring, wax_authorities] retrieve_authorities_cb(vector[cppstring] account_names, void* retrieve_authorities_fn):
    """Callback function for retrieving authorities from Python."""
    cdef object obj = (<object>retrieve_authorities_fn)(account_names)
    cdef cppmap[cppstring, wax_authorities] result
    for k, v in obj.items():
        auths = python_authorities_to_wax_authorities(v)
        result[k] = auths
    return result


def tx_collect_signing_keys(wax_tx: WaxTransactionHandle, retrieve_authorities: Callable[[list[bytes]], dict[bytes, python_authorities]]) -> list[bytes]:
    """Collect signing keys for a transaction handle."""
    cdef protocol obj
    return obj.cpp_collect_signing_keys(wax_tx.hTx, retrieve_authorities_cb, <void*>(retrieve_authorities))


def collect_signing_keys(transaction: bytes, retrieve_authorities: Callable[[list[bytes]], dict[bytes, python_authorities]]) -> list[bytes]:
    """Collect signing keys for a transaction."""
    tx = json.loads(transaction)
    wax_tx = _create_wax_transaction(tx, False)

    return tx_collect_signing_keys(wax_tx, retrieve_authorities)


cdef cppstring get_witness_key_cb(cppstring account_name, void* get_witness_key_fn):
    """Callback function for getting witness keys from Python."""
    cdef result = (<object>get_witness_key_fn)(account_name)
    return result


def tx_minimize_required_signatures(
    wax_tx: WaxTransactionHandle,
    minimize_required_signatures_data: python_minimize_required_signatures_data,
) -> list[bytes]:
    """Minimize required signatures for a transaction handle."""
    cdef protocol obj
    cdef minimize_required_signatures_data_t wax_minimize_required_signatures_data
    cdef uint32_t _uint_helper

    wax_minimize_required_signatures_data.chain_id = minimize_required_signatures_data.chain_id
    wax_minimize_required_signatures_data.available_keys = minimize_required_signatures_data.available_keys
    for k, v in minimize_required_signatures_data.authorities_map.items():
        auths = python_authorities_to_wax_authorities(v)
        wax_minimize_required_signatures_data.authorities_map[k] = auths
    wax_minimize_required_signatures_data.get_witness_key_cb = get_witness_key_cb
    wax_minimize_required_signatures_data.get_witness_key_fn = <void*>minimize_required_signatures_data.get_witness_key
    if minimize_required_signatures_data.max_recursion is not None:
        _uint_helper = int(minimize_required_signatures_data.max_recursion)
        wax_minimize_required_signatures_data.max_recursion = _uint_helper
    if minimize_required_signatures_data.max_membership is not None:
        _uint_helper = int(minimize_required_signatures_data.max_membership)
        wax_minimize_required_signatures_data.max_membership = _uint_helper
    if minimize_required_signatures_data.max_account_auths is not None:
        _uint_helper = int(minimize_required_signatures_data.max_account_auths)
        wax_minimize_required_signatures_data.max_account_auths = _uint_helper
    wax_minimize_required_signatures_data.allow_strict_and_mixed_authorities = minimize_required_signatures_data.allow_strict_and_mixed_authorities

    return obj.cpp_minimize_required_signatures(wax_tx.hTx, wax_minimize_required_signatures_data)


def minimize_required_signatures(
    signed_transaction: bytes,
    minimize_required_signatures_data: python_minimize_required_signatures_data,
) -> list[bytes]:
    """Minimize required signatures for a transaction."""
    tx = json.loads(signed_transaction)
    tx_handle = _create_wax_transaction(tx, False)

    return tx_minimize_required_signatures(tx_handle, minimize_required_signatures_data)


def check_memo_for_private_keys(memo: bytes, account: bytes, auths: python_authorities, memo_key: bytes, imported_keys: list[bytes] = []) -> None:
    """Check if a memo contains any private keys."""
    cdef protocol obj
    cdef wax_authorities wax_auths = python_authorities_to_wax_authorities(auths)
    obj.cpp_check_memo_for_private_keys(memo, account, wax_auths, memo_key, imported_keys)


def get_hive_protocol_config(chain_id: bytes) -> dict[bytes, bytes]:
    """Get the Hive protocol configuration for a given chain ID."""
    cdef protocol obj
    return obj.cpp_get_hive_protocol_config(chain_id)
