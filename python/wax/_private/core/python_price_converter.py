from __future__ import annotations

from typing import TYPE_CHECKING

from wax._private.models.asset import Asset
from wax.wax_result import python_price

if TYPE_CHECKING:
    from wax._private.models.basic import HbdExchangeRateHF26, PriceHF26


def convert_to_python_price(base_quote_structure: HbdExchangeRateHF26 | PriceHF26) -> python_price:
    return python_price(
        base=Asset.to_python_json_asset(base_quote_structure.base),
        quote=Asset.to_python_json_asset(base_quote_structure.quote),
    )
