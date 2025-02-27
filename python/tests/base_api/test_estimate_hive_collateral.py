from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

if TYPE_CHECKING:
    from wax.interfaces import IWaxBaseInterface


@pytest.mark.descrbe("Should be able to estimate hive collateral")
def test_estimate_hive_collateral(wax: IWaxBaseInterface) -> None:
    estimated_hive_collateral = wax.estimate_hive_collateral(
        current_median_history_base=wax.hbd.satoshis(201),
        current_median_history_quote=wax.hive.satoshis(1000),
        current_min_history_base=wax.hbd.satoshis(197),
        current_min_history_quote=wax.hive.satoshis(1000),
        hbd_amount_to_get=wax.hbd.satoshis(100000),
    )

    assert estimated_hive_collateral == wax.hive.satoshis(1065988)
