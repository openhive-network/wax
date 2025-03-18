from __future__ import annotations

import json
from typing import TYPE_CHECKING, Any, Final

import pytest

from wax._private.proto.recurrent_transfer_pb2 import recurrent_transfer_extension, recurrent_transfer_pair_id
from wax.proto.operations import recurrent_transfer

if TYPE_CHECKING:
    from wax import ITransaction, IWaxBaseInterface


@pytest.mark.parametrize("asset_type", ["hbd", "hive"])
@pytest.mark.describe("Should initialize push_operation with recurrent_transfer_operation via base interface")
def test_basic_recurrent_transfer_operation(wax: IWaxBaseInterface, transaction: ITransaction, asset_type: str) -> None:
    transfer_amount = getattr(wax, asset_type).satoshis(100)

    transaction.push_operation(
        operation=recurrent_transfer(
            from_account="alice",
            to_account="bob",
            amount=transfer_amount,
            recurrence=24,
            executions=2,
            memo="thanks for the service",
        )
    )

    expected: Final[dict[str, Any]] = {
        "type": "recurrent_transfer_operation",
        "value": {
            "amount": {
                "amount": transfer_amount.amount,
                "nai": transfer_amount.nai,
                "precision": transfer_amount.precision,
            },
            "executions": 2,
            "from": "alice",
            "memo": "thanks for the service",
            "recurrence": 24,
            "to": "bob",
        },
    }

    assert json.loads(transaction.to_api())["operations"][0] == expected


@pytest.mark.parametrize("asset_type", ["hbd", "hive"])
@pytest.mark.describe(
    "Should initialize push_operation with recurrent_transfer_operation and pair_id extension via base interface"
)
def test_recurrent_transfer_with_pair_id_extension(
    wax: IWaxBaseInterface, transaction: ITransaction, asset_type: str
) -> None:
    id_: Final[int] = 12345
    transfer_amount = getattr(wax, asset_type).satoshis(100)

    transaction.push_operation(
        operation=recurrent_transfer(
            amount=transfer_amount,
            executions=2,
            from_account="alice",
            memo="monthly subscription",
            recurrence=24,
            to_account="bob",
            extensions=[
                recurrent_transfer_extension(recurrent_transfer_pair_id=recurrent_transfer_pair_id(pair_id=id_))
            ],
        )
    )

    expected: Final[dict[str, Any]] = {
        "type": "recurrent_transfer_operation",
        "value": {
            "amount": {
                "amount": transfer_amount.amount,
                "nai": transfer_amount.nai,
                "precision": transfer_amount.precision,
            },
            "executions": 2,
            "extensions": [{"type": "recurrent_transfer_pair_id", "value": {"pair_id": id_}}],
            "from": "alice",
            "memo": "monthly subscription",
            "recurrence": 24,
            "to": "bob",
        },
    }

    assert json.loads(transaction.to_api())["operations"][0] == expected
