from __future__ import annotations

from typing import TYPE_CHECKING, Final

import pytest

from wax import calculate_account_hp, calculate_witness_votes_hp, hive, vests, python_json_asset


TESTDATA1: Final[list[tuple[python_json_asset, python_json_asset, python_json_asset, bytes]]] = [
    (vests(1_100_000_000), hive(100_000), vests(100_000_000_000), b'2'),
    (vests(2_268_100_675_963_340 - 0 + 124_333_332_132), hive(173_009_633_181), vests(300_729_442_281_783_339), b'1304910')  # gtg: "vesting_shares": "2268100675.963340 VESTS", "delegated_vesting_shares": "0.000000 VESTS", "received_vesting_shares": "124333.332132 VESTS"
]
    

@pytest.mark.parametrize(("vests", "total_vesting_fund_hive", "total_vesting_shares", "expected"), TESTDATA1)
def test_calculate_account_hp(vests: python_json_asset, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset, expected: bytes):
    result = calculate_account_hp(vests, total_vesting_fund_hive, total_vesting_shares)
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == expected


TESTDATA2: Final[list[tuple[int, int, int, int]]] = [
    (1_100_000_000, hive(100_000), vests(100_000_000_000), b'2'),
    (142_103_996_686_715_320, hive(173_009_633_181), vests(300_729_442_281_783_339), b'81752423')  # gtg: "votes": 142103996686715320
]
    

@pytest.mark.parametrize(("votes", "total_vesting_fund_hive", "total_vesting_shares", "expected"), TESTDATA2)
def test_calculate_witness_votes_hp(votes: int, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset, expected: bytes):
    result = calculate_witness_votes_hp(votes, total_vesting_fund_hive, total_vesting_shares)
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == expected
