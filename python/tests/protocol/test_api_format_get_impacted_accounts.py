from __future__ import annotations

import json
from typing import Any, Final, cast

from wax import operation_get_impacted_accounts, transaction_get_impacted_accounts
from tests.utils.refs import API_REF_VOTE_OP, API_REF_TRANSACTION

_tx_ops = cast(list[dict[str, Any]], API_REF_TRANSACTION["operations"])
_tx_value = cast(dict[str, Any], _tx_ops[0]["value"])
EXPECTED_TRANSACTION_IMPACTED_ACCOUNTS: Final[list[str]] = [
    cast(str, _tx_value["author"]),
    cast(str, _tx_value["voter"]),
]
_vote_value = cast(dict[str, Any], API_REF_VOTE_OP["value"])
EXPECTED_OPERATION_IMPACTED_ACCOUNTS: Final[list[str]] = [
    cast(str, _vote_value["author"]),
    cast(str, _vote_value["voter"]),
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
