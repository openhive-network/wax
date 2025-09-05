from __future__ import annotations

import json
from typing import TYPE_CHECKING, Final

from wax._private.converters.decimal_converter import DecimalConverter
from wax._private.result_tools import to_python_string
from wax.cpp_python_bridge import hbd, hive, vests
from wax.exceptions.asset_errors import (
    CannotCreateAssetError,
    UnknownAssetNaiError,
    UnknownAssetTypeError,
)
from wax.models.asset import AnyNaiAssetConvertible, AssetAmount, AssetFactory, AssetInfo, AssetName, NaiAsset
from wax.proto.asset import asset as proto_asset

if TYPE_CHECKING:
    from wax.wax_result import python_json_asset


class Asset:
    def __init__(self) -> None:
        init_cpp_asset_amount: Final[int] = 0  # used to initialize cpp asset to retrieve info about asset

        self.ASSETS = {
            AssetName.Hive: hive(init_cpp_asset_amount),
            AssetName.Hbd: hbd(init_cpp_asset_amount),
            AssetName.Vests: vests(init_cpp_asset_amount),
        }

    def get_asset_info(self, asset_name: AssetName) -> AssetInfo:
        """
        Retrieves asset info from the ASSETS dictionary.

        Args:
            asset_name: name of the asset to retrieve info.

        Returns:
            AssetInfo: info about the asset (nai + precision).

        Raises:
            UnknownAssetTypeError: Raised when asset_name is not found in the ASSETS dictionary.
        """
        asset_info = self.ASSETS.get(asset_name)
        if asset_info is None:
            raise UnknownAssetTypeError(asset_name.value)

        return AssetInfo(to_python_string(asset_info.nai), asset_info.precision)

    def create_wax_asset(self, asset_name: AssetName, amount: AssetAmount, *, use_precision: bool = True) -> NaiAsset:
        """
        Creates an asset specified by asset_name.

        Args:
            asset_name: name of the asset to create.
            amount: amount of the asset.
            use_precision: whether to consider precision when creating a asset.

        Returns:
            NaiAsset: asset created with the given amount.

        Raises:
            DecimalConversionNotANumberError: Raised when given amount is in invalid format.
            UnknownAssetTypeError: Raised when asset_name is not found in the ASSETS dictionary.
        """
        asset_info = self.ASSETS.get(asset_name)
        if asset_info is None:
            raise UnknownAssetTypeError(asset_name.value)

        precision = asset_info.precision
        nai = to_python_string(asset_info.nai)

        if not use_precision:
            return proto_asset(amount=str(amount), precision=precision, nai=nai)

        amount_decimal = DecimalConverter.convert(amount, precision=precision)
        return proto_asset(amount=str(int(amount_decimal * 10**precision)), precision=precision, nai=nai)

    def create_asset_factory(self, asset_name: AssetName) -> AssetFactory:
        class AssetFactoryMethods:
            @staticmethod
            def coins(amount: AssetAmount) -> NaiAsset:
                return self.create_wax_asset(asset_name, amount)

            @staticmethod
            def satoshis(amount: int) -> NaiAsset:
                return self._create_asset_satoshis(asset_name, amount)

        return AssetFactoryMethods()

    def resolve_from_convertible_type(self, asset_name: AssetName, asset: AnyNaiAssetConvertible) -> NaiAsset:
        """
        Resolves asset from convertible type.

        Args:
            asset_name: name of the asset.
            asset: convertible asset.

        Returns:
            NaiAsset: resolved asset.

        Raises:
            UnknownAssetTypeError: Raised when asset_name is not found in the ASSETS dictionary.
            CannotCreateAssetError: Raised when asset cannot be created from the given convertible asset.
            AssertionError: Raised when nai of the asset is not the same as expected.
        """
        proper_asset = self.ASSETS.get(asset_name)
        if proper_asset is None:
            raise UnknownAssetTypeError(asset_name.value)

        if isinstance(asset, NaiAsset):  # type: ignore[misc, unused-ignore] # proto generated
            self._assert_asset_nai_valid(proper_asset, asset)
            return asset

        try:
            if isinstance(asset, dict):
                asset = proto_asset(**asset)
                self._assert_asset_nai_valid(proper_asset, asset)
                return asset

            asset = proto_asset(**json.loads(asset))
            self._assert_asset_nai_valid(proper_asset, asset)

        except Exception as error:
            raise CannotCreateAssetError(asset) from error
        else:
            return asset

    def to_python_json_asset(self, asset: NaiAsset) -> python_json_asset:
        symbol = ""

        for asset_symbol, cpp_asset in self.ASSETS.items():
            if asset.nai == to_python_string(cpp_asset.nai):
                symbol = asset_symbol.value

        match symbol:
            case "HIVE":
                return hive(amount=int(asset.amount))
            case "HBD":
                return hbd(amount=int(asset.amount))
            case "VESTS":
                return vests(amount=int(asset.amount))
            case _:
                raise UnknownAssetNaiError(asset.nai)

    def from_python_json_asset(self, asset: python_json_asset) -> NaiAsset:
        return proto_asset(
            amount=to_python_string(asset.amount),
            precision=asset.precision,
            nai=to_python_string(asset.nai),
        )

    def _create_asset_satoshis(self, asset_name: AssetName, amount: int) -> NaiAsset:
        """
        Creates asset with given amount, without precision.

        Raises:
            TypeError: If given amount is not integer.
        """
        if not isinstance(amount, int):
            raise TypeError(f"Amount must be integer, not {type(amount)}")

        return self.create_wax_asset(asset_name, amount, use_precision=False)

    def _assert_asset_nai_valid(self, valid_asset: python_json_asset, asset_to_check: NaiAsset) -> None:
        assert to_python_string(valid_asset.nai) == asset_to_check.nai, "Nai is not the same as expected."
