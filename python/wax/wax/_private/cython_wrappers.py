"""
Wrapper functions for Cython calls that handle subclasses of builtin types.

Cython 3.1.3 is deliberately stricter than PEP-484 and rejects subclasses
of builtin types like `str`. This module provides wrapper functions that
convert schema types (Hex, Identifier, PublicKey, PrivateKey, AccountName)
to plain `str` before passing them to Cython functions.
"""

from __future__ import annotations

import json
from typing import TYPE_CHECKING, Callable

from wax.cpp_python_bridge import (
    api_to_proto as _api_to_proto,
)
from wax.cpp_python_bridge import (
    calculate_legacy_sig_digest as _calculate_legacy_sig_digest,
)
from wax.cpp_python_bridge import (
    calculate_legacy_transaction_id as _calculate_legacy_transaction_id,
)
from wax.cpp_python_bridge import (
    calculate_proto_legacy_sig_digest as _calculate_proto_legacy_sig_digest,
)
from wax.cpp_python_bridge import (
    calculate_proto_legacy_transaction_id as _calculate_proto_legacy_transaction_id,
)
from wax.cpp_python_bridge import (
    calculate_proto_sig_digest as _calculate_proto_sig_digest,
)
from wax.cpp_python_bridge import (
    calculate_proto_transaction_id as _calculate_proto_transaction_id,
)
from wax.cpp_python_bridge import (
    calculate_public_key as _calculate_public_key,
)
from wax.cpp_python_bridge import (
    calculate_sig_digest as _calculate_sig_digest,
)
from wax.cpp_python_bridge import (
    calculate_transaction_id as _calculate_transaction_id,
)
from wax.cpp_python_bridge import (
    check_memo_for_private_keys as _check_memo_for_private_keys,
)
from wax.cpp_python_bridge import (
    collect_signing_keys as _collect_signing_keys,
)
from wax.cpp_python_bridge import (
    convert_wif_public_key_to_raw as _convert_wif_public_key_to_raw,
)
from wax.cpp_python_bridge import (
    decode_encrypted_memo as _decode_encrypted_memo,
)
from wax.cpp_python_bridge import (
    deserialize_proto_transaction as _deserialize_proto_transaction,
)
from wax.cpp_python_bridge import (
    deserialize_transaction as _deserialize_transaction,
)
from wax.cpp_python_bridge import (
    encode_encrypted_memo as _encode_encrypted_memo,
)
from wax.cpp_python_bridge import (
    generate_password_based_private_key as _generate_password_based_private_key,
)
from wax.cpp_python_bridge import (
    get_hive_protocol_config as _get_hive_protocol_config,
)
from wax.cpp_python_bridge import (
    get_public_key_from_signature as _get_public_key_from_signature,
)
from wax.cpp_python_bridge import (
    get_tapos_data as _get_tapos_data,
)
from wax.cpp_python_bridge import (
    get_transaction_required_authorities as _get_transaction_required_authorities,
)
from wax.cpp_python_bridge import (
    handle_deserialize_operation as _handle_deserialize_operation,
)
from wax.cpp_python_bridge import (
    handle_deserialize_transaction as _handle_deserialize_transaction,
)
from wax.cpp_python_bridge import (
    is_valid_account_name as _is_valid_account_name,
)
from wax.cpp_python_bridge import (
    legacy_tx_to_json as _legacy_tx_to_json,
)
from wax.cpp_python_bridge import (
    minimize_required_signatures as _minimize_required_signatures,
)
from wax.cpp_python_bridge import (
    operation_get_impacted_accounts as _operation_get_impacted_accounts,
)
from wax.cpp_python_bridge import (
    proto_operation_get_impacted_accounts as _proto_operation_get_impacted_accounts,
)
from wax.cpp_python_bridge import (
    proto_to_api as _proto_to_api,
)
from wax.cpp_python_bridge import (
    proto_to_legacy_api as _proto_to_legacy_api,
)
from wax.cpp_python_bridge import (
    proto_transaction_get_impacted_accounts as _proto_transaction_get_impacted_accounts,
)
from wax.cpp_python_bridge import (
    serialize_proto_transaction as _serialize_proto_transaction,
)
from wax.cpp_python_bridge import (
    serialize_transaction as _serialize_transaction,
)
from wax.cpp_python_bridge import (
    transaction_get_impacted_accounts as _transaction_get_impacted_accounts,
)
from wax.cpp_python_bridge import (
    tx_add_signature as _tx_add_signature,
)
from wax.cpp_python_bridge import (
    tx_set_expiration as _tx_set_expiration,
)
from wax.cpp_python_bridge import (
    tx_sig_digest as _tx_sig_digest,
)
from wax.cpp_python_bridge import (
    tx_signature_keys as _tx_signature_keys,
)
from wax.cpp_python_bridge import (
    validate_operation as _validate_operation,
)
from wax.cpp_python_bridge import (
    validate_proto_operation as _validate_proto_operation,
)
from wax.cpp_python_bridge import (
    validate_proto_transaction as _validate_proto_transaction,
)
from wax.cpp_python_bridge import (
    validate_transaction as _validate_transaction,
)
from wax.cpp_python_bridge import (
    has_authorization as _has_authorization,
)

