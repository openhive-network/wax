from __future__ import annotations

import datetime
import json
from typing import TYPE_CHECKING, Any, Final

import pytest

from wax._private.proto.update_proposal_pb2 import (
    update_proposal_end_date,
    update_proposal_extension,
)
from wax._private.proto_utils import message_to_dict_with_defaults
from wax.complex_operations.update_proposal_operation import (
    UpdateProposalOperation,
    UpdateProposalOperationData,
)
from wax.exceptions import WaxError
from wax.exceptions.asset_errors import UnexpectedAssetTypeError
from wax.proto.operations import update_proposal

if TYPE_CHECKING:
    from wax.interfaces import ITransaction, IWaxBaseInterface

TX_EXPIRATION: Final[str] = "2023-11-09T21:51:27"


@pytest.mark.describe("Should initialize update proposal with mandatory fields only")
def test_initialize_update_proposal_with_mandatory_fields(
    transaction: ITransaction,
) -> None:
    transaction.push_operation(
        operation=update_proposal(
            proposal_id=123,
            creator="alice",
            daily_pay={"amount": "1000", "precision": 3, "nai": "@@000000013"},
            subject="Improve UI Design",
            permlink="improve-ui",
        )
    )

    expected: Final[dict[str, Any]] = {
        "type": "update_proposal_operation",
        "value": {
            "creator": "alice",
            "daily_pay": {"amount": "1000", "nai": "@@000000013", "precision": 3},
            "permlink": "improve-ui",
            "proposal_id": 123,
            "extensions": [],
            "subject": "Improve UI Design",
        },
    }

    assert json.loads(transaction.to_api())["operations"][0] == expected


@pytest.mark.skip(reason="python version `update_proposal` not implemented")
@pytest.mark.describe("Should add end_date in update proposal when provided")
def test_adds_end_date_to_update_proposal_when_provided(
    transaction: ITransaction,
) -> None:
    transaction.push_operation(
        operation=update_proposal(
            proposal_id=123,
            creator="alice",
            daily_pay={"amount": "1000", "precision": 3, "nai": "@@000000013"},
            subject="Improve UI Design",
            permlink="improve-ui",
            extensions=[
                update_proposal_extension(update_proposal_end_date=update_proposal_end_date(end_date="2023-03-14"))
            ],
        )
    )

    expected: Final[dict[str, Any]] = {
        "type": "update_proposal_operation",
        "value": {
            "creator": "alice",
            "daily_pay": {"amount": "1000", "nai": "@@000000013", "precision": 3},
            "extensions": [
                {
                    "type": "update_proposal_end_date",
                    "value": {"end_date": "2023-03-14T00:00:00"},
                }
            ],
            "permlink": "improve-ui",
            "proposal_id": 123,
            "subject": "Improve UI Design",
        },
    }

    # TODO: fix in wax problem with converting time to specyfic type
    #  E - 'value': {'end_date': '2023-03-14T00:00:00'}}],
    #  E         ?                          ---------
    #  E + 'value': {'end_date': '2023-03-14'}}],
    assert json.loads(transaction.to_api())["operations"][0] == expected


@pytest.mark.skip(reason="python version `update_proposal` not implemented")
@pytest.mark.describe("Should handle edge case in update proposal where end_date is given as timestamp")
def test_handles_update_proposal_with_timestamp_end_date(
    transaction: ITransaction,
) -> None:
    transaction.push_operation(
        operation=update_proposal(
            proposal_id=123,
            creator="alice",
            daily_pay={"amount": "1000", "precision": 3, "nai": "@@000000013"},
            subject="Improve UI Design",
            permlink="improve-ui",
            extensions=[
                # TODO: TypeError: bad argument type for built-in operation
                #  in TS test end_date is provided as int                                             ↓ ↓ ↓ ↓ ↓ ↓ ↓
                update_proposal_extension(update_proposal_end_date=update_proposal_end_date(end_date="1678917600000"))
            ],
        )
    )

    expected: Final[dict[str, Any]] = {
        "type": "update_proposal_operation",
        "value": {
            "creator": "alice",
            "daily_pay": {"amount": "1000", "nai": "@@000000013", "precision": 3},
            "extensions": [
                {
                    "type": "update_proposal_end_date",
                    "value": {"end_date": "2023-03-15T22:00:00"},
                }
            ],
            "permlink": "improve-ui",
            "proposal_id": 123,
            "subject": "Improve UI Design",
        },
    }

    # TODO: fix in wax problem with converting time to specyfic type
    #  E - 'pattern_value': {'end_date': '2023-03-15T22:00:00'}}],
    #  E ?                      -------- ^ ^ ^ ^ ^ ^
    #  E + 'wax_value':     {'end_date': '1678917600000'}}],
    #  problems:
    #  - update_proposal_end_date accept date only in string format
    #  - wax not converted "1678917600000" into date model
    #  - TypeError: bad argument type for built-in operation
    assert json.loads(transaction.to_api())["operations"][0] == expected


