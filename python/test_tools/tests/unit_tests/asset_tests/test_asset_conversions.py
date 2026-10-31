from __future__ import annotations

import pytest

import test_tools as tt

NAI_OF_10_HIVE = {"amount": "10000", "precision": 3, "nai": "@@000000021"}


@pytest.mark.parametrize(
    ("first", "second"),
    [
        (tt.Asset.Test(10), "10.000 TESTS"),
        ("10.000 TESTS", NAI_OF_10_HIVE),
        (tt.Asset.Test(10), NAI_OF_10_HIVE),
    ],
)
def test_assets_of_the_same_kind_and_amount_are_the_same_in_any_form(
    first: tt.Asset.AnyT | str | dict[str, object], second: tt.Asset.AnyT | str | dict[str, object]
) -> None:
    # ACT & ASSERT
    assert tt.Asset.is_same(first, second)


@pytest.mark.parametrize(
    "other",
    [tt.Asset.Test(10.001), tt.Asset.Tbd(10), "10.000000 VESTS"],
)
def test_assets_of_other_amounts_or_kinds_are_not_the_same(other: tt.Asset.AnyT | str) -> None:
    # ACT & ASSERT
    assert not tt.Asset.is_same(NAI_OF_10_HIVE, other)


@pytest.mark.parametrize(
    ("legacy", "expected"),
    [
        ("10.000 TESTS", tt.Asset.Test(10)),
        ("10.000 HBD", tt.Asset.Hbd(10)),
        ("1.000000 VESTS", tt.Asset.Vest(1)),
    ],
)
def test_asset_from_legacy_form_is_of_the_network_of_its_symbol(legacy: str, expected: tt.Asset.AnyT) -> None:
    # ACT
    asset = tt.Asset.from_legacy(legacy)

    # ASSERT
    assert asset == expected
    assert asset.token() == expected.token()
    assert str(asset) == legacy


@pytest.mark.parametrize(("testnet", "legacy"), [(True, "10.000 TESTS"), (False, "10.000 HIVE")])
def test_asset_from_nai_form_is_of_the_given_network(*, testnet: bool, legacy: str) -> None:
    # ACT
    asset = tt.Asset.from_nai(NAI_OF_10_HIVE, testnet=testnet)

    # ASSERT
    assert str(asset) == legacy


def test_asset_from_nai_form_is_of_the_testnet_by_default() -> None:
    # ACT & ASSERT
    assert str(tt.Asset.from_nai(NAI_OF_10_HIVE)) == "10.000 TESTS"
    assert str(tt.Asset.from_nai(tt.Asset.Hive(10))) == "10.000 TESTS"


def test_asset_from_nai_form_rejects_other_values() -> None:
    # ACT & ASSERT
    with pytest.raises(ValueError, match="is not an asset of the NAI form"):
        tt.Asset.from_nai({"amount": "10000"})


def test_factory_warns_about_rounded_amount() -> None:
    # ACT
    with pytest.warns(UserWarning, match="Precision lost"):
        asset = tt.Asset.Test(1.0001)

    # ASSERT
    assert asset == tt.Asset.Test(1)


def test_factory_rejects_amount_that_is_not_a_number() -> None:
    # ACT & ASSERT
    with pytest.raises(ValueError, match="Invalid asset amount format"):
        tt.Asset.Test("ten")


def test_range_with_tolerance_has_bounds_deviated_by_the_percentage_of_the_value() -> None:
    # ACT
    assets = tt.Asset.Range(tt.Asset.Test(100), tolerance=10)

    # ASSERT
    assert tt.Asset.Test(90) in assets
    assert tt.Asset.Test(110) in assets
    assert tt.Asset.Test(89.999) not in assets
    assert tt.Asset.Test(110.001) not in assets


def test_range_with_upper_limit_contains_its_limits() -> None:
    # ACT
    assets = tt.Asset.Range(tt.Asset.Tbd(1), tt.Asset.Tbd(2))

    # ASSERT
    assert tt.Asset.Tbd(1) in assets
    assert tt.Asset.Tbd(2) in assets
    assert tt.Asset.Tbd(2.001) not in assets


@pytest.mark.parametrize(
    ("upper_limit", "tolerance", "message"),
    [
        (None, None, "either `upper_limit` or `tolerance`"),
        (tt.Asset.Test(110), 10, "only one option"),
        (None, -10, "positive number"),
    ],
)
def test_range_rejects_wrong_limits(upper_limit: tt.Asset.TestT | None, tolerance: float | None, message: str) -> None:
    # ACT & ASSERT
    with pytest.raises(TypeError, match=message):
        tt.Asset.Range(tt.Asset.Test(100), upper_limit, tolerance=tolerance)