if TYPE_CHECKING:
    from wax.wax_result import (
        python_authorities,
        python_encrypted_memo,
        python_minimize_required_signatures_data,
        python_operation_handle,
        python_private_key_data,
        python_ref_block_data,
        python_required_authority_collection,
        python_result,
        python_transaction_handle,
    )


def _ensure_str(value: str) -> str:
    """Convert subclasses of str to plain str for Cython 3.1.3 compatibility."""
    return str(value) if type(value) is not str else value


def _ensure_json(transaction: str | dict[str, object] | object) -> str:
    """Convert transaction to JSON string, handling str subclasses, dicts, and objects with .json()."""
    if isinstance(transaction, str):
        return str(transaction) if type(transaction) is not str else transaction
    if isinstance(transaction, dict):
        return json.dumps(transaction)
    if hasattr(transaction, "json"):
        result = transaction.json()
        return result if isinstance(result, str) else json.dumps(result)
    msg = f"Transaction must be str, dict, or object with .json() method, got {type(transaction)}"
    raise TypeError(msg)


# --- Account validation ---


def is_valid_account_name(account_name: str) -> bool:
    return _is_valid_account_name(_ensure_str(account_name))


# --- Key operations ---


def calculate_public_key(wif: str) -> python_result:
    return _calculate_public_key(_ensure_str(wif))


def convert_wif_public_key_to_raw(wif: str) -> str:
    return _convert_wif_public_key_to_raw(_ensure_str(wif))


def generate_password_based_private_key(account: str, role: str, password: str) -> python_private_key_data:
    return _generate_password_based_private_key(_ensure_str(account), _ensure_str(role), _ensure_str(password))


def get_public_key_from_signature(digest: str, signature: str) -> python_result:
    return _get_public_key_from_signature(_ensure_str(digest), _ensure_str(signature))


# --- Transaction operations ---


def validate_transaction(transaction: str) -> python_result:
    return _validate_transaction(_ensure_str(transaction))


def validate_operation(operation: str) -> python_result:
    return _validate_operation(_ensure_str(operation))


def calculate_transaction_id(transaction: str) -> python_result:
    return _calculate_transaction_id(_ensure_str(transaction))


def calculate_legacy_transaction_id(transaction: str) -> python_result:
    return _calculate_legacy_transaction_id(_ensure_str(transaction))


def serialize_transaction(transaction: str) -> python_result:
    return _serialize_transaction(_ensure_str(transaction))


def deserialize_transaction(transaction: str) -> python_result:
    return _deserialize_transaction(_ensure_str(transaction))


def get_transaction_required_authorities(transaction: str) -> python_required_authority_collection:
    return _get_transaction_required_authorities(_ensure_str(transaction))


def handle_deserialize_transaction(transaction_data: str) -> python_transaction_handle:
    return _handle_deserialize_transaction(_ensure_str(transaction_data))


def handle_deserialize_operation(operation_data: str) -> python_operation_handle:
    return _handle_deserialize_operation(_ensure_str(operation_data))


def legacy_tx_to_json(transaction_data: str) -> str:
    return _legacy_tx_to_json(_ensure_str(transaction_data))


# --- Signature digest operations ---


def calculate_sig_digest(transaction: str | dict[str, object] | object, chain_id: str) -> python_result:
    return _calculate_sig_digest(_ensure_json(transaction), _ensure_str(chain_id))


def calculate_legacy_sig_digest(transaction: str | dict[str, object] | object, chain_id: str) -> python_result:
    return _calculate_legacy_sig_digest(_ensure_json(transaction), _ensure_str(chain_id))


# --- Proto operations ---


def validate_proto_operation(operation: str) -> python_result:
    return _validate_proto_operation(_ensure_str(operation))


def validate_proto_transaction(transaction: str) -> python_result:
    return _validate_proto_transaction(_ensure_str(transaction))


def calculate_proto_transaction_id(transaction: str) -> python_result:
    return _calculate_proto_transaction_id(_ensure_str(transaction))


def calculate_proto_legacy_transaction_id(transaction: str) -> python_result:
    return _calculate_proto_legacy_transaction_id(_ensure_str(transaction))


