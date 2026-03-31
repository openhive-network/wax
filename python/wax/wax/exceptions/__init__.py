from __future__ import annotations

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

# Backward-compatible aliases
WaxBaseAssertionError = WaxAssertionError
DetailedCxxError = CxxExceptionData
UnhandledWaxError = WaxUnhandledAssertionError

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
