from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
from enum import Enum
from typing import Protocol, TypeAlias

from wax.proto.asset_pb2 import asset as proto_asset

AssetAmount = int | float | Decimal
NaiAsset: TypeAlias = proto_asset

HiveNaiAssetConvertible = NaiAsset | dict | str
HbdNaiAssetConvertible = NaiAsset | dict | str
VestsNaiAssetConvertible = NaiAsset | dict | str
AnyNaiAssetConvertible = HiveNaiAssetConvertible | HbdNaiAssetConvertible | VestsNaiAssetConvertible


class AssetName(Enum):
    Hive: str = "HIVE"
    Hbd: str = "HBD"
    Vests: str = "VESTS"


@dataclass
class AssetInfo:
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
