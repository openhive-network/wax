from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
from enum import Enum
from typing import Protocol, TypeAlias

from wax.proto.asset import asset as proto_asset

AssetAmount: TypeAlias = int | float | Decimal
"""Type alias for an number that can be used as an amount of an asset."""
NaiAsset: TypeAlias = proto_asset
"""Type alias for an asset in nai format (hf26)."""

HiveNaiAssetConvertible: TypeAlias = NaiAsset | dict[str, str | int] | str
"""Type alias for types convertible to Hive nai format."""
HbdNaiAssetConvertible: TypeAlias = NaiAsset | dict[str, str | int] | str
"""Type alias for types convertible to Hbd nai format."""
VestsNaiAssetConvertible: TypeAlias = NaiAsset | dict[str, str | int] | str
"""Type alias for types convertible to Vests nai format."""
AnyNaiAssetConvertible: TypeAlias = HiveNaiAssetConvertible | HbdNaiAssetConvertible | VestsNaiAssetConvertible
"""Type alias for types convertible to any of the HIVE, HBD, or VESTS nai formats."""


class AssetName(Enum):
    """Enum representing the names of assets in the Hive blockchain."""

    Hive = "HIVE"
    Hbd = "HBD"
    Vests = "VESTS"


@dataclass
class AssetInfo:
    """Represents information about an asset."""

    nai: str
    precision: int


class AssetFactory(Protocol):
    @staticmethod
    def coins(amount: AssetAmount) -> NaiAsset:
        """
        Returns asset in nai/HF26 format with given amount.

        Please notice that this function works with precision!

        Args:
            amount: amount of the asset.

        Returns:
            NaiAsset: asset in nai form.

        Raises:
            DecimalConversionNotANumberError: Raised when given amount is in invalid format.
        """

    @staticmethod
    def satoshis(amount: int) -> NaiAsset:
        """
        Returns asset in nai/HF26 format with given amount.

        Please notice that this function works without precision and accept only integers!

        Args:
            amount: amount of the asset.

        Returns:
            NaiAsset: asset in nai form.

        Raises:
            TypeError: If given amount is not integer.
        """
