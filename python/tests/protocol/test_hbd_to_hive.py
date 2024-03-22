
from __future__ import annotations

from typing import Final

import pytest

from wax import calculate_hbd_to_hive, hive, hbd, python_json_asset

# Results validated manually

TESTDATA: Final[list[tuple[python_json_asset, python_json_asset, python_json_asset, python_json_asset]]] = [
    (hbd(2432), hbd(400), hive(1_000), hive(6080)),
    (hbd(1231), hbd(400), hive(400), hive(1231)),
    (hbd(233333), hbd(50), hive(100), hive(466666)),
    (hbd(1), hbd(443), hive(2310), hive(5)),
    (hbd(22), hbd(11), hive(13240), hive(26480)),
    (hbd(230), hbd(500), hive(10240), hive(4710)),
    (hbd(5), hbd(500), hive(1020), hive(10)),
    (hbd(2), hbd(5030), hive(1240), hive(0)),
    (hbd(2), hbd(400), hive(1000), hive(5)),
    (hbd(1), hbd(400), hive(4004), hive(10)),
    (hbd(233), hbd(50), hive(1500), hive(6990)),
    (hbd(123), hbd(43), hive(2410), hive(6893)),
    (hbd(22), hbd(1111), hive(124), hive(2)),
    (hbd(20), hbd(500), hive(1040), hive(41)),
    (hbd(51), hbd(50), hive(10240), hive(10444)),
    (hbd(2), hbd(500), hive(140), hive(0)),
    (hbd(2432), hbd(1000), hive(462), hive(1123)),
    (hbd(1231), hbd(1000), hive(462), hive(568)),
    (hbd(233333), hbd(1000), hive(462), hive(107799)),
    (hbd(22), hbd(1000), hive(462), hive(10)),
    (hbd(230), hbd(1000), hive(462), hive(106)),
    (hbd(5), hbd(1000), hive(462), hive(2)),
    (hbd(1), hbd(1000), hive(462), hive(0)),
    (hbd(233), hbd(1000), hive(462), hive(107)),
    (hbd(123), hbd(1000), hive(462), hive(56)),
    (hbd(22), hbd(1000), hive(462), hive(10)),
    (hbd(20), hbd(1000), hive(462), hive(9)),
    (hbd(51), hbd(1000), hive(462), hive(23)),
    (hbd(2), hbd(1000), hive(462), hive(0))
]


@pytest.mark.parametrize(("hbd", "base", "quote", "expected"), TESTDATA)
def test_calculate_hbd_to_hive(hbd: python_json_asset, base: python_json_asset, quote: python_json_asset, expected: python_json_asset):
    result = calculate_hbd_to_hive(hbd, base, quote)
    assert result == expected
