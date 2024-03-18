from __future__ import annotations

from typing import TYPE_CHECKING, Final

import pytest

from wax import calculate_account_hp, calculate_witness_votes_hp, hive, vests, python_json_asset


TESTDATA1: Final[list[tuple[python_json_asset, python_json_asset, python_json_asset, python_json_asset]]] = [
    (vests(1_100_000_000), hive(100_000), vests(100_000_000_000), hive(1100)),
    (vests(2_268_100_675_963_340 - 0 + 124_333_332_132), hive(173_009_633_181), vests(300_729_442_281_783_339), hive(1304909735)), # gtg: "vestsing_shares": "2268100675.963340 vestsS", "delegated_vestsing_shares": "0.000000 vestsS", "received_vestsing_shares": "124333.332132 vests"
    (vests(142_103_996_686_715), hive(173_009_633_181), vests(300_729_442_281_783),hive(81752422223)),
    (vests(142_103_996_686), hive(173_009_633_181), vests(300_729_442_281),hive(81752422223)),
    (vests(142_103_996_686_715_320), hive(173_009_633), vests(300_729_442_281_783_339),hive(81752422)),
    (vests(142_996_686_715_320), hive(173_009_633_181), vests(300_729_281_783_339),hive(82266030657)),
    (vests(103_996_686_715_320), hive(173_009_633_181), vests(300_729_281_783_339), hive(59829320623)),
    (vests(142_996_686_715_320), hive(173_633_181), vests(300_729_442_783_339),hive(82562483)),
    (vests(996_686_715_320), hive(9_633_181), vests(442_281_783_339),hive(21708476)),
    (vests(686_715_320), hive(173_009_181), vests(442_281_783_339), hive(268625)),
    (vests(142_103_996), hive(173_009_633_181), vests(300_729_783_339), hive(81752329)),
    (vests(103_996_686_715_320), hive(173_009_633_181), vests(300_729_442_281_783_339), hive(59829289)),
    (vests(142_103_996_686), hive(173_009_633), vests(300_729_281_783_339), hive(81752)),
    (vests(142_996_715_320), hive(173_009_633_181), vests(729_281_783_339), hive(33923525623)),
    (vests(103_996_686_715_320), hive(173_009_633_181), vests(300_729_442_281_783_339), hive(59829289))
]


@pytest.mark.parametrize(("vests", "total_vesting_fund_hive", "total_vesting_shares", "expected"), TESTDATA1)
def test_calculate_account_hp(vests: python_json_asset, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset, expected: python_json_asset):
    result = calculate_account_hp(vests, total_vesting_fund_hive, total_vesting_shares)
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == expected.amount


TESTDATA2: Final[list[tuple[int, python_json_asset, python_json_asset, python_json_asset]]] = [
    (1_100_000_000, hive(100_000), vests(100_000_000_000), hive(1100)),
    (142_103_996_686_715_320, hive(173_009_633_181), vests(300_729_442_281_783_339), hive(81752422223))  # gtg: "votes": 142103996686715320
]


@pytest.mark.parametrize(("votes", "total_vesting_fund_hive", "total_vesting_shares", "expected"), TESTDATA2)
def test_calculate_witness_votes_hp(votes: int, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset, expected: python_json_asset):
    result = calculate_witness_votes_hp(votes, total_vesting_fund_hive, total_vesting_shares)
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == expected.amount
