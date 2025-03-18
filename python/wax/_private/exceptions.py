from __future__ import annotations

from typing import Any


class WaxError(Exception):
    """Base exception for all wax operations."""


class WaxImportProtoBeforeCompileError(WaxError):
    """Raised when trying to import a proto file before compiling it."""

    def __init__(self) -> None:
        self.message = (
            "You must compile the proto file before importing it."
            "Please use `compile_proto.sh` or `build_wax.sh` script."
        )
        super().__init__(self.message)


class WaxValidationFailedError(WaxError):
    """Raises when validation using wax failed."""

    def __init__(self, reason: str) -> None:
        self.reason = reason
        self.message = f"Validation using wax failed due to: {reason}"
        super().__init__(self.message)


# Asset-related exceptions


class AssetError(WaxError):
    """
    Base error for the asset-related exceptions.

    For more detailed exceptions, see the subclasses.
    """


class InvalidAssetAmountError(AssetError):
    def __init__(self, amount: Any) -> None:  # noqa: ANN401
        self.amount = amount
        self.message = f"Cannot create asset with the invalid amount: {amount}"
        super().__init__(self.message)


class UnknownAssetTypeError(AssetError):
    def __init__(self, symbol: str) -> None:
        self.symbol = symbol
        self.message = f"Unknown asset type: {symbol}"
        super().__init__(self.message)


class UnknownAssetNaiError(AssetError):
    def __init__(self, nai: str) -> None:
        self.nai = nai
        self.message = f"Unknown asset with nai: {nai}"
        super().__init__(self.message)


class CannotCreateAssetError(AssetError):
    def __init__(self, potential_asset: Any) -> None:  # noqa: ANN401
        self.potential_asset = potential_asset
        self.message = f"Cannot create asset from {potential_asset}."
        super().__init__(self.message)


# Decimal-conversions-related exceptions


class DecimalConversionError(WaxError):
    """Base exception for all decimal conversion errors."""


class DecimalConversionNotANumberError(DecimalConversionError):
    """Raised when decimal conversion fails because the value is not a number."""


class DecimalConversionNegativePrecisionError(DecimalConversionError):
    """Raised when decimal conversion fails because the precision is negative."""

    def __init__(self, precision: int) -> None:
        self.precision = precision
        self.message = f"Precision must be a positive integer. Given: {precision}"
        super().__init__(self.message)


# Operation-related exceptions


class OperationError(WaxError):
    """
    Base error for all operation-related errors.

    For more detailed exceptions, see the subclasses.
    """


class InvalidOperationFormatError(OperationError):
    """Raised when operation is in invalid format."""
