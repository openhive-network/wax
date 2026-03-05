from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Final

import pytest

if TYPE_CHECKING:
    from beekeepy import AsyncUnlockedWallet
    from wax.interfaces import IWaxBaseInterface

from wax._private.models.hive_date_time import HiveDateTime
from wax.proto.operations import operation, recurrent_transfer, vote
from wax.proto.transaction import transaction
from wax_local_tools.templates import (
    RECOVER_ACCOUNT_TRANSACTION,
    REQUIRED_ACTIVE_AUTHORITY_TRANSACTION,
    REQUIRED_OWNER_AUTHORITY_TRANSACTION,
    SIGNATURE_TRANSACTION,
)


@pytest.mark.describe("Should be able to create TAPOS transaction using implicit expiration time")
async def test_transaction_processing_0(wallet: AsyncUnlockedWallet, wax: IWaxBaseInterface) -> None:
    await wallet.import_keys(private_keys=["5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT"])

    tx = wax.create_transaction_with_tapos("04c1c7a566fc0da66aee465714acee7346b48ac2")

    now = HiveDateTime.now()

    tx.push_operation(
        vote(
            author="c0ff33a",
            permlink="ewxhnjbj",
            voter="otom",
            weight=2200,
        )
    ).validate()

    await tx.sign(wallet, "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh")

    expiration = HiveDateTime.fromisoformat(tx.transaction.expiration)

    assert len(tx.signature_keys) == 1
    assert tx.signature_keys[0] == "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh"
    assert now < expiration


@pytest.mark.describe("Should be able to bidirectional convert api to proto using object interface")
def test_transaction_processing_1(wax: IWaxBaseInterface) -> None:
    tx = transaction(
        ref_block_num=34559,
        ref_block_prefix=1271006404,
        expiration="2021-12-13T11:31:33",
        operations=[
            operation(
                vote_operation=vote(
                    author="c0ff33a",
                    permlink="ewxhnjbj",
                    voter="otom",
                    weight=2200,
                )
            )
        ],
    )

    tx_as_json = wax.create_transaction_from_proto(tx).to_api_json()

    assert (
        wax.create_transaction_from_json(tx_as_json).to_binary_form()
        == wax.create_transaction_from_proto(tx).to_binary_form()
    )


@pytest.mark.describe("Should be able to create and sign transaction using object interface")
async def test_transaction_processing_2(wallet: AsyncUnlockedWallet, wax: IWaxBaseInterface) -> None:
    await wallet.import_key(private_key="5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT")

    tx = wax.create_transaction_with_tapos(
        "04c1c7a566fc0da66aee465714acee7346b48ac2",
        expiration=HiveDateTime.fromisoformat("2023-08-01T15:38:48").replace(tzinfo=timezone.utc),
    )
    tx.push_operation(
        vote(
            author="c0ff33a",
            permlink="ewxhnjbj",
            voter="otom",
            weight=2200,
        )
    ).validate()

    signature = await tx.sign(wallet, "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh")

    assert (
        signature == "1f7f0c3e89e6ccef1ae156a96fb4255e619ca3a73ef3be46746b4b40a6"
        "6cc4252070eb313cc6308bbee39a0a9fc38ef99137ead3c9b003584c0a1b8f5ca2ff8707"
    )
    assert tx.sig_digest == "205c79e3d17211882b1a2ba8640ff208413d68cabdca892cf47e9a6ad46e63a1"
    assert len(tx.signature_keys) == 1
    assert tx.signature_keys[0] == "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh"


