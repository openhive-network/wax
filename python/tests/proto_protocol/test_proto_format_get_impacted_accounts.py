import json
from typing import Final

from tests.utils.refs import PROTO_REF_VOTE_OP, PROTO_REF_TRANSACTION

from wax import proto_transaction_get_impacted_accounts, proto_operation_get_impacted_accounts

EXPECTED_OPERATION_IMPACTED_ACCOUNTS: Final[list[str]] = [
    PROTO_REF_VOTE_OP["vote_operation"]["author"],
    PROTO_REF_VOTE_OP["vote_operation"]["voter"],
]

EXPECTED_TRANSACTION_IMPACTED_ACCOUNTS: Final[list[str]] = [
    PROTO_REF_TRANSACTION["operations"][0]["vote_operation"]["author"],
    PROTO_REF_TRANSACTION["operations"][0]["vote_operation"]["voter"],
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