def calculate_proto_sig_digest(transaction: str | dict[str, object] | object, chain_id: str) -> python_result:
    return _calculate_proto_sig_digest(_ensure_json(transaction), _ensure_str(chain_id))


def calculate_proto_legacy_sig_digest(transaction: str | dict[str, object] | object, chain_id: str) -> python_result:
    return _calculate_proto_legacy_sig_digest(_ensure_json(transaction), _ensure_str(chain_id))


def serialize_proto_transaction(transaction: str) -> python_result:
    return _serialize_proto_transaction(_ensure_str(transaction))


def deserialize_proto_transaction(transaction: str) -> python_result:
    return _deserialize_proto_transaction(_ensure_str(transaction))


def proto_to_api(only_tx: str) -> python_result:
    return _proto_to_api(_ensure_str(only_tx))


def proto_to_legacy_api(only_tx: str) -> python_result:
    return _proto_to_legacy_api(_ensure_str(only_tx))


def api_to_proto(only_tx: str) -> python_result:
    return _api_to_proto(_ensure_str(only_tx))


# --- TaPoS & protocol config ---


def get_tapos_data(block_id: str) -> python_ref_block_data:
    return _get_tapos_data(_ensure_str(block_id))


def get_hive_protocol_config(chain_id: str) -> dict[str, str]:
    return _get_hive_protocol_config(_ensure_str(chain_id))


# --- Transaction handle operations ---


def tx_sig_digest(tx: python_transaction_handle, chain_id: str, *, use_hf26_serialization: bool) -> str:
    return _tx_sig_digest(tx, _ensure_str(chain_id), use_hf26_serialization)


def tx_signature_keys(tx: python_transaction_handle, chain_id: str, *, use_hf26_serialization: bool) -> list[str]:
    return _tx_signature_keys(tx, _ensure_str(chain_id), use_hf26_serialization)


def tx_add_signature(tx: python_transaction_handle, signature: str) -> None:
    _tx_add_signature(tx, _ensure_str(signature))


def tx_set_expiration(tx: python_transaction_handle, expiration: str) -> None:
    _tx_set_expiration(tx, _ensure_str(expiration))


# --- Impacted accounts ---


def operation_get_impacted_accounts(operation: str) -> list[str]:
    return _operation_get_impacted_accounts(_ensure_str(operation))


def transaction_get_impacted_accounts(transaction: str) -> list[str]:
    return _transaction_get_impacted_accounts(_ensure_str(transaction))


def proto_operation_get_impacted_accounts(operation: str) -> list[str]:
    return _proto_operation_get_impacted_accounts(_ensure_str(operation))


def proto_transaction_get_impacted_accounts(transaction: str) -> list[str]:
    return _proto_transaction_get_impacted_accounts(_ensure_str(transaction))


# --- Memo & encryption ---


def encode_encrypted_memo(encrypted_content: str, main_encryption_key: str, other_encryption_key: str = "") -> str:
    return _encode_encrypted_memo(
        _ensure_str(encrypted_content),
        _ensure_str(main_encryption_key),
        _ensure_str(other_encryption_key),
    )


def decode_encrypted_memo(encoded_memo: str) -> python_encrypted_memo:
    return _decode_encrypted_memo(_ensure_str(encoded_memo))


def check_memo_for_private_keys(
    memo: str,
    account: str,
    auths: python_authorities,
    memo_key: str,
    imported_keys: list[str] | None = None,
) -> None:
    if imported_keys is None:
        imported_keys = []
    _check_memo_for_private_keys(
        _ensure_str(memo),
        _ensure_str(account),
        auths,
        _ensure_str(memo_key),
        [_ensure_str(k) for k in imported_keys],
    )


# --- Signing keys & authority ---


def collect_signing_keys(
    transaction: str, retrieve_authorities: Callable[[list[str]], dict[str, python_authorities]]
) -> list[str]:
    return _collect_signing_keys(_ensure_str(transaction), retrieve_authorities)


def minimize_required_signatures(
    signed_transaction: str,
    minimize_required_signatures_data: python_minimize_required_signatures_data,
) -> list[str]:
    return _minimize_required_signatures(_ensure_str(signed_transaction), minimize_required_signatures_data)


def has_authorization(
    required_authorities: python_required_authority_collection,
    signature_public_keys: list[str],
    authorities_map: dict[str, python_authorities],
    get_witness_key: Callable[[str], str] | None = None,
    allow_strict_and_mixed_authorities: bool = False,
    allow_redundant_signatures: bool = False,
) -> bool:
    return _has_authorization(
        required_authorities,
        [_ensure_str(k) for k in signature_public_keys],
        authorities_map,
        get_witness_key,
        allow_strict_and_mixed_authorities,
        allow_redundant_signatures,
    )
