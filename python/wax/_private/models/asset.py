from __future__ import annotations

import json
from decimal import Decimal
from typing import TYPE_CHECKING, Protocol, TypeAlias

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
from wax.proto.asset_pb2 import asset as proto_asset

if TYPE_CHECKING:
    from wax.wax_result import python_json_asset


AssetAmount = int | float | Decimal | HiveInt
WaxAsset: TypeAlias = proto_asset

AssetHiveHF26Convertible = AssetHiveHF26 | WaxAsset | dict | str
AssetHbdHF26Convertible = AssetHbdHF26 | WaxAsset | dict | str
AssetVestsHF26Convertible = AssetVestsHF26 | WaxAsset | dict | str
AnyAssetHF26Convertible = AssetHiveHF26Convertible | AssetHbdHF26Convertible | AssetVestsHF26Convertible


class AssetFactory(Protocol):
    def coins(self, amount: AssetAmount) -> WaxAsset:
        """
        Returns asset in nai/HF26 format with given amount.

        Please notice that this function works with precision!

        Args:
            amount: amount of the asset.

        Returns:
            WaxAsset: asset in nai form.

        Raises:
            InvalidAssetAmountError: If given amount is negative.
            DecimalConversionNotANumberError: Raised when given amount is in invalid format.
        """

    def satoshis(self, amount: int) -> WaxAsset:
        """
        Returns asset in nai/HF26 format with given amount.

        Please notice that this function works without precision and accept only integers!

        Args:
            amount: amount of the asset.

        Returns:
            WaxAsset: asset in nai form.

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
    def create_wax_asset(
        asset_cls: type[Asset.AnyAssetHF26], amount: AssetAmount, *, use_precision: bool = True
    ) -> WaxAsset:
        """
        Creates an asset specified by asset_cls with given amount.

        Args:
            asset_cls: schemas class of the asset to create.
            amount: amount of the asset.
            use_precision: whether to consider precision when creating a asset.

        Returns:
            WaxAsset: asset created with the given amount.

        Raises:
            InvalidAssetAmountError: If given amount is negative.
            DecimalConversionNotANumberError: Raised when given amount is in invalid format.
        """
        if amount < 0:
            raise InvalidAssetAmountError(amount)

        asset_info = asset_cls.get_asset_information()
        precision = asset_info.precision
        nai = asset_info.nai

        if not use_precision:
            return proto_asset(amount=str(amount), precision=precision, nai=nai)

        amount_decimal = DecimalConverter.convert(amount, precision=precision)
        return proto_asset(amount=str(int(amount_decimal * 10**precision)), precision=precision, nai=nai)

    @classmethod
    def create_asset_factory(cls, asset_cls: type[Asset.AnyAssetHF26]) -> AssetFactory:
        class AssetFactoryMethods:  # type: ignore[valid-type]
            def coins(self, amount: AssetAmount) -> WaxAsset:
                return cls.create_wax_asset(asset_cls, amount)

            def satoshis(self, amount: int) -> WaxAsset:
                return cls._create_asset_satoshis(asset_cls, amount)

        return AssetFactoryMethods()

    @staticmethod
    def resolve_from_convertible_type(asset_cls: type[Asset.AnyAssetHF26], asset: AnyAssetHF26Convertible) -> WaxAsset:
        if isinstance(asset, WaxAsset):  # type: ignore[misc] # for CI to pass
            return asset

        if isinstance(asset, asset_cls):  # type: ignore[misc] # for CI to pass
            return proto_asset(
                amount=str(asset.amount),  # type: ignore[union-attr]
                precision=asset.get_asset_information().precision,  # type: ignore[union-attr]
                nai=asset.get_asset_information().nai,  # type: ignore[union-attr]
            )
        try:
            if isinstance(asset, dict):
                return proto_asset(**asset)

            assert isinstance(
                asset, str
            ), "Asset must be string now. Please check if `asset_cls` has the same type as `asset`."
            return proto_asset(**json.loads(asset))
        except Exception as error:
            raise CannotCreateAssetError(asset) from error

    @staticmethod
    def to_python_json_asset(asset_cls: type[Asset.AnyAssetHF26], asset: WaxAsset) -> python_json_asset:
        match asset_cls.get_asset_information().symbol[0]:
            case "HIVE":
                return hive(amount=int(asset.amount))
            case "HBD":
                return hbd(amount=int(asset.amount))
            case "VESTS":
                return vests(amount=int(asset.amount))
            case _:
                raise UnknownAssetTypeError(asset_cls.get_asset_information().symbol[0])

    @classmethod
    def from_python_json_asset(cls, asset: python_json_asset) -> WaxAsset:
        asset_cls = Asset.resolve_nai(to_python_string(asset.nai))
        return proto_asset(
            amount=to_python_string(asset.amount),
            precision=asset_cls.get_asset_information().precision,
            nai=asset_cls.get_asset_information().nai,
        )

    @classmethod
    def to_schemas_asset(cls, asset: WaxAsset) -> Asset.AnyAssetHF26:
        schemas_asset = cls.resolve_nai(asset.nai)
        return schemas_asset(amount=AssetNaiAmount(asset.amount))

    @classmethod
    def resolve_nai(cls, nai: str) -> type[Asset.AnyAssetHF26]:
        if nai == cls.get_nai_from_schemas_asset(cls.HiveHF26):
            return Asset.HiveHF26
        if nai == cls.get_nai_from_schemas_asset(cls.HbdHF26):
            return Asset.HbdHF26
        if nai == cls.get_nai_from_schemas_asset(cls.VestsHF26):
            return Asset.VestsHF26
        raise UnknownAssetNaiError(nai)

    @classmethod
    def get_nai_from_schemas_asset(cls, asset_cls: type[Asset.AnyAssetHF26]) -> str:
        return asset_cls.get_asset_information().nai

    @classmethod
    def _create_asset_satoshis(cls, asset_cls: type[Asset.AnyAssetHF26], amount: int) -> WaxAsset:
        """
        Creates asset with given amount, without precision.

        Raises:
            TypeError: If given amount is not integer.
            InvalidAssetAmountError: If given amount is negative.
        """
        if not isinstance(amount, int):
            raise TypeError(f"Amount must be integer, not {type(amount)}")

        return Asset.create_wax_asset(asset_cls, amount, use_precision=False)
