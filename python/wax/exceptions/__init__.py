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
    WaxError,
    WaxImportProtoBeforeCompileError,
)
from .wax_specialised_errors import (
    AbstractCxxError,
    CategoryNotFoundError,
    SubcategoryNotFoundError,
    UnhandableWaxError,
    WaxBaseAssertionError,
    WaxChainAssertionError,
    WaxProtocolAssertionError,
)

__all__ = [
    # Base error for all wax errors.
    "WaxError",
    "WaxImportProtoBeforeCompileError",
    "WaxAssertionError",
    # Asset-related errors.
    "AssetError",
    "InvalidAssetAmountError",
    "UnknownAssetTypeError",
    "UnknownAssetNaiError",
    "CannotCreateAssetError",
    # Conversion-related errors.
    "DecimalConversionError",
    "DecimalConversionNotANumberError",
    "DecimalConversionNegativePrecisionError",
    # Validation-related errors.
    "WaxValidationFailedError",
    "InvalidAccountNameError",
    "InvalidAccountOrKeyError",
    "InvalidOperationFormatError",
    "InvalidMemoKeyError",
    "ToLongFollowingListError",
    # Chain-related errors.
    "AccountNotFoundError",
    "HiveAccountCategoryError",
    "HiveTempAccountUsedError",
    "HiveMaxAuthorityMembershipExceededError",
    "AuthorityCannotBeSatisfiedError",
    "MissingAuthorityError",
    # Specialised wax errors.
    "CategoryNotFoundError",
    "SubcategoryNotFoundError",
    "AbstractCxxError",
    "UnhandableWaxError",
    "WaxBaseAssertionError",
    "WaxChainAssertionError",
    "WaxProtocolAssertionError",
]
