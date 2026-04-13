from __future__ import annotations

import warnings

from .asset_errors import (
    AssetError,
    CannotCreateAssetError,
    InvalidAssetAmountError,
    UnknownAssetNaiError,
    UnknownAssetTypeError,
)
from .chain_errors import (
    AccountNotFoundError,
    AuthorityCannotBeSatisfiedError,
    HiveAccountCategoryError,
    HiveMaxAuthorityMembershipExceededError,
    HiveTempAccountUsedError,
    MissingAuthorityError,
)
from .conversion_errors import (
    DecimalConversionError,
    DecimalConversionNegativePrecisionError,
    DecimalConversionNotANumberError,
)
from .validation_errors import (
    InvalidAccountNameError,
    InvalidAccountOrKeyError,
    InvalidMemoKeyError,
    InvalidOperationFormatError,
    ToLongFollowingListError,
    WaxValidationFailedError,
)
from .wax_error import (
    WaxAssertionError,
    WaxChainAssertionError,
    WaxChainAssetAssertionError,
    WaxChainBalanceAssertionError,
    WaxChainHardforkAssertionError,
    WaxChainLimitAssertionError,
    WaxChainPermissionAssertionError,
    WaxChainStateAssertionError,
    WaxChainTimeAssertionError,
    WaxChainTreasuryAssertionError,
    WaxChainUnreachableCodeAssertionError,
    WaxChainVotingAssertionError,
    WaxCommunicationError,
    WaxError,
    WaxImportProtoBeforeCompileError,
    WaxProtocolAccountNameAssertionError,
    WaxProtocolAssertionError,
    WaxProtocolAssetAssertionError,
    WaxProtocolAuthorityAssertionError,
    WaxProtocolHardforkAssertionError,
    WaxProtocolNumberAssertionError,
    WaxProtocolStringAssertionError,
    WaxProtocolUnreachableCodeAssertionError,
    WaxUnhandledAssertionError,
)
from .wax_specialised_errors import CxxExceptionData

# Backward-compatible aliases — access via __getattr__ to emit DeprecationWarning.
_DEPRECATED_ALIASES: dict[str, tuple[object, str]] = {
    "WaxBaseAssertionError": (WaxAssertionError, "WaxAssertionError"),
    "DetailedCxxError": (CxxExceptionData, "CxxExceptionData"),
    "UnhandledWaxError": (WaxUnhandledAssertionError, "WaxUnhandledAssertionError"),
}


def __getattr__(name: str) -> object:
    if name in _DEPRECATED_ALIASES:
        obj, replacement = _DEPRECATED_ALIASES[name]
        warnings.warn(
            f"{name} is deprecated, use {replacement} instead",
            DeprecationWarning,
            stacklevel=2,
        )
        return obj
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


__all__ = [
    # Chain-related errors.
    "AccountNotFoundError",
    # Asset-related errors.
    "AssetError",
    "AuthorityCannotBeSatisfiedError",
    "CannotCreateAssetError",
    # C++ exception data model.
    "CxxExceptionData",
    # Conversion-related errors.
    "DecimalConversionError",
    "DecimalConversionNegativePrecisionError",
    "DecimalConversionNotANumberError",
    "DetailedCxxError",
    "HiveAccountCategoryError",
    "HiveMaxAuthorityMembershipExceededError",
    "HiveTempAccountUsedError",
    "InvalidAccountNameError",
    "InvalidAccountOrKeyError",
    "InvalidAssetAmountError",
    "InvalidMemoKeyError",
    "InvalidOperationFormatError",
    "MissingAuthorityError",
    "ToLongFollowingListError",
    "UnhandledWaxError",
    "UnknownAssetNaiError",
    "UnknownAssetTypeError",
    # C++ assertion errors — base classes.
    "WaxAssertionError",
    "WaxBaseAssertionError",
    # C++ assertion errors — chain category.
    "WaxChainAssertionError",
    "WaxChainAssetAssertionError",
    "WaxChainBalanceAssertionError",
    "WaxChainHardforkAssertionError",
    "WaxChainLimitAssertionError",
    "WaxChainPermissionAssertionError",
    "WaxChainStateAssertionError",
    "WaxChainTimeAssertionError",
    "WaxChainTreasuryAssertionError",
    "WaxChainUnreachableCodeAssertionError",
    "WaxChainVotingAssertionError",
    "WaxCommunicationError",
    # Base error for all wax errors.
    "WaxError",
    "WaxImportProtoBeforeCompileError",
    "WaxProtocolAccountNameAssertionError",
    # C++ assertion errors — protocol category.
    "WaxProtocolAssertionError",
    "WaxProtocolAssetAssertionError",
    "WaxProtocolAuthorityAssertionError",
    "WaxProtocolHardforkAssertionError",
    "WaxProtocolNumberAssertionError",
    "WaxProtocolStringAssertionError",
    "WaxProtocolUnreachableCodeAssertionError",
    "WaxUnhandledAssertionError",
    # Validation-related errors.
    "WaxValidationFailedError",
]
