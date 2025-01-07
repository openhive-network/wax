from __future__ import annotations

import json
from typing import Final

from beekeepy import Beekeeper
from schemas.operations.comment_operation import CommentOperation
from schemas.operations.vote_operation import VoteOperation
from wax import create_wax_foundation
from wax.proto.comment_pb2 import comment
from wax.proto.vote_pb2 import vote

EXPECTED_OPERATIONS_COUNT: Final[int] = 2
WALLET_NAME: Final[str] = "alice"
WALLET_PASSWORD: Final[str] = "password"
EXPECTED_IMPACTED_ACCOUNT: Final[str] = "alice"
EXPECTED_REQUIRED_AUTHORITIES: Final[set[str]] = {EXPECTED_IMPACTED_ACCOUNT}


def test_create_transaction() -> None:
    # ARRANGE
    wax = create_wax_foundation()

    # ACT
    transaction = wax.create_transaction_with_tapos("00000449f7860b82b4fbe2f317c670e9f01d6d9a")
    transaction.push_operation(
        comment(
            parent_permlink="/",
            parent_author="",
            author="alice",
            permlink="/",
            title="Best comment",
            body="<span>comment</span>",
            json_metadata="{}",
        )
    )
    transaction.push_operation(
        vote(
            voter="alice",
            author="alice",
            permlink="/",
            weight=10000,
        )
    )

    # ASSERT
    assert len(transaction.transaction.operations) == EXPECTED_OPERATIONS_COUNT


def test_create_and_sign_transaction() -> None:
    # ARRANGE
    wax = create_wax_foundation()
    keys = wax.suggest_brain_key()

    # ACT
    transaction = wax.create_transaction_with_tapos("00000449f7860b82b4fbe2f317c670e9f01d6d9a")
    transaction.push_operation(
        comment(
            parent_permlink="/",
            parent_author="",
            author="alice",
            permlink="/",
            title="Best comment",
            body="<span>comment</span>",
            json_metadata="{}",
        )
    )
    transaction.push_operation(
        vote(
            voter="alice",
            author="alice",
            permlink="/",
            weight=10000,
        )
    )

    with Beekeeper.factory() as beekeeper, beekeeper.create_session() as session, (
        session.create_wallet(name=WALLET_NAME, password=WALLET_PASSWORD)
        if WALLET_NAME not in [w.name for w in session.wallets_created]
        else session.open_wallet(name=WALLET_NAME).unlock(WALLET_PASSWORD)
    ) as wallet:
        wallet.import_key(private_key=keys.wif_private_key)
        transaction.sign(wallet=wallet, public_key=keys.associated_public_key)

    # ASSERT
    assert len(transaction.transaction.operations) == EXPECTED_OPERATIONS_COUNT
    assert transaction.is_signed

    impacted_accounts = transaction.impacted_accounts
    assert len(impacted_accounts) == 1
    assert impacted_accounts[0] == EXPECTED_IMPACTED_ACCOUNT

    assert transaction.required_authorities.posting_accounts == EXPECTED_REQUIRED_AUTHORITIES


def test_create_transaction_and_convert_to_api_format() -> None:
    # ARRANGE
    wax = create_wax_foundation()

    # ACT
    transaction = wax.create_transaction_with_tapos("00000449f7860b82b4fbe2f317c670e9f01d6d9a")
    transaction.push_operation(
        comment(
            parent_permlink="/",
            parent_author="",
            author="alice",
            permlink="/",
            title="Best comment",
            body="<span>comment</span>",
            json_metadata="{}",
        )
    )
    transaction.push_operation(
        vote(
            voter="alice",
            author="alice",
            permlink="/",
            weight=10000,
        )
    )
    api_format = json.loads(transaction.to_api_json())

    # ASSERT
    assert len(api_format["operations"]) == EXPECTED_OPERATIONS_COUNT
    CommentOperation(**api_format["operations"][0]["value"])
    VoteOperation(**api_format["operations"][1]["value"])
