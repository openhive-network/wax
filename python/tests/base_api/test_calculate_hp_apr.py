from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING

import pytest

if TYPE_CHECKING:
    from wax.interfaces import IWaxBaseInterface


@pytest.mark.parametrize("unit_amount", ["coins", "satoshis"])
@pytest.mark.descrbe("Should be able to calculate HP APR")
def test_calculate_hp_apr(wax: IWaxBaseInterface, unit_amount: str) -> None:
    hive_unit = getattr(wax.hive, unit_amount)

    hp_apr = wax.calculate_hp_apr(
        head_block_num=1_000_000,
        vesting_reward_percent=1_500,
        virtual_supply=hive_unit(10),
        total_vesting_fund_hive=hive_unit(10),
    )
    assert hp_apr == Decimal("1.46")
