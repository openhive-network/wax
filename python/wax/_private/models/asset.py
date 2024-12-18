from __future__ import annotations

import json
from abc import ABC, abstractmethod
from decimal import Decimal
from typing import TYPE_CHECKING, Generic, TypeAlias, TypeVar

from pydantic import ValidationError

from schemas.fields.assets import AssetHbdHF26, AssetHiveHF26, AssetVestsHF26
from schemas.fields.assets._base import AssetNaiAmount
from schemas.fields.compound import HiveInt
from wax._private.core.decimal_converter import DecimalConverter
from wax._private.core.encoders import to_python_string
from wax._private.exceptions import (
    CannotCreateAssetError,
    InvalidAssetAmountError,
    UnknownAssetNaiError,
    UnknownAssetTypeError,
)
from wax.cpp_python_bridge import hbd, hive, vests

if TYPE_CHECKING:
    from wax.wax_result import python_json_asset


AssetAmount = int | float | Decimal | HiveInt
AssetExplicitT = TypeVar("AssetExplicitT", AssetHiveHF26, AssetHbdHF26, AssetVestsHF26)

AssetHiveHF26Convertible = AssetHiveHF26 | dict | str
AssetHbdHF26Convertible = AssetHbdHF26 | dict | str
AssetVestsHF26Convertible = AssetVestsHF26 | dict | str
AnyAssetHF26Convertible = AssetHiveHF26Convertible | AssetHbdHF26Convertible | AssetVestsHF26Convertible


class AssetFactory(ABC, Generic[AssetExplicitT]):
    @abstractmethod
    def coins(self, amount: AssetAmount) -> AssetExplicitT:
        """
        Returns asset in nai/HF26 format with given amount.

        Please notice that this function works with precision!

        Args:
            amount: amount of the asset.

        Returns:
            AssetExplicitT: asset in nai form.

        Raises:
            InvalidAssetAmountError: If given amount is negative.
            DecimalConversionNotANumberError: Raised when given amount is in invalid format.
        """

    @abstractmethod
    def satoshis(self, amount: int) -> AssetExplicitT:
        """
        Returns asset in nai/HF26 format with given amount.

        Please notice that this function works without precision and accept only integers!

        Args:
            amount: amount of the asset.

        Returns:
            AssetExplicitT: asset in nai form.

        Raises:
            InvalidAssetAmountError: If given amount is negative.
            TypeError: If given amount is not integer.
        """


class Asset:
    HiveHF26: TypeAlias = AssetHiveHF26
    HbdHF26: TypeAlias = AssetHbdHF26
    VestsHF26: TypeAlias = AssetVestsHF26
    AnyAssetHF26: TypeAlias = HiveHF26 | HbdHF26 | VestsHF26

    @staticmethod
    def create(asset_cls: type[AssetExplicitT], amount: AssetAmount, *, use_precision: bool = True) -> AssetExplicitT:
        """
        Creates an asset specified by asset_cls with given amount.

        Args:
            asset_cls: class of the asset to create.
            amount: amount of the asset.
            use_precision: whether to consider precision when creating a asset.

        Returns:
            AssetExplicitT: specified with the `asset_cls` created with the given amount.

        Raises:
            InvalidAssetAmountError: If given amount is negative.
            DecimalConversionNotANumberError: Raised when given amount is in invalid format.
        """
        if amount < 0:
            raise InvalidAssetAmountError(amount)

        if not use_precision:
            return asset_cls(amount=AssetNaiAmount(amount))

        precision = asset_cls.get_asset_information().precision
        amount_decimal = DecimalConverter.convert(amount, precision=precision)
        return asset_cls(amount=AssetNaiAmount(amount_decimal * 10**precision))

    @classmethod
    def create_asset_factory(cls, asset_cls: type[AssetExplicitT]) -> AssetFactory[AssetExplicitT]:
        class AssetFactoryMethods(AssetFactory[asset_cls]):  # type: ignore[valid-type]
            def coins(self, amount: AssetAmount) -> AssetExplicitT:
                return cls.create(asset_cls, amount)

            def satoshis(self, amount: int) -> AssetExplicitT:
                return cls._create_asset_satoshis(asset_cls, amount)

        return AssetFactoryMethods()

    @staticmethod
    def resolve_from_convertible_type(
        asset_cls: type[AssetExplicitT], asset: AnyAssetHF26Convertible
    ) -> AssetExplicitT:
        if isinstance(asset, asset_cls):
            return asset
        try:
            if isinstance(asset, dict):
                return asset_cls(**asset)

            assert isinstance(
                asset, str
            ), "Asset must be string now. Please check if `asset_cls` has the same type as `asset`."
            return asset_cls(**json.loads(asset))
        except ValidationError as error:
            raise CannotCreateAssetError(asset) from error

    @staticmethod
    def to_python_json_asset(asset: AnyAssetHF26) -> python_json_asset:
        match asset.get_asset_information().symbol[0]:
            case "HIVE":
                return hive(amount=int(asset.amount))
            case "HBD":
                return hbd(amount=int(asset.amount))
            case "VESTS":
                return vests(amount=int(asset.amount))
            case _:
                raise UnknownAssetTypeError(asset.get_asset_information().symbol[0])

    @classmethod
    def from_python_json_asset(cls, asset: python_json_asset) -> AnyAssetHF26:
        asset_cls = Asset.resolve_nai(to_python_string(asset.nai))
        return asset_cls(amount=AssetNaiAmount(to_python_string(asset.amount)))

    @classmethod
    def resolve_nai(cls, nai: str) -> type[AnyAssetHF26]:
        if nai == cls.get_nai(cls.HiveHF26):
            return Asset.HiveHF26
        if nai == cls.get_nai(cls.HbdHF26):
            return Asset.HbdHF26
        if nai == cls.get_nai(cls.VestsHF26):
            return Asset.VestsHF26
        raise UnknownAssetNaiError(nai)

    @classmethod
    def get_nai(cls, asset_cls: type[AnyAssetHF26]) -> str:
        return asset_cls.get_asset_information().nai

    @classmethod
    def _create_asset_satoshis(cls, asset_cls: type[AssetExplicitT], amount: int) -> AssetExplicitT:
        """
        Creates specified asset (by asset_cls) with given amount, without precision.

        Raises:
            TypeError: If given amount is not integer.
            InvalidAssetAmountError: If given amount is negative.
        """
        if not isinstance(amount, int):
            raise TypeError(f"Amount must be integer, not {type(amount)}")

        return Asset.create(asset_cls, amount, use_precision=False)
