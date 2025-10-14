from __future__ import annotations

from typing import TYPE_CHECKING, Any

from wax.exceptions.wax_error import WaxError

if TYPE_CHECKING:
    from wax.models.asset import AssetName, NaiAsset


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


class UnexpectedAssetTypeError(AssetError):
    def __init__(self, asset: NaiAsset, expected: AssetName | list[AssetName]) -> None:
        self.asset = asset
        self.expected = expected
        self.message = f"Unexpected asset: {asset}, expected: {expected}"
        super().__init__(self.message)
