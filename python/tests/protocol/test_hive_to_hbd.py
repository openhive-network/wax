
from __future__ import annotations

from typing import Final

import pytest

from wax import calculate_hive_to_hbd, hive, hbd, python_json_asset

# Results validated manually

TESTDATA: Final[list[tuple[python_json_asset, python_json_asset, python_json_asset, python_json_asset]]] = [
    (hive(13316762799_000), hbd(171_000), hive(1_000_000), hbd(2277166438629))
]


@pytest.mark.parametrize(("amount", "base", "quote", "expected"), TESTDATA)
def test_calculate_hive_to_hbd(amount: python_json_asset, base: python_json_asset, quote: python_json_asset, expected: python_json_asset):
    result = calculate_hive_to_hbd(amount, base, quote)
    assert result == expected
