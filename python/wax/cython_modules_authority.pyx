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
    required_authority_collection,
    wax_authority,
    wax_authorities,
    minimize_required_signatures_data_t,
    has_authorization_data_t,
)
from cython_modules_common import encode_str, decode_bytes, encode_list, decode_list, encode_dict_str_int
from cython_modules_handles cimport WaxTransactionHandle, _create_wax_transaction
from wax.wax_result import python_authorities, python_minimize_required_signatures_data, python_required_authority_collection


cdef wax_authority python_authority_to_wax_authority(object auth_obj):
    """Convert Python authority to C++ wax_authority."""
    auth = wax_authority()
    auth.weight_threshold = auth_obj.weight_threshold
    # Encode string keys to bytes for C++
    auth.key_auths = encode_dict_str_int(auth_obj.key_auths)
    auth.account_auths = encode_dict_str_int(auth_obj.account_auths)
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
    # Decode bytes to str for Python callback
    decoded_names = decode_list(account_names)
    cdef object obj = (<object>retrieve_authorities_fn)(decoded_names)
    cdef cppmap[cppstring, wax_authorities] result
    for k, v in obj.items():
        auths = python_authorities_to_wax_authorities(v)
        result[encode_str(k)] = auths
    return result


def tx_collect_signing_keys(wax_tx: WaxTransactionHandle, retrieve_authorities: Callable[[list[str]], dict[str, python_authorities]]) -> list[str]:
    """Collect signing keys for a transaction handle."""
    cdef protocol obj
    return decode_list(obj.cpp_collect_signing_keys(wax_tx.hTx, retrieve_authorities_cb, <void*>(retrieve_authorities)))


def collect_signing_keys(transaction: str, retrieve_authorities: Callable[[list[str]], dict[str, python_authorities]]) -> list[str]:
    """Collect signing keys for a transaction."""
    tx = json.loads(transaction)
    wax_tx = _create_wax_transaction(tx, False)

    return tx_collect_signing_keys(wax_tx, retrieve_authorities)


cdef cppstring get_witness_key_cb(cppstring account_name, void* get_witness_key_fn):
    """Callback function for getting witness keys from Python."""
    # Decode bytes to str for Python callback, encode result back to bytes
    cdef result = (<object>get_witness_key_fn)(decode_bytes(account_name))
    return encode_str(result)


def tx_minimize_required_signatures(
    wax_tx: WaxTransactionHandle,
    minimize_required_signatures_data: python_minimize_required_signatures_data,
) -> list[str]:
    """Minimize required signatures for a transaction handle."""
    cdef protocol obj
    cdef minimize_required_signatures_data_t wax_minimize_required_signatures_data
    cdef uint32_t _uint_helper

    wax_minimize_required_signatures_data.chain_id = encode_str(minimize_required_signatures_data.chain_id)
    wax_minimize_required_signatures_data.available_keys = encode_list(minimize_required_signatures_data.available_keys)
    for k, v in minimize_required_signatures_data.authorities_map.items():
        auths = python_authorities_to_wax_authorities(v)
        wax_minimize_required_signatures_data.authorities_map[encode_str(k)] = auths
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

    return decode_list(obj.cpp_minimize_required_signatures(wax_tx.hTx, wax_minimize_required_signatures_data))


def minimize_required_signatures(
    transaction: str,
    minimize_required_signatures_data: python_minimize_required_signatures_data,
) -> list[str]:
    """Minimize required signatures for a transaction."""
    tx = json.loads(transaction)
    tx_handle = _create_wax_transaction(tx, False)

    return tx_minimize_required_signatures(tx_handle, minimize_required_signatures_data)


def check_memo_for_private_keys(memo: str, account: str, auths: python_authorities, memo_key: str, imported_keys: list[str] = []) -> None:
    """Check if a memo contains any private keys."""
    cdef protocol obj
    cdef wax_authorities wax_auths = python_authorities_to_wax_authorities(auths)
    obj.cpp_check_memo_for_private_keys(encode_str(memo), encode_str(account), wax_auths, encode_str(memo_key), encode_list(imported_keys))


def get_hive_protocol_config(chain_id: str) -> dict[str, str]:
    """Get the Hive protocol configuration for a given chain ID."""
    cdef protocol obj
    result = obj.cpp_get_hive_protocol_config(encode_str(chain_id))
    return {decode_bytes(k): decode_bytes(v) for k, v in dict(result).items()}


def has_authorization(
    required_authorities: python_required_authority_collection,
    signature_public_keys: list[str],
    authorities_map: dict[str, python_authorities],
    get_witness_key: Callable[[str], str] | None = None,
    allow_strict_and_mixed_authorities: bool = False,
    allow_redundant_signatures: bool = False,
) -> bool:
    """Check if signature public keys satisfy the required authorities."""
    cdef protocol obj
    cdef has_authorization_data_t wax_data

    # Convert required authorities
    wax_data.required_authorities.active_accounts = encode_list(list(required_authorities.active_accounts))
    wax_data.required_authorities.owner_accounts = encode_list(list(required_authorities.owner_accounts))
    wax_data.required_authorities.posting_accounts = encode_list(list(required_authorities.posting_accounts))
    for other_auth in required_authorities.other_authorities:
        wax_data.required_authorities.other_authorities.push_back(python_authority_to_wax_authority(other_auth))

    wax_data.signature_public_keys = encode_list(signature_public_keys)

    for k, v in authorities_map.items():
        wax_data.authorities_map[encode_str(k)] = python_authorities_to_wax_authorities(v)

    if get_witness_key is not None:
        wax_data.get_witness_key_cb = get_witness_key_cb
        wax_data.get_witness_key_fn = <void*>get_witness_key

    wax_data.allow_strict_and_mixed_authorities = allow_strict_and_mixed_authorities
    wax_data.allow_redundant_signatures = allow_redundant_signatures

    return obj.cpp_has_authorization(wax_data)
