from __future__ import annotations

from typing import TYPE_CHECKING

from wax._private.models.asset import Asset
from wax.wax_result import python_price

if TYPE_CHECKING:
    from wax._private.models.basic import HbdExchangeRateHF26, PriceHF26


def convert_to_python_price(base_quote_structure: HbdExchangeRateHF26 | PriceHF26) -> python_price:
    base_asset_type = Asset.resolve_nai(base_quote_structure.base.get_asset_information().nai)
    base = Asset.resolve_from_convertible_type(base_asset_type, base_quote_structure.base)

    quote_asset_type = Asset.resolve_nai(base_quote_structure.quote.get_asset_information().nai)
    quote = Asset.resolve_from_convertible_type(quote_asset_type, base_quote_structure.quote)

    return python_price(
        base=Asset.to_python_json_asset(base_asset_type, base),
        quote=Asset.to_python_json_asset(quote_asset_type, quote),
    )