@pytest.mark.describe("Should be able to binary serialize signed transaction using object interface")
async def test_transaction_processing_3(wallet: AsyncUnlockedWallet, wax: IWaxBaseInterface) -> None:
    await wallet.import_key(private_key="5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT")

    tx = wax.create_transaction_with_tapos(
        "04c1c7a566fc0da66aee465714acee7346b48ac2",
        expiration=HiveDateTime.fromisoformat("2023-08-01T15:38:48").replace(tzinfo=timezone.utc),
    )

    tx.push_operation(
        vote(
            author="c0ff33a",
            permlink="ewxhnjbj",
            voter="otom",
            weight=2200,
        )
    )

    tx.push_operation(
        recurrent_transfer(
            from_account="initminer",
            to_account="gtg",
            amount=wax.hive.satoshis(100),
            recurrence=24,
            executions=2,
            memo="",
        )
    )

    signature = await tx.sign(wallet, "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh")

    assert signature == (
        "1f7c6eb7a30681d77606a1491be2869e8112fee5241ec13cea5c7b4f54edc8d14"
        "5269172f88359bb190fb26b362c81ccdf02bb56eb1d09daea3a381e5580e52f58"
    )
    assert tx.sig_digest == "d07a8509795ff7c6f33ab7d6f4da24044e8f5833f0dffcd357bf21ba5e4db1d9"
    assert len(tx.signature_keys) == 1
    assert tx.signature_keys[0] == "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh"
    assert tx.to_binary_form() == (
        "a5c766fc0da60827c9640200046f746f6d076330666633336108657778686e6a626a98083109696e69746d696e"
        "65720367746764000000000000002320bcbe00180002000000011f7c6eb7a30681d77606a1491be2869e8112fe"
        "e5241ec13cea5c7b4f54edc8d145269172f88359bb190fb26b362c81ccdf02bb56eb1d09daea3a381e5580e52f58"
    )


@pytest.mark.describe("Should be able to convert transaction json to binary form")
def test_transaction_processing_4(wax: IWaxBaseInterface) -> None:
    tx = wax.create_transaction_from_proto(
        transaction=transaction(
            ref_block_num=34559,
            ref_block_prefix=1271006404,
            expiration="2021-12-13T11:31:33",
            operations=[
                operation(
                    vote_operation=vote(
                        author="c0ff33a",
                        permlink="ewxhnjbj",
                        voter="otom",
                        weight=2200,
                    )
                )
            ],
        )
    )

    assert tx.to_binary_form() == "ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000"


@pytest.mark.describe("Should be able to sign the transaction twice")
async def test_transaction_processing_5(wallet: AsyncUnlockedWallet, wax: IWaxBaseInterface) -> None:
    key = (await wallet.import_keys(private_keys=["5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT"]))[0]
    other_key = (await wallet.import_keys(private_keys=["5KXNQP5feaaXpp28yRrGaFeNYZT7Vrb1PqLEyo7E3pJiG1veLKG"]))[0]

    tx = wax.create_transaction_with_tapos(
        "04c1c7a566fc0da66aee465714acee7346b48ac2",
        expiration=datetime.fromisoformat("2023-08-01T15:38:48").replace(tzinfo=timezone.utc),
    )

    tx.push_operation(
        vote(
            voter="otom",
            author="c0ff33a",
            permlink="ewxhnjbj",
            weight=2200,
        )
    )

    assert (
        await tx.sign(wallet, key) == "1f7f0c3e89e6ccef1ae156a96fb4255e619ca3a73ef3be46746b4"
        "b40a66cc4252070eb313cc6308bbee39a0a9fc38ef99137ead3c9b003584c0a1b8f5ca2ff8707"
    )
    assert (
        await tx.sign(wallet, other_key) == "209e2e371495ae731486c46cad62786ebb4260a54e558c4139"
        "3e4ee681047ee07b5f476133d1100e08a6b88220c62c372789efbeb17d465d1c65efb0e23f8f1e0b"
    )


