import json
from typing import Any, Final, cast

from tests.wax.utils.refs import PROTO_REF_VOTE_OP, PROTO_REF_TRANSACTION

from wax import proto_transaction_get_impacted_accounts, proto_operation_get_impacted_accounts

_vote_op = cast(dict[str, str], PROTO_REF_VOTE_OP["vote_operation"])
EXPECTED_OPERATION_IMPACTED_ACCOUNTS: Final[list[str]] = [
    _vote_op["author"],
    _vote_op["voter"],
]

_tx_ops = cast(list[dict[str, Any]], PROTO_REF_TRANSACTION["operations"])
_tx_vote_op = cast(dict[str, str], _tx_ops[0]["vote_operation"])
EXPECTED_TRANSACTION_IMPACTED_ACCOUNTS: Final[list[str]] = [
    _tx_vote_op["author"],
    _tx_vote_op["voter"],
]


def test_proto_operation_get_impacted_accounts():
    # ARRANGE
    vote_operation = PROTO_REF_VOTE_OP

    # ACT
    impacted_accounts = proto_operation_get_impacted_accounts(json.dumps(vote_operation).encode())

    # ASSERT
    assert [
        impacted_account.decode() for impacted_account in impacted_accounts
    ] == EXPECTED_OPERATION_IMPACTED_ACCOUNTS, "Returned account should be one of the ones used in operation."


def test_proto_transaction_get_impacted_accounts():
    # ARRANGE
    transaction = PROTO_REF_TRANSACTION

    # ACT
    impacted_accounts = proto_transaction_get_impacted_accounts(json.dumps(transaction).encode())

    # ASSERT
    assert [
        impacted_account.decode() for impacted_account in impacted_accounts
    ] == EXPECTED_TRANSACTION_IMPACTED_ACCOUNTS, "Returned account should be one of the ones used in transaction."
