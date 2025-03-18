from __future__ import annotations

import json
from typing import TYPE_CHECKING, Any, Final

import pytest

from wax.proto.authority import authority
from wax.proto.operations import operation, recover_account, vote

if TYPE_CHECKING:
    from wax.interfaces import IWaxBaseInterface
    from wax.models.operations import Operation


AUTHORITY_1: Final[authority] = authority(
    weight_threshold=1,
    account_auths={"account": 1, "account1": 2},
    key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1},
)
AUTHORITY_2: Final[authority] = authority(
    weight_threshold=1,
    account_auths={"account1": 1, "account2": 2},
    key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1},
)
RECOVER_ACCOUNT: Final[recover_account] = recover_account(
    account_to_recover="account", new_owner_authority=AUTHORITY_1, recent_owner_authority=AUTHORITY_2, extensions=[]
)

PROTO_OPERATION: Final[operation] = operation(recover_account=RECOVER_ACCOUNT)
API_OPERATION_DICT: Final[dict[str, Any]] = {
    "type": "claim_reward_balance_operation",
    "value": {
        "account": "account",
        "reward_hive": {"amount": "0", "precision": 3, "nai": "@@000000021"},
        "reward_hbd": {"amount": "0", "precision": 3, "nai": "@@000000013"},
        "reward_vests": {"amount": "1", "precision": 6, "nai": "@@000000037"},
    },
}
API_OPERATION_JSON: Final[str] = json.dumps(API_OPERATION_DICT)

EXPECTED_IMPACTED_ACCOUNT: Final[str] = "account"
EXPECTED_AMOUNT_OF_IMPACTED_ACCOUNTS: Final[int] = 1


@pytest.mark.parametrize("operation", [PROTO_OPERATION, API_OPERATION_DICT, API_OPERATION_JSON])
def test_operation_get_impacted_accounts(wax: IWaxBaseInterface, operation: Operation) -> None:
    # ACT
    result = wax.get_operation_impacted_accounts(operation)

    # ASSERT
    assert len(result) == EXPECTED_AMOUNT_OF_IMPACTED_ACCOUNTS
    assert result[0] == EXPECTED_IMPACTED_ACCOUNT


@pytest.mark.description("Should be able to get impacted accounts from example api operation")
def test_get_operation_impacted_accounts_0(wax: IWaxBaseInterface) -> None:
    result = wax.get_operation_impacted_accounts(
        operation={
            "type": "vote_operation",
            "value": {"voter": "otom", "author": "c0ff33a", "permlink": "ewxhnjbj", "weight": 2200},
        }
    )

    assert result == ["c0ff33a", "otom"]


@pytest.mark.description("Should be able to get impacted accounts from example proto operation")
def test_get_operation_impacted_accounts_1(wax: IWaxBaseInterface) -> None:
    result = wax.get_operation_impacted_accounts(
        operation=operation(
            vote=vote(
                author="c0ff33a",
                permlink="ewxhnjbj",
                voter="otom",
                weight=2200,
            )
        )
    )

    assert result == ["c0ff33a", "otom"]
