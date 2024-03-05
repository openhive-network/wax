
from __future__ import annotations

from typing import Final

import pytest

from wax import calculate_inflation_rate_for_block 


TESTDATA: Final[list[tuple[int, str]]] = [
    (1_000_000, '974'),
    (7_500_000, '948'),
    (9_000_000, '942'),
]


@pytest.mark.parametrize(("block_num", "expected"), TESTDATA)
def test_calculate_inflation_rate_for_block(
    block_num: int,
    expected: bytes
) -> None:
    result = calculate_inflation_rate_for_block(block_num)
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result.decode() == expected
