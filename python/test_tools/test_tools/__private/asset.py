"""
Assets of test_tools (`tt.Asset`) - created as the public `Asset` of hiveio-api.

`tt.Asset.Test(10)` is 10.000 TESTS, `tt.Asset.Vest(1)` 1.000000 VESTS, ... Assets of the testnet (`tt.Asset.Test`,
`tt.Asset.Tbd`) are displayed with symbols of the testnet. `tt.Asset.TestT`, `tt.Asset.TbdT`, ... annotate assets - their
kinds are told by `asset.is_hive()`, `asset.is_hbd()` and `asset.is_vests()`. The factories give the information about
their kind (`AssetInfo` of schemas): `tt.Asset.Test.token()` is displayed as `TESTS`.
"""

from __future__ import annotations

import warnings
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from typing import TYPE_CHECKING, ClassVar, TypeAlias

from schemas.fields.public import Asset as PublicAsset
from schemas.fields.public import AssetFactory as PublicAssetFactory

if TYPE_CHECKING:
    from collections.abc import Mapping

    from schemas.fields.public import AssetInfo, AssetKind

AssetAmountT = int | float | str


@dataclass(frozen=True)
class AssetFactory(PublicAssetFactory):
    """
    Creates assets of test_tools of a kind from amounts in tokens (`tt.Asset.Test(10)`) and gives the kind (`token`).

    The information about the kind is displayed with the symbol of the network of the factory (`TESTS` of
    `tt.Asset.Test.token()`), so the factory stands for its kind (e.g. a parameter of a test creating assets and naming
    them).
    """

    testnet: bool
    name: str
    """Name of the factory in `tt.Asset` (`Test`)."""

    def __call__(self, amount: AssetAmountT) -> PublicAsset:
        """The asset of the amount in tokens - rounded to the precision of the kind (with a warning), as before."""
        info = self.kind.info
        try:
            tokens = Decimal(repr(amount) if isinstance(amount, float) else amount)
        except InvalidOperation as error:
            raise ValueError(f"Invalid asset amount format: '{amount}'. Should be a number.") from error
        rounded = tokens.quantize(Decimal(1).scaleb(-info.precision))
        if rounded != tokens:
            warnings.warn(
                f"Precision lost during value creation - {tokens} was rounded to {rounded} (precision of {info}).",
                stacklevel=2,
            )
        return self.kind.tokens(rounded, testnet=self.testnet)

    def token(self, testnet: bool | None = None) -> AssetInfo:
        """Information about the kind - shown with the symbol of the network of the factory by default (`TESTS`)."""
        return self.kind.token(self.testnet if testnet is None else testnet)

    def __repr__(self) -> str:
        return f"tt.Asset.{self.name}"


class Asset:
    """Creates assets of test_tools (the public `Asset`, see the module)."""

    HiveT: TypeAlias = PublicAsset
    TestT: TypeAlias = PublicAsset
    HbdT: TypeAlias = PublicAsset
    TbdT: TypeAlias = PublicAsset
    VestsT: TypeAlias = PublicAsset
    VestT: TypeAlias = PublicAsset
    AnyT: TypeAlias = PublicAsset

    Hive: ClassVar[AssetFactory] = AssetFactory(PublicAsset.hive, testnet=False, name="Hive")
    """Creates assets of the amount (in tokens) of HIVE."""
    Test: ClassVar[AssetFactory] = AssetFactory(PublicAsset.hive, testnet=True, name="Test")
    """Creates assets of the amount (in tokens) of HIVE of the testnet (`TESTS`)."""
    Hbd: ClassVar[AssetFactory] = AssetFactory(PublicAsset.hbd, testnet=False, name="Hbd")
    """Creates assets of the amount (in tokens) of HBD."""
    Tbd: ClassVar[AssetFactory] = AssetFactory(PublicAsset.hbd, testnet=True, name="Tbd")
    """Creates assets of the amount (in tokens) of HBD of the testnet (`TBD`)."""
    Vest: ClassVar[AssetFactory] = AssetFactory(PublicAsset.vests, testnet=False, name="Vest")
    """Creates assets of the amount (in tokens) of VESTS."""

    @classmethod
    def is_same(
        cls, first: PublicAsset | str | Mapping[str, object], second: PublicAsset | str | Mapping[str, object]
    ) -> bool:
        """Whether the assets (also in their legacy or NAI forms) are of the same kind and amount."""
        return PublicAsset.from_asset_like(first) == PublicAsset.from_asset_like(second)

    @classmethod
    def from_legacy(cls, value: str) -> PublicAsset:
        """The asset of the legacy form (`"10.000 TESTS"`), in the NAI form - of the network of its symbol."""
        asset = PublicAsset.from_str(value)
        return _kind_of(asset).satoshi(asset.amount, testnet=asset.token().testnet)

    @classmethod
    def from_nai(cls, value: Mapping[str, object] | PublicAsset, *, testnet: bool = True) -> PublicAsset:
        """The asset of the NAI form (also any public asset) - of the testnet by default."""
        asset = PublicAsset.from_asset_like(value)
        if asset is None:
            raise ValueError(f"`{value!r}` is not an asset of the NAI form")
        return _kind_of(asset).satoshi(asset.amount, testnet=testnet)

    class Range:
        """
        Represents a range of assets by providing the upper and lower bounds for a given value.

        It functions similarly to the built-in python `range(100, 110)` function, providing a convenient way to
        represent a range of assets within a specified value range.

        Usage:
            Asset.Range(lower_limit=Asset.Test(100), upper_limit=Asset.Test(110))

        Args:
            lower_limit: If tolerance is given it acts as the value to which we refer specifying the percentage range.
            tolerance: is defined as a positive number, which is a percentage of the upper and lower deviations e.g:

        ```
        asset = Asset.Test(100)
        Asset.Range(asset, tolerance=10) -> the range of this asset is from Asset.Test(90) to inclusive (110)
        ```

        Upper limit and tolerance should be used interchangeably.

        Raises:
            TypeError: When the limits are not assets of the same kind (by comparisons of the public `Asset`).

        """

        def __init__(
            self,
            lower_limit: PublicAsset,
            upper_limit: PublicAsset | None = None,
            *,
            tolerance: float | None = None,
        ) -> None:
            if not upper_limit and not tolerance:
                raise TypeError("Range has to be specified with either `upper_limit` or `tolerance`")

            if upper_limit and tolerance:
                raise TypeError("Please choose only one option from `upper_limit` or `tolerance`")

            if tolerance and tolerance < 0:
                raise TypeError("`tolerance` should be given as an positive number")

            if upper_limit is None:
                assert tolerance is not None
                deviation = _kind_of(lower_limit).satoshi(int(lower_limit.amount * tolerance / 100))
                self.__lower_limit, self.__upper_limit = lower_limit - deviation, lower_limit + deviation
            else:
                self.__lower_limit, self.__upper_limit = lower_limit, upper_limit
            assert self.__lower_limit < self.__upper_limit, "The upper limit cannot be greater than the lower limit"

        def __contains__(self, item: PublicAsset) -> bool:
            return self.__lower_limit <= item <= self.__upper_limit


def _kind_of(asset: PublicAsset) -> AssetKind:
    """The kind of the asset (HIVE, HBD or VESTS) - by the information about its kind."""
    return PublicAsset.kind_of(asset.token())
