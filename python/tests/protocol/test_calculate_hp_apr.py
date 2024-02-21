from __future__ import annotations

from typing import TYPE_CHECKING, Final

import pytest

from wax import calculate_hp_apr, hive, python_json_asset


TESTDATA: Final[list[tuple[int, int, python_json_asset, python_json_asset, bytes]]] = [
    (1_000_000, 1_500, hive(530_656_835_180), hive(173_009_633_181), b'4.48'),
    (82_779_364, 1_500, hive(530_656_835_180), hive(173_009_633_181), b'2.97')
]
    

@pytest.mark.parametrize(("head_block_num", "vesting_reward_percent", "virtual_supply", "total_vesting_fund_hive", "expected"), TESTDATA)
def test_calculate_hp_apr(
    head_block_num: int,
    vesting_reward_percent: int,
    virtual_supply: python_json_asset,
    total_vesting_fund_hive: python_json_asset,
    expected: bytes
) -> None:
    result = calculate_hp_apr(head_block_num, vesting_reward_percent, virtual_supply, total_vesting_fund_hive)
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == expected
