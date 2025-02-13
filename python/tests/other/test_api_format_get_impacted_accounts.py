from __future__ import annotations

import json
from typing import Final

from wax import operation_get_impacted_accounts, transaction_get_impacted_accounts
from utils.refs import API_REF_VOTE_OP, API_REF_TRANSACTION

EXPECTED_TRANSACTION_IMPACTED_ACCOUNTS: Final[list[str]] = [
    API_REF_TRANSACTION["operations"][0]["value"]["author"],
    API_REF_TRANSACTION["operations"][0]["value"]["voter"],
]
EXPECTED_OPERATION_IMPACTED_ACCOUNTS: Final[list[str]] = [
    API_REF_VOTE_OP["value"]["author"],
    API_REF_VOTE_OP["value"]["voter"],
]


def test_operation_api_format_get_impacted_accounts() -> None:
    # ARRANGE
    vote_operation = API_REF_VOTE_OP

    # ACT
    impacted_accounts = operation_get_impacted_accounts(
        json.dumps(vote_operation).encode()
    )

    # ASSERT
    assert [
        impacted_account.decode() for impacted_account in impacted_accounts
    ] == EXPECTED_OPERATION_IMPACTED_ACCOUNTS


def test_transaction_api_format_get_impacted_accounts() -> None:
    # ARRANGE
    transaction = API_REF_TRANSACTION

    # ACT
    impacted_accounts = transaction_get_impacted_accounts(
        json.dumps(transaction).encode()
    )

    # ASSERT
    assert [
        impacted_account.decode() for impacted_account in impacted_accounts
    ] == EXPECTED_TRANSACTION_IMPACTED_ACCOUNTS