@pytest.mark.skip(reason="can't convert wax operation to legacy format, missing method `tx.toLegacyApi()")
@pytest.mark.describe("Should be able to convert transaction to legacy api with end_date property")
def test_convert_update_proposal_to_legacy_api_with_end_date(
    transaction: ITransaction,
) -> None:
    transaction.push_operation(
        operation=update_proposal(
            proposal_id=123,
            creator="alice",
            daily_pay={"amount": "1000", "precision": 3, "nai": "@@000000013"},
            subject="Improve UI Design",
            permlink="improve-ui",
            extensions=[
                update_proposal_extension(update_proposal_end_date=update_proposal_end_date(end_date="2023-03-14"))
            ],
        )
    )

    expected_in_legacy_format: Final[list[str | dict[str, Any]]] = [
        "update_proposal_operation",
        {
            "creator": "alice",
            "daily_pay": "1.000 HBD",
            "extensions": [[1, {"end_date": "2023-03-14T00:00:00"}]],
            "permlink": "improve-ui",
            "extensions": [],  # noqa: F601
            "proposal_id": 123,
            "subject": "Improve UI Design",
        },
    ]

    assert [message_to_dict_with_defaults(op) for op in transaction.transaction.operations] == expected_in_legacy_format


@pytest.mark.skip(reason="python version `update_proposal` not implemented")
@pytest.mark.describe("Should fail when invalid asset is provided")
def test_reject_invalid_asset_in_update_proposal_operation(wax: IWaxBaseInterface, transaction: ITransaction) -> None:
    # TODO: shouldn't by possible to create update_proposal object with wrong type of asset in daily_pay field
    with pytest.raises(WaxError) as error:
        transaction.push_operation(
            update_proposal(
                proposal_id=100,
                creator="initminer",
                daily_pay=wax.hive.satoshis(0),  # proposals daily pay should be give in HBD
                subject="subject",
                permlink="permlink",
                extensions=[],
            )
        )

    expected_message = (
        "Invalid asset provided: "
        + json.dumps({"amount": "0", "precision": 3, "nai": "@@000000021"})
        + '. Expected asset symbol(s): "@@000000013" (HBD) with precision: 3".'
    )

    assert expected_message in str(error.value.args)


@pytest.mark.describe(
    "Should be able to create an update proposal with underlying extensions using transaction interface"
)
def test_transaction_interface_handles_update_proposal_with_extensions(
    wax: IWaxBaseInterface, transaction: ITransaction
) -> None:
    transaction.push_operation(
        update_proposal(
            proposal_id=100,
            creator="initminer",
            daily_pay=wax.hbd.satoshis(0),
            subject="subject",
            permlink="permlink",
            extensions=[
                update_proposal_extension(
                    update_proposal_end_date=update_proposal_end_date(end_date="2023-08-01T15:38:48")
                )
            ],
        )
    )

    transaction.push_operation(
        update_proposal(
            proposal_id=100,
            creator="initminer",
            daily_pay=wax.hbd.satoshis(0),
            subject="subject",
            permlink="permlink",
            extensions=[],
        )
    )

    expected: Final[list[dict[str, Any]]] = [
        {
            "update_proposal_operation": {
                "creator": "initminer",
                "daily_pay": {"amount": "0", "nai": "@@000000013", "precision": 3},
                "permlink": "permlink",
                "subject": "subject",
                "proposal_id": "100",
                "extensions": [{"update_proposal_end_date": {"end_date": "2023-08-01T15:38:48"}}],
            }
        },
        {
            "update_proposal_operation": {
                "creator": "initminer",
                "daily_pay": {"amount": "0", "nai": "@@000000013", "precision": 3},
                "permlink": "permlink",
                "subject": "subject",
                "proposal_id": "100",
                "extensions": [],
            }
        },
    ]

    # TODO: repair this assert when transaction.from_proto_to_dict() will be available
    assert [message_to_dict_with_defaults(op) for op in transaction.transaction.operations] == expected


