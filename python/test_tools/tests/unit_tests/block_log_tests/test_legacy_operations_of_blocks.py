from __future__ import annotations

import pytest

from test_tools.__private.block_log import _has_legacy_operations

TRANSFER = {"from": "alice", "to": "bob", "amount": "1.000 TESTS", "memo": ""}


@pytest.mark.parametrize(
    ("block", "expected"),
    [
        ({"transactions": [{"operations": [["transfer", TRANSFER]]}]}, True),
        ({"transactions": [{"operations": [{"type": "transfer_operation", "value": TRANSFER}]}]}, False),
        ({"transactions": [{"operations": []}, {"operations": [["transfer", TRANSFER]]}]}, True),
        ({"transactions": [{"operations": []}]}, False),
        ({"transactions": []}, False),
        ({}, False),
    ],
    ids=[
        "legacy operation",
        "hf26 operation",
        "legacy operation after transaction without operations",
        "transaction without operations",
        "block without transactions",
        "block without list of transactions",
    ],
)
def test_form_of_operations_is_told_by_the_first_operation_of_the_block(
    block: dict[str, object], *, expected: bool
) -> None:
    # ACT & ASSERT
    assert _has_legacy_operations(block) is expected
