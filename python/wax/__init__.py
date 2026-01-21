from __future__ import annotations

import sys

# =============================================================================
# Cython sub-module aliasing (must happen before other imports)
# =============================================================================
# The wax package compiles multiple Cython sub-modules into a single .so file.
# Sub-modules use cimport statements that generate PyImport_ImportModule() calls
# with short names (e.g., "cython_modules_common") instead of full package paths.
#
# We import sub-modules in dependency order and register them under short names
# in sys.modules BEFORE importing dependent modules. This ensures that
# cimport-generated PyImport_ImportModule() calls can find them.
#
# Dependency order:
# 1. cython_modules_common - base module, no dependencies on other cython_modules
# 2. cython_modules_handles - depends on common
# 3. cython_modules_validation - depends on common, handles
# 4. cython_modules_transactions - depends on common, handles
# 5. cpp_python_bridge - facade, imports from all sub-modules
#
# NOTE: Each module must be registered in sys.modules immediately after import,
# before importing the next module that depends on it. This interleaved pattern
# is required and cannot be reorganized.
# =============================================================================
from . import cython_modules_common  # type: ignore[attr-defined]

sys.modules["cython_modules_common"] = cython_modules_common

from . import cython_modules_handles  # type: ignore[attr-defined]  # noqa: E402

sys.modules["cython_modules_handles"] = cython_modules_handles

from . import cython_modules_validation  # type: ignore[attr-defined]  # noqa: E402

sys.modules["cython_modules_validation"] = cython_modules_validation

from . import cython_modules_transactions  # type: ignore[attr-defined]  # noqa: E402

sys.modules["cython_modules_transactions"] = cython_modules_transactions

# =============================================================================
# Public API imports
# =============================================================================

from .cpp_python_bridge import (  # noqa: E402
    api_to_proto,
    calculate_account_hp,
    calculate_current_manabar_value,
    calculate_hbd_to_hive,
    calculate_hive_to_hbd,
    calculate_hp_apr,
    calculate_hp_to_vests,
    calculate_inflation_rate_for_block,
    calculate_legacy_sig_digest,
    calculate_legacy_transaction_id,
    calculate_manabar_full_regeneration_time,
    calculate_proto_legacy_sig_digest,
    calculate_proto_legacy_transaction_id,
    calculate_proto_sig_digest,
    calculate_proto_transaction_id,
    calculate_public_key,
    calculate_sig_digest,
    calculate_transaction_id,
    calculate_vests_to_hp,
    calculate_witness_votes_hp,
    check_memo_for_private_keys,
    collect_signing_keys,
    convert_wif_public_key_to_raw,
    cpp_throws,
    create_wax_operation,
    create_wax_transaction,
    decode_encrypted_memo,
    deserialize_proto_transaction,
    deserialize_transaction,
    deserialize_witness_set_properties,
    encode_encrypted_memo,
    estimate_hive_collateral,
    evaluate_hbd_interest,
    general_asset,
    generate_password_based_private_key,
    generate_private_key,
    get_hive_protocol_config,
    get_tapos_data,
    get_transaction_required_authorities,
    handle_deserialize_operation,
    handle_deserialize_transaction,
    hbd,
    hive,
    legacy_tx_to_json,
    minimize_required_signatures,
    op_binary,
    op_impacted_accounts,
    op_to_binary,
    op_to_json,
    op_validate,
    operation_get_impacted_accounts,
    proto_operation_get_impacted_accounts,
    proto_to_api,
    proto_to_legacy_api,
    proto_transaction_get_impacted_accounts,
    serialize_proto_transaction,
    serialize_transaction,
    serialize_witness_set_properties,
    suggest_brain_key,
    transaction_get_impacted_accounts,
    tx_add_operation,
    tx_add_signature,
    tx_api_to_proto,
    tx_binary,
    tx_id,
    tx_impacted_accounts,
    tx_proto_to_api,
    tx_required_authorities,
    tx_set_expiration,
    tx_sig_digest,
    tx_signature_keys,
    tx_to_binary,
    tx_to_json,
    tx_to_legacy_json,
    tx_validate,
    validate_operation,
    validate_proto_operation,
    validate_proto_transaction,
    validate_transaction,
    verify_exception_handling,
    vests,
)
from .interfaces import (  # noqa: E402
    IHiveChainInterface,
    IOnlineTransaction,
    ITransaction,
    IWaxBaseInterface,
)
from .wax_factory import create_hive_chain, create_wax_foundation  # noqa: E402
from .wax_options import WaxChainOptions, WaxOptions  # noqa: E402
from .wax_result import (  # noqa: E402
    python_authorities,
    python_authority,
    python_binary_data,
    python_binary_data_node,
    python_brain_key_data,
    python_error_code,
    python_json_asset,
    python_minimize_required_signatures_data,
    python_operation_handle,
    python_price,
    python_private_key_data,
    python_ref_block_data,
    python_required_authority_collection,
    python_result,
    python_transaction_handle,
    python_witness_set_properties_data,
)