@pytest.mark.describe("UpdateProposalOperation.finalize")
def test_finalize_returns_correct_operation_with_date(wax: IWaxBaseInterface) -> None:
    # arrange
    end_date = datetime.datetime(2025, 10, 9, 12, 0, 0, tzinfo=datetime.timezone.utc)
    op = UpdateProposalOperation(
        UpdateProposalOperationData(
            proposal_id=1,
            creator="alice",
            daily_pay=wax.hbd.satoshis(1_000),
            subject="subject",
            permlink="permlink",
            end_date=end_date,
        )
    )

    expected: Final[dict[str, Any]] = {
        "creator": "alice",
        "proposal_id": "1",
        "daily_pay": {"amount": "1000", "precision": 3, "nai": "@@000000013"},
        "subject": "subject",
        "permlink": "permlink",
        "extensions": [{"update_proposal_end_date": {"end_date": "2025-10-09T12:00:00"}}],
    }

    # act
    result_iter = op.finalize(wax)
    result = list(result_iter)
    op_dict = message_to_dict_with_defaults(result[0])

    # assert
    assert len(result) == 1
    assert op_dict == expected


@pytest.mark.describe("UpdateProposalOperation.finalize")
def test_finalize_returns_correct_operation_without_date(
    wax: IWaxBaseInterface,
) -> None:
    # arrange
    op = UpdateProposalOperation(
        UpdateProposalOperationData(
            proposal_id=1,
            creator="alice",
            daily_pay=wax.hbd.satoshis(1_000),
            subject="subject",
            permlink="permlink",
        )
    )

    expected: Final[dict[str, Any]] = {
        "creator": "alice",
        "proposal_id": "1",
        "daily_pay": {"amount": "1000", "precision": 3, "nai": "@@000000013"},
        "subject": "subject",
        "permlink": "permlink",
        "extensions": [],
    }

    # act
    result_iter = op.finalize(wax)
    result = list(result_iter)
    op_dict = message_to_dict_with_defaults(result[0])

    # assert
    assert len(result) == 1
    assert op_dict == expected


@pytest.mark.describe("UpdateProposalOperation.finalize")
def test_operation_raises_unexpected_asset_type_error(wax: IWaxBaseInterface) -> None:
    # arrange
    op = UpdateProposalOperation(
        UpdateProposalOperationData(
            proposal_id=1,
            creator="alice",
            daily_pay=wax.hive.satoshis(1_000),
            subject="subject",
            permlink="permlink",
        )
    )
    # act & assert
    with pytest.raises(UnexpectedAssetTypeError):
        op.finalize(wax)


@pytest.mark.describe("UpdateProposalOperation.transaction")
def test_operation_add_to_transaction(transaction: ITransaction, wax: IWaxBaseInterface) -> None:
    # arrange
    transaction.transaction.expiration = TX_EXPIRATION
    op = UpdateProposalOperation(
        UpdateProposalOperationData(
            proposal_id=1,
            creator="alice",
            daily_pay=wax.hbd.satoshis(1_000),
            subject="subject",
            permlink="permlink",
        )
    )

    expected: Final[dict[str, Any]] = {
        "type": "update_proposal_operation",
        "value": {
            "creator": "alice",
            "daily_pay": {"amount": "1000", "nai": "@@000000013", "precision": 3},
            "extensions": [],
            "permlink": "permlink",
            "proposal_id": 1,
            "subject": "subject",
        },
    }

    # act
    transaction.push_operation(op)

    # assert
    assert transaction.to_dict()["operations"][0] == expected
