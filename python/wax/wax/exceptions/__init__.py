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
    WaxCommunicationError,
    WaxError,
    WaxImportProtoBeforeCompileError,
    WaxInsufficientBalanceError,
    WaxInvalidAccountNameError,
    WaxInvalidAssetError,
    WaxInvalidFeeError,
    WaxInvalidPermlinkError,
    WaxUnhandledAssertionError,
)
from .wax_specialised_errors import CxxExceptionData

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
    "UnknownAssetNaiError",
    "UnknownAssetTypeError",
    # C++ assertion errors — base and unhandled fallback.
    "WaxAssertionError",
    "WaxCommunicationError",
    # Base error for all wax errors.
    "WaxError",
    "WaxImportProtoBeforeCompileError",
    # C++ assertion errors — user-facing (named by what went wrong).
    "WaxInsufficientBalanceError",
    "WaxInvalidAccountNameError",
    "WaxInvalidAssetError",
    "WaxInvalidFeeError",
    "WaxInvalidPermlinkError",
    "WaxUnhandledAssertionError",
    # Validation-related errors.
    "WaxValidationFailedError",
]
