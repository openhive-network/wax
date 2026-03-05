from __future__ import annotations

import json
from typing import Final

from wax import operation_get_impacted_accounts, transaction_get_impacted_accounts
from wax_local_tools.refs import API_REF_TRANSACTION, API_REF_VOTE_OP

EXPECTED_TRANSACTION_IMPACTED_ACCOUNTS: Final[list[str]] = [
    API_REF_TRANSACTION["operations"][0]["value"]["author"],  # type: ignore[index]
    API_REF_TRANSACTION["operations"][0]["value"]["voter"],  # type: ignore[index]
]
EXPECTED_OPERATION_IMPACTED_ACCOUNTS: Final[list[str]] = [
    API_REF_VOTE_OP["value"]["author"],  # type: ignore[index]
    API_REF_VOTE_OP["value"]["voter"],  # type: ignore[index]
]


def test_operation_api_format_get_impacted_accounts() -> None:
    # ARRANGE
    vote_operation = API_REF_VOTE_OP

    # ACT
    impacted_accounts = operation_get_impacted_accounts(
        json.dumps(vote_operation)
    )

    # ASSERT
    assert [
        impacted_account for impacted_account in impacted_accounts
    ] == EXPECTED_OPERATION_IMPACTED_ACCOUNTS


def test_transaction_api_format_get_impacted_accounts() -> None:
    # ARRANGE
    transaction = API_REF_TRANSACTION

    # ACT
    impacted_accounts = transaction_get_impacted_accounts(
        json.dumps(transaction)
    )

    # ASSERT
    assert [
        impacted_account for impacted_account in impacted_accounts
    ] == EXPECTED_TRANSACTION_IMPACTED_ACCOUNTS
