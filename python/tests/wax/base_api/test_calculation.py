from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from typing import TYPE_CHECKING

import pytest

if TYPE_CHECKING:
    from wax.interfaces import IWaxBaseInterface


@pytest.mark.describe(
    "Should be able to calculate current manabar value using hive chain interface"
)
def test_current_manabar_calculation(wax: IWaxBaseInterface) -> None:
    manabar = wax.calculate_current_manabar_value(
        head_block_time=datetime.fromtimestamp(1702548351, tz=timezone.utc),
        max_mana=2196088774870643,
        current_mana=1952744111294225,
        last_update_time=1702548249,
    )

    assert manabar.current_mana == 1953262632254958
    assert manabar.max_mana == 2196088774870643
    assert manabar.percent == Decimal("88.94")


@pytest.mark.describe("Should be able to calculate witness votes HP")
def test_calculate_witness_votes_hp_0(wax: IWaxBaseInterface) -> None:
    # real input data for 5 million node
    calculated_votes = wax.calculate_witness_votes_hp(
        number=147408633689698596,
        total_vesting_fund_hive=wax.hive.satoshis(180520335089),
        total_vesting_shares=wax.vests.satoshis(304505804867506145),
    )

    assert calculated_votes == wax.hive.satoshis(87388337178)


@pytest.mark.describe("Should be able to calculate witness votes HP with mixed params")
def test_calculate_witness_votes_hp_1(wax: IWaxBaseInterface) -> None:
    # real input data for 5 million node
    calculated_votes = wax.calculate_witness_votes_hp(
        number=147408633689698596,
        total_vesting_fund_hive=wax.hive.satoshis(180520335089),
        total_vesting_shares=wax.vests.coins(304505804867.506145),
    )
    assert calculated_votes == wax.hive.coins(87388337.178)


@pytest.mark.parametrize("unit_amount", ["coins", "satoshis"])
@pytest.mark.describe("Should be able to calculate account HP - coins/satoshis")
def test_calculate_account_hp_0(wax: IWaxBaseInterface, unit_amount: str) -> None:
    hive_unit = getattr(wax.hive, unit_amount)
    vests_unit = getattr(wax.vests, unit_amount)

    calculated_hp = wax.calculate_account_hp(
        vests=vests_unit(10),
        total_vesting_fund_hive=hive_unit(10),
        total_vesting_shares=vests_unit(10),
    )

    assert calculated_hp == hive_unit(10)


@pytest.mark.describe("Should be able to calculate account HP with mixed params")
def test_calculate_account_hp_1(wax: IWaxBaseInterface) -> None:
    calculated_hp = wax.calculate_account_hp(
        vests=wax.vests.coins(10),
        total_vesting_fund_hive=wax.hive.satoshis(10),
        total_vesting_shares=wax.vests.satoshis(10),
    )

    assert calculated_hp == wax.hive.coins(10_000)
