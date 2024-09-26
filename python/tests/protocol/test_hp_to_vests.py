from __future__ import annotations

from typing import TYPE_CHECKING, Final

import pytest

from wax import calculate_hp_to_vests, hive, vests, python_json_asset


TESTDATA: Final[list[tuple[python_json_asset, python_json_asset, python_json_asset, python_json_asset]]] = [
    (vests(1_100_000_000), hive(100_000), vests(100_000_000_000), hive(1100)),
    (vests(2_268_225_007_582_910), hive(173_009_633_181), vests(300_729_442_281_783_339), hive(1304909734)),
    (vests(142_103_996_686_628), hive(173_009_633_181), vests(300_729_442_281_783),hive(81752422223)),
    (vests(142_103_996_684), hive(173_009_633_181), vests(300_729_442_281),hive(81752422222)),
    (vests(142_103_996_447_671_757), hive(173_009_633), vests(300_729_442_281_783_339),hive(81752422)),
    (vests(142_996_686_714_914), hive(173_009_633_181), vests(300_729_281_783_339),hive(82266030657)),
    (vests(103_996_686_714_643), hive(173_009_633_181), vests(300_729_281_783_339), hive(59829320623)),
    (vests(142_996_686_257_789), hive(173_633_181), vests(300_729_442_783_339),hive(82562483)),
    (vests(996_686_710_117), hive(9_633_181), vests(442_281_783_339),hive(21708476)),
    (vests(686_714_678), hive(173_009_181), vests(442_281_783_339), hive(268625)),
    (vests(142_103_995), hive(173_009_633_181), vests(300_729_783_339), hive(81752329)),
    (vests(103_996_685_511_336), hive(173_009_633_181), vests(300_729_442_281_783_339), hive(59829288)),
    (vests(142_103_187_077), hive(173_009_633), vests(300_729_281_783_339), hive(81752)),
    (vests(142_996_715_319), hive(173_009_633_181), vests(729_281_783_339), hive(33923525623)),
    (vests(103_996_685_511_336), hive(173_009_633_181), vests(300_729_442_281_783_339), hive(59829288))
]


@pytest.mark.parametrize(("expected", "total_vesting_fund_hive", "total_vesting_shares", "hive"), TESTDATA)
def test_calculate_hp_to_vests(expected: python_json_asset, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset, hive: python_json_asset):
    result = calculate_hp_to_vests(hive, total_vesting_fund_hive, total_vesting_shares)
    assert result == expected
