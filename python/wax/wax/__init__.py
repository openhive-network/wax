from __future__ import annotations

import sys

# =============================================================================
# Symlink restoration (must happen before Cython imports)
# =============================================================================
# When installed from a wheel, symlinks to the main .so are not included
# (wheel builder skips symlinks). We restore them from _symlinks.json manifest.


def _restore_symlinks() -> None:
    """Restore symlinks from _symlinks.json manifest (runs once at first import)."""
    import json
    import os
    from pathlib import Path

    pkg_dir = Path(__file__).parent
    manifest = pkg_dir / "_symlinks.json"

    # Skip if no manifest (shouldn't happen, but be safe)
    if not manifest.exists():
        return

    try:
        with manifest.open() as f:
            links: dict[str, str] = json.load(f)

        for target_rel, source_rel in links.items():
            target = pkg_dir / target_rel.split("/", 1)[-1]  # Remove "wax/" prefix
            source_name = source_rel.split("/")[-1]  # Just the filename for relative symlink

            # Skip if target already exists (symlink or file)
            if target.exists() or target.is_symlink():
                continue

            try:
                os.symlink(source_name, target)
            except OSError:
                # Fall back to copy if symlinks not supported (e.g., Windows without privileges)
                import shutil

                source = pkg_dir / source_name
                if source.exists():
                    shutil.copy2(source, target)
    except (OSError, json.JSONDecodeError):
        pass  # Silently fail - will error on import if modules missing


_restore_symlinks()
del _restore_symlinks

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
from . import cython_modules_common  # type: ignore[attr-defined]  # noqa: E402

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

# Wrappers that handle subclasses of builtin types (Cython 3.1.3 compatibility)
from ._private.cython_wrappers import (  # noqa: E402
    api_to_proto,
    calculate_legacy_sig_digest,
    calculate_legacy_transaction_id,
    calculate_proto_legacy_sig_digest,
    calculate_proto_legacy_transaction_id,
    calculate_proto_sig_digest,
    calculate_proto_transaction_id,
    calculate_public_key,
    calculate_sig_digest,
    calculate_transaction_id,
    check_memo_for_private_keys,
    collect_signing_keys,
    convert_wif_public_key_to_raw,
    decode_encrypted_memo,
    deserialize_proto_transaction,
    deserialize_transaction,
    encode_encrypted_memo,
    generate_password_based_private_key,
    get_hive_protocol_config,
    get_tapos_data,
    get_transaction_required_authorities,
    handle_deserialize_operation,
    handle_deserialize_transaction,
    legacy_tx_to_json,
    minimize_required_signatures,
    operation_get_impacted_accounts,
    proto_operation_get_impacted_accounts,
    proto_to_api,
    proto_to_legacy_api,
    proto_transaction_get_impacted_accounts,
    serialize_proto_transaction,
    serialize_transaction,
    transaction_get_impacted_accounts,
    tx_add_signature,
    tx_set_expiration,
    tx_sig_digest,
    tx_signature_keys,
    validate_operation,
    validate_proto_operation,
    validate_proto_transaction,
    validate_transaction,
)

# Functions without str parameters - no wrapping needed
from .cpp_python_bridge import (  # noqa: E402
    calculate_account_hp,
    calculate_current_manabar_value,
    calculate_hbd_to_hive,
    calculate_hive_to_hbd,
    calculate_hp_apr,
    calculate_hp_to_vests,
    calculate_inflation_rate_for_block,
    calculate_manabar_full_regeneration_time,
    calculate_vests_to_hp,
    calculate_witness_votes_hp,
    cpp_throws,
    create_wax_operation,
    create_wax_transaction,
    deserialize_witness_set_properties,
    estimate_hive_collateral,
    evaluate_hbd_interest,
    general_asset,
    generate_private_key,
    hbd,
    hive,
    op_binary,
    op_impacted_accounts,
    op_required_authorities,
    op_to_binary,
    op_to_json,
    op_validate,
    serialize_witness_set_properties,
    suggest_brain_key,
    tx_add_operation,
    tx_api_to_proto,
    tx_binary,
    tx_id,
    tx_impacted_accounts,
    tx_proto_to_api,
    tx_required_authorities,
    tx_to_binary,
    tx_to_json,
    tx_to_legacy_json,
    tx_validate,
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
    "op_required_authorities",
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
