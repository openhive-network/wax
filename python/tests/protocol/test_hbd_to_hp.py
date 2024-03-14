
from __future__ import annotations

from typing import Final

import pytest

from wax import calculate_hbd_to_hp, hive, hbd, python_json_asset

# Data based on tests runned on convert_hbd_to_hive function fromt tt.

TESTDATA: Final[list[tuple[python_json_asset, float, float, python_json_asset]]] = [
    (hbd(2432), 1_000, 400, hive(6080)),
    (hbd(1231), 400, 400, hive(1231)),
    (hbd(233333), 100, 50, hive(466666)),
    (hbd(1), 2310, 443, hive(5)),
    (hbd(22), 13240, 11, hive(26480)),
    (hbd(230), 10240, 500, hive(4710)),
    (hbd(5), 1020, 500, hive(10)),
    (hbd(2), 1240, 5030, hive(0)),
    (hbd(2), 1000, 400, hive(5)),
    (hbd(1),4004,400,hive(10)),
    (hbd(233),1500,50,hive(6990)),
    (hbd(123),2410,43,hive(6894)),
    (hbd(22),124,1111,hive(2)),
    (hbd(20),1040,500,hive(42)),
    (hbd(51),10240,50,hive(10445)),
    (hbd(2),140,500,hive(1)),
    (hbd(2432),0.462 ,1.0 , hive(1124)),
    (hbd(1231),0.462 ,1.0 , hive(569)),
    (hbd(233333),0.462 ,1.0 , hive(107800)),
    (hbd(22),0.462 ,1.0 , hive(10)),
    (hbd(230),0.462 ,1.0 , hive(106)),
    (hbd(5),0.462 ,1.0 , hive(2)),
    (hbd(1),0.462,1.0,hive(0)),
    (hbd(233),0.462,1.0,hive(108)),
    (hbd(123),0.462,1.0,hive(57)),
    (hbd(22),0.462,1.0,hive(10)),
    (hbd(20),0.462,1.0,hive(9)),
    (hbd(51),0.462,1.0,hive(24)),
    (hbd(2),0.462,1.0,hive(1))
]


@pytest.mark.parametrize(("hbd", "base", "quote", "expected"), TESTDATA)
def test_calculate_hbd_to_hp(hbd: python_json_asset, base : float, quote : float, expected: python_json_asset):
    result = calculate_hbd_to_hp(hbd, base, quote)
    assert result.result == expected.amount
    assert result.exception_message == b''
    assert result.status == result.status.ok