__version__ = "0.0.0"

__all__ = [
    "IHiveChainInterface",
    "IOnlineTransaction",
    "ITransaction",
    # Public API
    "IWaxBaseInterface",
    "WaxChainOptions",
    "WaxOptions",
    "api_to_proto",
    "calculate_account_hp",
    "calculate_current_manabar_value",
    "calculate_hbd_to_hive",
    "calculate_hive_to_hbd",
    "calculate_hp_apr",
    "calculate_hp_to_vests",
    "calculate_inflation_rate_for_block",
    "calculate_legacy_sig_digest",
    "calculate_legacy_transaction_id",
    "calculate_manabar_full_regeneration_time",
    "calculate_proto_legacy_sig_digest",
    "calculate_proto_legacy_transaction_id",
    "calculate_proto_sig_digest",
    "calculate_proto_transaction_id",
    "calculate_public_key",
    "calculate_sig_digest",
    "calculate_transaction_id",
    "calculate_vests_to_hp",
    "calculate_witness_votes_hp",
    "check_memo_for_private_keys",
    "collect_signing_keys",
    "convert_wif_public_key_to_raw",
    "cpp_throws",
    "create_hive_chain",
    "create_wax_foundation",
    "create_wax_operation",
    "create_wax_transaction",
    # Cython sub-modules (for internal use)
    "cython_modules_common",
    "cython_modules_handles",
    "cython_modules_transactions",
    "cython_modules_validation",
    "decode_encrypted_memo",
    "deserialize_proto_transaction",
    "deserialize_transaction",
    "deserialize_witness_set_properties",
    "encode_encrypted_memo",
    "estimate_hive_collateral",
    "evaluate_hbd_interest",
    "general_asset",
    "generate_password_based_private_key",
    "generate_private_key",
    "get_hive_protocol_config",
    "get_tapos_data",
    "get_transaction_required_authorities",
    "handle_deserialize_operation",
    "handle_deserialize_transaction",
    "hbd",
    "hive",
    "legacy_tx_to_json",
    "minimize_required_signatures",
    "op_binary",
    "op_impacted_accounts",
    "op_to_binary",
    "op_to_json",
    "op_validate",
    "operation_get_impacted_accounts",
    "proto_operation_get_impacted_accounts",
    "proto_to_api",
    "proto_to_legacy_api",
    "proto_transaction_get_impacted_accounts",
    "python_authorities",
    "python_authority",
    "python_binary_data",
    "python_binary_data_node",
    "python_brain_key_data",
    "python_error_code",
    "python_json_asset",
    "python_minimize_required_signatures_data",
    "python_operation_handle",
    "python_price",
    "python_private_key_data",
    "python_ref_block_data",
    "python_required_authority_collection",
    "python_result",
    "python_transaction_handle",
    "python_witness_set_properties_data",
    "serialize_proto_transaction",
    "serialize_transaction",
    "serialize_witness_set_properties",
    "suggest_brain_key",
    "transaction_get_impacted_accounts",
    "tx_add_operation",
    "tx_add_signature",
    "tx_api_to_proto",
    "tx_binary",
    "tx_id",
    "tx_impacted_accounts",
    "tx_proto_to_api",
    "tx_required_authorities",
    "tx_set_expiration",
    "tx_sig_digest",
    "tx_signature_keys",
    "tx_to_binary",
    "tx_to_json",
    "tx_to_legacy_json",
    "tx_validate",
    "validate_operation",
    "validate_proto_operation",
    "validate_proto_transaction",
    "validate_transaction",
    "verify_exception_handling",
    "vests",
]
