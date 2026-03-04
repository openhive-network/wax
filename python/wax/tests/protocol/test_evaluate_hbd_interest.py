from __future__ import annotations

from typing import Final

import pytest

from wax import evaluate_hbd_interest, hbd, python_json_asset


TESTDATA: Final[list[tuple[int, int, python_json_asset, int, int, python_json_asset]]] = [
    (
        0xFFFF_FFFF_FFFF_FFFF,
        3_000_000,
        hbd(100_000_000_000),
        3_000_333,
        15,
        python_json_asset(amount="877412042", precision=3, nai="@@000000013"),
    ),
    (
        0xFF_FFFF_FFFF_FFFF_FFFF,
        3_000_000,
        hbd(100_000_000),
        3_003_000,
        15,
        python_json_asset(amount="224617888250", precision=3, nai="@@000000013"),
    ),
]


@pytest.mark.parametrize(
    ("hbd_seconds", "head_block_time", "hbd", "hbd_seconds_last_update", "hbd_interest_rate", "expected"), TESTDATA
)
def test_evaluate_hbd_interest(
    hbd_seconds: int,
    head_block_time: int,
    hbd: python_json_asset,
    hbd_seconds_last_update: int,
    hbd_interest_rate: int,
    expected: python_json_asset,
) -> None:
    result = evaluate_hbd_interest(hbd_seconds, head_block_time, hbd, hbd_seconds_last_update, hbd_interest_rate)
    assert result == expected
