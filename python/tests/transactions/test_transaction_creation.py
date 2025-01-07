from __future__ import annotations

import json
from typing import Final

from beekeepy import Beekeeper
from wax import create_wax_foundation
from wax.proto.comment_pb2 import comment
from wax.proto.operation_pb2 import operation
from wax.proto.transfer_pb2 import transfer
from wax.proto.vote_pb2 import vote

WALLET_NAME: Final[str] = "alice"
WALLET_PASSWORD: Final[str] = "password"
TAPOS: Final[str] = "00000449f7860b82b4fbe2f317c670e9f01d6d9a"

EXPECTED_OPERATIONS_COUNT: Final[int] = 2
EXPECTED_IMPACTED_ACCOUNT: Final[str] = "alice"
EXPECTED_IMPACTED_ACCOUNT_2: Final[str] = "bob"
EXPECTED_REQUIRED_AUTHORITIES: Final[set[str]] = {EXPECTED_IMPACTED_ACCOUNT}


def test_create_transaction() -> None:
    # ARRANGE
    wax = create_wax_foundation()

    # ACT
    transaction = wax.create_transaction_with_tapos(TAPOS)
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
    transaction = wax.create_transaction_with_tapos(TAPOS)
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
    transaction = wax.create_transaction_with_tapos(TAPOS)
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
    api_format = json.loads(transaction.to_api())

    # ASSERT
    assert len(api_format["operations"]) == EXPECTED_OPERATIONS_COUNT


def test_signature_key_the_same_as_key_used_to_sign() -> None:
    # ARRANGE
    wax = create_wax_foundation()

    # ACT
    transaction = wax.create_transaction_with_tapos(TAPOS)
    transaction.push_operation(transfer(from_account="alice", to_account="bob", amount=wax.hive.coins(1), memo=""))

    brain_key_data = wax.suggest_brain_key()
    public_key, private_key = brain_key_data.associated_public_key, brain_key_data.wif_private_key

    with Beekeeper.factory() as beekeeper, beekeeper.create_session() as session, (
        session.create_wallet(name=WALLET_NAME, password=WALLET_PASSWORD)
        if WALLET_NAME not in [w.name for w in session.wallets_created]
        else session.open_wallet(name=WALLET_NAME).unlock(WALLET_PASSWORD)
    ) as wallet:
        wallet.import_key(private_key=private_key)
        transaction.sign(wallet, public_key)

    # ASSERT
    assert transaction.signature_keys[0] == public_key


def test_impacted_operation_accounts_the_same_as_impacted_transaction_accounts() -> None:
    # ARRANGE
    wax = create_wax_foundation()

    # ACT
    transaction = wax.create_transaction_with_tapos(TAPOS)
    transfer_operation = transfer(
        from_account=EXPECTED_IMPACTED_ACCOUNT,
        to_account=EXPECTED_IMPACTED_ACCOUNT_2,
        amount=wax.hive.coins(1),
        memo="",
    )
    transaction.push_operation(transfer_operation)

    operation_impacted_accounts = wax.get_operation_impacted_accounts(operation(transfer=transfer_operation))
    transaction_impacted_accounts = transaction.impacted_accounts

    # ASSERT
    assert operation_impacted_accounts == transaction_impacted_accounts
