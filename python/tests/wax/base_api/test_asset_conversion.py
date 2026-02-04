from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

if TYPE_CHECKING:
    from wax.interfaces import IWaxBaseInterface


@pytest.mark.describe("Should be able to convert HIVE to HBD using satoshis")
def test_asset_conversion_0(wax: IWaxBaseInterface) -> None:
    feed_price_base = wax.hbd.satoshis(amount=171)
    feed_price_quote = wax.hive.satoshis(amount=1000)
    amount = wax.hive.satoshis(amount=13316762799)

    result = wax.hive_to_hbd(hive=amount, base=feed_price_base, quote=feed_price_quote)

    assert result == wax.hbd.satoshis(amount=2277166438)


@pytest.mark.describe("Should be able to convert HIVE to HBD using satoshis")
def test_asset_conversion_1(wax: IWaxBaseInterface) -> None:
    feed_price_base = wax.hbd.satoshis(amount=171_000)
    feed_price_quote = wax.hive.satoshis(amount=1000_000)
    amount = wax.hive.satoshis(amount=13316762799_000)

    result = wax.hive_to_hbd(hive=amount, base=feed_price_base, quote=feed_price_quote)

    assert result == wax.hbd.satoshis(amount=2277166438629)


@pytest.mark.describe("Should be able to convert HIVE to HBD using coins")
def test_asset_conversion_2(wax: IWaxBaseInterface) -> None:
    feed_price_base = wax.hbd.coins(amount=171)
    feed_price_quote = wax.hive.coins(amount=1000)
    amount = wax.hive.coins(amount=13316762799)

    result = wax.hive_to_hbd(hive=amount, base=feed_price_base, quote=feed_price_quote)

    assert result == wax.hbd.coins(amount=2277166438.629)


@pytest.mark.describe("Should be able to convert HIVE to HBD using mixed params")
def test_asset_conversion_3(wax: IWaxBaseInterface) -> None:
    feed_price_base = wax.hbd.satoshis(amount=171_000)
    feed_price_quote = wax.hive.coins(amount=1000)
    amount = wax.hive.coins(amount=13316762799)

    result = wax.hive_to_hbd(hive=amount, base=feed_price_base, quote=feed_price_quote)

    assert result == wax.hbd.coins(amount=2277166438.629)


@pytest.mark.describe("Should be able to convert VESTS to HP (bug)")
def test_asset_conversion_4(wax: IWaxBaseInterface) -> None:
    delegated_vesting_shares = 6909522651976083
    # according to result taken from:
    # https://api.syncad.com/hafbe-api/witnesses/blocktrades/voters?sort=vests&direction=desc&result-limit=2147483647
    self_witness_vote = 43357485398000965

    blocktrades_delegated_hp = wax.vests_to_hp(
        vests=wax.vests.satoshis(amount=delegated_vesting_shares),
        total_vesting_fund_hive=wax.hive.satoshis(amount=182849539607),
        total_vesting_shares=wax.vests.satoshis(amount=312353953479712805),
    )

    blocktrades_self_witness_vote_hp = wax.vests_to_hp(
        vests=wax.vests.satoshis(amount=self_witness_vote),
        total_vesting_fund_hive=wax.hive.satoshis(amount=182849539607),
        total_vesting_shares=wax.vests.satoshis(amount=312353953479712805),
    )

    delegated_vesting_shares = 13261033608208
    mcfarhat_delegated_hp = wax.vests_to_hp(
        vests=wax.vests.satoshis(amount=delegated_vesting_shares),
        total_vesting_fund_hive=wax.hive.satoshis(amount=182849539607),
        total_vesting_shares=wax.vests.satoshis(amount=312353953479712805),
    )

    assert blocktrades_delegated_hp == wax.hive.satoshis(amount=4044780037)
    assert blocktrades_self_witness_vote_hp == wax.hive.satoshis(amount=25381129821)
    assert mcfarhat_delegated_hp == wax.hive.satoshis(amount=7762904)


@pytest.mark.describe("Should be able to convert VESTS to HP using satoshis")
def test_asset_conversion_5(wax: IWaxBaseInterface) -> None:
    result = wax.vests_to_hp(
        vests=wax.vests.satoshis(amount=10),
        total_vesting_fund_hive=wax.hive.satoshis(amount=1),
        total_vesting_shares=wax.vests.satoshis(amount=10),
    )

    assert result == wax.hive.satoshis(amount=1)


@pytest.mark.describe("Should be able to convert VESTS to HP using coins")
def test_asset_conversion_6(wax: IWaxBaseInterface) -> None:
    result = wax.vests_to_hp(
        vests=wax.vests.coins(amount=10),
        total_vesting_fund_hive=wax.hive.coins(amount=10),
        total_vesting_shares=wax.vests.coins(amount=10),
    )

    assert result == wax.hive.coins(amount=10)


@pytest.mark.describe("Should be able to convert VESTS to HP using mixed params")
def test_asset_conversion_7(wax: IWaxBaseInterface) -> None:
    result = wax.vests_to_hp(
        vests=wax.vests.satoshis(10),
        total_vesting_fund_hive=wax.hive.coins(10),
        total_vesting_shares=wax.vests.satoshis(10),
    )

    assert result == wax.hive.coins(10)


@pytest.mark.describe("Should be able to convert HBD to HIVE using satoshis")
def test_asset_conversion_8(wax: IWaxBaseInterface) -> None:
    result = wax.hbd_to_hive(hbd=wax.hbd.satoshis(10), base=wax.hbd.satoshis(1), quote=wax.hive.satoshis(10))

    assert result == wax.hive.satoshis(100)


@pytest.mark.describe("Should be able to convert HBD to HIVE using coins")
@pytest.mark.parametrize(("value_to_convert", "base", "quote"), [(2, 1, 1), (5, 1, 2), (10, 1, 10), (1000, 1, 20)])
def test_asset_conversion_9(wax: IWaxBaseInterface, value_to_convert: int, base: int, quote: int) -> None:
    result = wax.hbd_to_hive(hbd=wax.hbd.coins(value_to_convert), base=wax.hbd.coins(base), quote=wax.hive.coins(quote))

    assert result == wax.hive.coins(int(value_to_convert * (base * quote)))


@pytest.mark.describe("Should be able to convert HBD to HIVE using mixed params")
def test_asset_conversion_10(wax: IWaxBaseInterface) -> None:
    result = wax.hbd_to_hive(hbd=wax.hbd.coins(10), base=wax.hbd.satoshis(1), quote=wax.hive.satoshis(10))

    assert result == wax.hive.coins(100)
