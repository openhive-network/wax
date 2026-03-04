from __future__ import annotations

from typing import TYPE_CHECKING, Final

import pytest

from wax._private.models.asset import Asset
from wax.models.asset import AssetName
from wax.proto.asset import asset

if TYPE_CHECKING:
    from wax.interfaces import IWaxBaseInterface

MAX_SAFE_INTEGER: Final[int] = 2**53


@pytest.mark.describe(
    "Should be able to get hive asset with double-precision floating-point format"
)
def test_generate_asset_0(wax: IWaxBaseInterface) -> None:
    assert wax.hive.coins(100.3).amount == "100300"


@pytest.mark.describe(
    "Should be able to get hive asset with Double-precision floating-point"
    "format with more decimal places than the precision"
)
def test_generate_asset_1(wax: IWaxBaseInterface) -> None:
    assert wax.hive.coins(100.34567).amount == "100345"


@pytest.mark.describe(
    "Should be able to get hbd asset with double-precision floating-point format"
)
def test_generate_asset_2(wax: IWaxBaseInterface) -> None:
    assert wax.hbd.coins(100.34567).amount == "100345"


@pytest.mark.describe(
    "Should be able to get hbd asset with Double-precision floating-point"
    "format with less decimal places than the precision"
)
def test_generate_asset_3(wax: IWaxBaseInterface) -> None:
    assert wax.hbd.coins(100.3).amount == "100300"


@pytest.mark.describe(
    "Should be able to get vests asset with double-precision floating-point format"
)
def test_generate_asset_4(wax: IWaxBaseInterface) -> None:
    assert wax.vests.coins(100).amount == "100000000"


@pytest.mark.describe(
    "Should be able to get Hive asset with double-precision"
    "floating-point format with more decimal places than the precision"
)
def test_generate_asset_5(wax: IWaxBaseInterface) -> None:
    assert wax.hive.coins(100.345678910).amount == "100345"


@pytest.mark.describe(
    "Should be able to get vests asset with double-precision floating-point"
    "format with less decimal places than the precision"
)
def test_generate_asset_6(wax: IWaxBaseInterface) -> None:
    assert wax.vests.coins(100.3).amount == "100300000"


@pytest.mark.describe(
    "Should be able to get vests asset with double-precision floating-point"
    "format near max safe integer (with fractional part)"
)
def test_generate_asset_7(wax: IWaxBaseInterface) -> None:
    assert wax.vests.coins(9007199254740.543).amount == "9007199254740543000"


@pytest.mark.describe("Should be able to get hive asset with large number value")
def test_generate_asset_8(wax: IWaxBaseInterface) -> None:
    assert wax.hive.satoshis(MAX_SAFE_INTEGER).amount == "9007199254740992"


@pytest.mark.describe("Should be able to get hbd asset with large number value")
def test_generate_asset_9(wax: IWaxBaseInterface) -> None:
    assert wax.hbd.satoshis(MAX_SAFE_INTEGER).amount == "9007199254740992"


@pytest.mark.describe("Should be able to get vests asset with large number value")
def test_generate_asset_10(wax: IWaxBaseInterface) -> None:
    assert wax.vests.satoshis(MAX_SAFE_INTEGER).amount == "9007199254740992"


@pytest.mark.describe(
    "Should be able to generate HBD, HIVE and VESTS assets - coins and satoshis"
)
@pytest.mark.parametrize("asset_type", ["hbd", "hive", "vests"])
@pytest.mark.parametrize("monetary_units", ["coins", "satoshis"])
@pytest.mark.parametrize(
    "amount",
    [-1_234_567_890, -1_000_000, -100_000, -1, 0, 1, 100_000, 1_000_000, 1_234_567_890],
)
def test_generate_asset_11(
    wax: IWaxBaseInterface, asset_type: str, monetary_units: str, amount: int
) -> None:
    result = getattr(getattr(wax, asset_type), monetary_units)(amount)

    asset_info = Asset().get_asset_info(getattr(AssetName, asset_type.capitalize()))

    if amount == 0:
        assert result.amount == str(0)
    else:
        assert (
            result.amount == f"{amount}{'0' * asset_info.precision}"
            if monetary_units == "coins"
            else f"{amount}"
        )
    assert result.precision == asset_info.precision
    assert result.nai == asset_info.nai


@pytest.mark.skip(reason="getAsset() not implemented")
@pytest.mark.describe(
    "Should be able to convert API asset to the proper negative HIVE asset data"
)
def test_generate_asset_12(wax: IWaxBaseInterface) -> None: ...


@pytest.mark.describe(
    "Should be able to convert API asset to the proper custom asset data"
)
def test_generate_asset_13() -> None:
    custom_asset = asset(amount="300", precision=1, nai="@@002137000")

    assert custom_asset.amount == "300"
    assert custom_asset.precision == 1
    assert custom_asset.nai == "@@002137000"
