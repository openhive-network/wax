from __future__ import annotations

import json
from typing import TYPE_CHECKING, Any, Final

import pytest

from wax._private.proto.recurrent_transfer_extension_pb2 import (
    recurrent_transfer_extension,
    recurrent_transfer_pair_id,
)
from wax._private.proto_utils import message_to_dict_with_defaults
from wax.complex_operations.recurrent_transfer import (
    DefineRecurrentTransferOperation,
    RecurrentTransferData,
    RecurrentTransferRemovalOperation,
)
from wax.exceptions.asset_errors import UnexpectedAssetTypeError
from wax.proto.operations import recurrent_transfer

if TYPE_CHECKING:
    from wax import ITransaction, IWaxBaseInterface

TX_EXPIRATION: Final[str] = "2023-11-09T21:51:27"


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
            "extensions": [],
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
    id_: Final[int] = 57
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


@pytest.mark.describe("DefineRecurrentTransferOperation.finalize")
def test_define_recurrent_transfer_with_pair_id(wax: IWaxBaseInterface) -> None:
    # arrange
    op = DefineRecurrentTransferOperation(
        RecurrentTransferData(
            from_account="alice",
            to_account="bob",
            amount=wax.hive.satoshis(1_000),
            pair_id=1,
            memo="memo",
            recurrence=5,
            executions=12,
        )
    )

    expected: Final[dict[str, Any]] = {
        "from": "alice",
        "to": "bob",
        "amount": {"amount": "1000", "nai": "@@000000021", "precision": 3},
        "executions": 12,
        "extensions": [{"recurrent_transfer_pair_id": {"pair_id": 1}}],
        "memo": "memo",
        "recurrence": 5,
    }

    # act
    result = list(op.finalize(wax))
    op_dict = message_to_dict_with_defaults(result[0])

    # assert
    assert len(result) == 1
    assert op_dict == expected


@pytest.mark.describe("DefineRecurrentTransferOperation.finalize")
def test_define_recurrent_transfer_without_pair_id(wax: IWaxBaseInterface) -> None:
    # arrange
    op = DefineRecurrentTransferOperation(
        RecurrentTransferData(
            from_account="alice",
            to_account="bob",
            amount=wax.hive.satoshis(1_000),
            memo="memo",
            recurrence=5,
            executions=12,
        )
    )

    expected: Final[dict[str, Any]] = {
        "from": "alice",
        "to": "bob",
        "amount": {"amount": "1000", "precision": 3, "nai": "@@000000021"},
        "extensions": [],
        "memo": "memo",
        "recurrence": 5,
        "executions": 12,
    }

    # act
    result = list(op.finalize(wax))
    op_dict = message_to_dict_with_defaults(result[0])

    # assert
    assert len(result) == 1
    assert op_dict == expected


@pytest.mark.describe("RecurrentTransferRemovalOperation.finalize")
def test_recurrent_transfer_removal_with_pair_id(wax: IWaxBaseInterface) -> None:
    # arrange
    op = RecurrentTransferRemovalOperation(
        from_account="alice",
        to_account="bob",
        pair_id=1,
    )

    expected: Final[dict[str, Any]] = {
        "from": "alice",
        "to": "bob",
        "amount": {"amount": "0", "precision": 3, "nai": "@@000000021"},
        "extensions": [{"recurrent_transfer_pair_id": {"pair_id": 1}}],
        "memo": "",
        "recurrence": 24,
        "executions": 2,
    }

    # act
    result = list(op.finalize(wax))
    op_dict = message_to_dict_with_defaults(result[0])

    # assert
    assert len(result) == 1
    assert op_dict == expected


@pytest.mark.describe("RecurrentTransferRemovalOperation.finalize")
def test_recurrent_transfer_removal_without_pair_id(wax: IWaxBaseInterface) -> None:
    # arrange
    op = RecurrentTransferRemovalOperation(from_account="alice", to_account="bob")

    expected: Final[dict[str, Any]] = {
        "from": "alice",
        "to": "bob",
        "amount": {"amount": "0", "precision": 3, "nai": "@@000000021"},
        "extensions": [],
        "memo": "",
        "recurrence": 24,
        "executions": 2,
    }

    # act
    result = list(op.finalize(wax))
    op_dict = message_to_dict_with_defaults(result[0])

    # assert
    assert len(result) == 1
    assert op_dict == expected


@pytest.mark.describe("DefineRecurrentTransferOperation.finalize")
def test_define_recurrent_transfer_raises_unexpected_asset_type_error(
    wax: IWaxBaseInterface,
) -> None:
    # arrange
    op = DefineRecurrentTransferOperation(
        RecurrentTransferData(
            from_account="alice",
            to_account="bob",
            amount=wax.vests.satoshis(1_000),
            memo="memo",
            recurrence=5,
            executions=12,
        )
    )
    # act & assert
    with pytest.raises(UnexpectedAssetTypeError):
        op.finalize(wax)


@pytest.mark.describe("DefineRecurrentTransferOperation.transaction")
def test_define_recurrent_transfer_add_to_transaction(transaction: ITransaction, wax: IWaxBaseInterface) -> None:
    # arrange
    transaction.transaction.expiration = TX_EXPIRATION
    op = DefineRecurrentTransferOperation(
        RecurrentTransferData(
            from_account="alice",
            to_account="bob",
            amount=wax.hive.satoshis(1_000),
            memo="memo",
            recurrence=5,
            executions=12,
        )
    )

    expected: Final[dict[str, Any]] = {
        "type": "recurrent_transfer_operation",
        "value": {
            "from": "alice",
            "to": "bob",
            "amount": {"amount": "1000", "precision": 3, "nai": "@@000000021"},
            "extensions": [],
            "memo": "memo",
            "recurrence": 5,
            "executions": 12,
        },
    }

    # act
    transaction.push_operation(op)

    # assert
    assert transaction.to_dict()["operations"][0] == expected


@pytest.mark.describe("RecurrentTransferRemoval.transaction")
def test_recurrent_transfer_removal_add_to_transaction(
    transaction: ITransaction,
) -> None:
    # arrange
    transaction.transaction.expiration = TX_EXPIRATION
    op = RecurrentTransferRemovalOperation(from_account="alice", to_account="bob")

    expected: Final[dict[str, Any]] = {
        "type": "recurrent_transfer_operation",
        "value": {
            "from": "alice",
            "to": "bob",
            "amount": {"amount": "0", "precision": 3, "nai": "@@000000021"},
            "extensions": [],
            "memo": "",
            "recurrence": 24,
            "executions": 2,
        },
    }

    # act
    transaction.push_operation(op)

    # assert
    assert transaction.to_dict()["operations"][0] == expected
