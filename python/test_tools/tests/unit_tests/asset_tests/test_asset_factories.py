from __future__ import annotations

from typing import TYPE_CHECKING

import pytest
from hiveio_api import HBD_ASSET, HIVE_ASSET, VESTS_ASSET

import test_tools as tt

if TYPE_CHECKING:
    from hiveio_api import AssetInfo

    from test_tools.__private.asset import AssetFactory


@pytest.mark.parametrize(
    ("factory", "info", "symbol", "legacy"),
    [
        (tt.Asset.Hive, HIVE_ASSET, "HIVE", "1.500 HIVE"),
        (tt.Asset.Test, HIVE_ASSET, "TESTS", "1.500 TESTS"),
        (tt.Asset.Hbd, HBD_ASSET, "HBD", "1.500 HBD"),
        (tt.Asset.Tbd, HBD_ASSET, "TBD", "1.500 TBD"),
        (tt.Asset.Vest, VESTS_ASSET, "VESTS", "1.500000 VESTS"),
    ],
)
def test_factories_create_assets_and_give_information_about_their_kind(
    factory: AssetFactory, info: AssetInfo, symbol: str, legacy: str
) -> None:
    # ACT
    asset = factory(1.5)

    # ASSERT
    assert str(asset) == legacy
    assert factory.token() == asset.token() == info
    assert str(factory.token()) == str(asset.token()) == symbol


def test_factory_gives_information_about_its_kind_also_of_the_other_network() -> None:
    # ACT & ASSERT
    assert str(tt.Asset.Test.token(testnet=False)) == "HIVE"
    assert str(tt.Asset.Hbd.token(testnet=True)) == "TBD"


def test_factories_are_shown_by_their_names() -> None:
    # ACT & ASSERT
    assert repr(tt.Asset.Tbd) == "tt.Asset.Tbd"
