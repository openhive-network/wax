from __future__ import annotations

from typing import TYPE_CHECKING

from wax._private.models.asset import Asset
from wax.models.asset import AssetName
from wax.wax_result import python_price

if TYPE_CHECKING:
    from wax.models.asset import HbdNaiAssetConvertible, HiveNaiAssetConvertible


def convert_to_python_price(base: HbdNaiAssetConvertible, quote: HiveNaiAssetConvertible) -> python_price:
    asset_handler = Asset()

    base = asset_handler.resolve_from_convertible_type(AssetName.Hbd, base)
    quote = asset_handler.resolve_from_convertible_type(AssetName.Hive, quote)

    return python_price(
        base=asset_handler.to_python_json_asset(base),
        quote=asset_handler.to_python_json_asset(quote),
    )