@pytest.mark.describe("Should be able to sign the transaction twice on different transaction instances")
async def test_transaction_processing_6(wallet: AsyncUnlockedWallet, wax: IWaxBaseInterface) -> None:
    key = (await wallet.import_keys(private_keys=["5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT"]))[0]
    other_key = (await wallet.import_keys(private_keys=["5KXNQP5feaaXpp28yRrGaFeNYZT7Vrb1PqLEyo7E3pJiG1veLKG"]))[0]

    tx = wax.create_transaction_with_tapos(
        "04c1c7a566fc0da66aee465714acee7346b48ac2",
        expiration=datetime.fromisoformat("2023-08-01T15:38:48").replace(tzinfo=timezone.utc),
    )

    tx.push_operation(
        vote(
            voter="otom",
            author="c0ff33a",
            permlink="ewxhnjbj",
            weight=2200,
        )
    )

    assert (
        await tx.sign(wallet, key) == "1f7f0c3e89e6ccef1ae156a96fb4255e619ca3a73ef3be46746b4"
        "b40a66cc4252070eb313cc6308bbee39a0a9fc38ef99137ead3c9b003584c0a1b8f5ca2ff8707"
    )

    json_tx = wax.create_transaction_from_json(tx.to_api_json())
    assert (
        await json_tx.sign(wallet, other_key) == "209e2e371495ae731486c46cad62786ebb4260a54e558c4"
        "1393e4ee681047ee07b5f476133d1100e08a6b88220c62c372789efbeb17d465d1c65efb0e23f8f1e0b"
    )


@pytest.mark.describe("Should be able to get transaction required posting authority")
def test_transaction_processing_7(wax: IWaxBaseInterface) -> None:
    tx = wax.create_transaction_from_json(json.dumps(SIGNATURE_TRANSACTION))

    req_auths = tx.required_authorities

    assert next(iter(req_auths.posting_accounts)) == "thatcryptodave"
    assert len(req_auths.posting_accounts) == 1

    assert len(req_auths.owner_accounts) == 0
    assert len(req_auths.active_accounts) == 0
    assert len(req_auths.other_authorities) == 0


@pytest.mark.describe("Should be able to get transaction required active authority")
def test_transaction_processing_8(wax: IWaxBaseInterface) -> None:
    tx = wax.create_transaction_from_json(json.dumps(REQUIRED_ACTIVE_AUTHORITY_TRANSACTION))

    req_auths = tx.required_authorities

    assert next(iter(req_auths.active_accounts)) == "droida"
    assert len(req_auths.active_accounts) == 1

    assert len(req_auths.owner_accounts) == 0
    assert len(req_auths.posting_accounts) == 0
    assert len(req_auths.other_authorities) == 0


@pytest.mark.describe("Should be able to get transaction required owner authority")
def test_transaction_processing_9(wax: IWaxBaseInterface) -> None:
    tx = wax.create_transaction_from_json(json.dumps(REQUIRED_OWNER_AUTHORITY_TRANSACTION))

    req_auths = tx.required_authorities

    assert next(iter(req_auths.owner_accounts)) == "vsc.gateway"
    assert len(req_auths.owner_accounts) == 1

    assert len(req_auths.active_accounts) == 0
    assert len(req_auths.posting_accounts) == 0
    assert len(req_auths.other_authorities) == 0


@pytest.mark.describe(
    "Should be able to get transaction required authorities for transaction with recover_account_operation"
)
def test_transaction_processing_10(wax: IWaxBaseInterface) -> None:
    tx = wax.create_transaction_from_json(json.dumps(RECOVER_ACCOUNT_TRANSACTION))

    req_auths = tx.required_authorities

    expected_otger_authorities: Final[int] = 2
    assert len(req_auths.other_authorities) == expected_otger_authorities
    assert req_auths.other_authorities[0].key_auths == {"STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW": 1}
    assert req_auths.other_authorities[1].key_auths == {"STM4wJYLcRnALfbpb4ziqiH3oLEgw9PTJZTBBj8goFyjta3mm6D1s": 1}
    assert len(req_auths.owner_accounts) == 0
    assert len(req_auths.posting_accounts) == 0
    assert len(req_auths.active_accounts) == 0
