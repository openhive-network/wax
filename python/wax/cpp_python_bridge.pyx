# -*- coding: utf-8 -*-
# distutils: language = c++
#
# Facade module - re-exports all public functions from sub-modules
# This allows backward compatibility with existing code that imports from cpp_python_bridge
#
# NOTE: Decorators (call_with_exception_relay, return_python_*, etc.) are internal
# and defined in _decorators.pxi - they are not part of the public API.

# Re-export from handles module (handle classes and creation functions)
# NOTE: Sub-modules are installed as wax/cython_modules_*.so (hard links to main .so)
# and their PyInit_* symbols are exported with default visibility.
from wax.cython_modules_handles import (
    WaxTransactionHandle,
    WaxOperationHandle,
    create_wax_transaction,
    create_wax_operation,
    handle_deserialize_transaction,
    handle_deserialize_operation,
)

# Re-export from validation module
from wax.cython_modules_validation import (
    operation_get_impacted_accounts,
    transaction_get_impacted_accounts,
    validate_operation,
    validate_transaction,
    calculate_transaction_id,
    calculate_legacy_transaction_id,
    calculate_sig_digest,
    calculate_legacy_sig_digest,
    is_valid_account_name,
    op_impacted_accounts,
    op_validate,
    tx_impacted_accounts,
    tx_validate,
    tx_id,
    tx_sig_digest,
)

# Re-export from crypto module
from wax.cython_modules_crypto import (
    generate_private_key,
    generate_password_based_private_key,
    suggest_brain_key,
    calculate_public_key,
    convert_wif_public_key_to_raw,
    get_public_key_from_signature,
)

# Re-export from assets module
from wax.cython_modules_assets import (
    general_asset,
    hive,
    hbd,
    vests,
    get_tapos_data,
    calculate_manabar_full_regeneration_time,
    calculate_current_manabar_value,
    calculate_hp_apr,
    calculate_hbd_to_hive,
    calculate_hive_to_hbd,
    calculate_vests_to_hp,
    calculate_hp_to_vests,
    calculate_account_hp,
    calculate_witness_votes_hp,
    calculate_inflation_rate_for_block,
    estimate_hive_collateral,
    evaluate_hbd_interest,
)

# Re-export from transactions module
from wax.cython_modules_transactions import (
    serialize_transaction,
    deserialize_transaction,
    legacy_tx_to_json,
    tx_add_operation,
    tx_add_signature,
    tx_set_expiration,
    tx_to_legacy_json,
    tx_to_binary,
    tx_to_json,
    tx_binary,
    tx_signature_keys,
)

# Re-export from operations module
from wax.cython_modules_operations import (
    op_to_binary,
    op_to_json,
    op_binary,
    op_required_authorities,
    tx_required_authorities,
    get_transaction_required_authorities,
)

# Re-export from proto module
from wax.cython_modules_proto import (
    proto_operation_get_impacted_accounts,
    proto_transaction_get_impacted_accounts,
    validate_proto_operation,
    validate_proto_transaction,
    calculate_proto_transaction_id,
    calculate_proto_legacy_transaction_id,
    calculate_proto_sig_digest,
    calculate_proto_legacy_sig_digest,
    serialize_proto_transaction,
    deserialize_proto_transaction,
    proto_to_api,
    proto_to_legacy_api,
    api_to_proto,
    tx_proto_to_api,
    tx_api_to_proto,
)

# Re-export from witness module
from wax.cython_modules_witness import (
    serialize_witness_set_properties,
    deserialize_witness_set_properties,
)

# Re-export from memo module
from wax.cython_modules_memo import (
    encode_encrypted_memo,
    decode_encrypted_memo,
)

# Re-export from authority module
from wax.cython_modules_authority import (
    tx_collect_signing_keys,
    collect_signing_keys,
    tx_minimize_required_signatures,
    minimize_required_signatures,
    check_memo_for_private_keys,
    get_hive_protocol_config,
)

# Re-export from testing module
from wax.cython_modules_testing import (
    verify_exception_handling,
    cpp_throws,
)

# Re-export result types from wax_result for backward compatibility
# (some code imports these from cpp_python_bridge instead of wax_result)
from wax.wax_result import (
    python_result,
    python_error_code,
    python_json_asset,
    python_ref_block_data,
    python_required_authority_collection,
    python_private_key_data,
    python_binary_data,
    python_binary_data_node,
    python_brain_key_data,
    python_witness_set_properties_data,
    python_price,
    python_authority,
    python_authorities,
    python_minimize_required_signatures_data,
    python_transaction_handle,
    python_operation_handle,
)
