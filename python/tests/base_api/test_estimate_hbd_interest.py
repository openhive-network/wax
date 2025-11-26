from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

if TYPE_CHECKING:
    from wax.interfaces import IWaxBaseInterface

from wax._private.models.hive_date_time import HiveDateTime


@pytest.mark.describe("Should be able to estimate hbd interest")
def test_estimate_hive_collateral(wax: IWaxBaseInterface) -> None:
    result = wax.estimate_hbd_interest(
        account_hbd_seconds=2860100980056,
        hbd_balance=wax.hbd.satoshis(46107782),
        last_compounding_date=HiveDateTime("2025-11-15T20:27:54"),
        now=HiveDateTime("2025-11-26T16:05:33"),
        interest_rate=1500,
    )

    assert result == wax.hbd.satoshis(218584)
