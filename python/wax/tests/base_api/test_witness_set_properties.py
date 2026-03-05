from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Collection, Final

from wax.complex_operations.witness_set_properties import (
    HbdExchangeRate,
    WitnessSetProperties,
    WitnessSetPropertiesData,
)

if TYPE_CHECKING:
    from wax import ITransaction, IWaxBaseInterface


@dataclass
class WitnessesSigningKeys:
    gtg: str = "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh"
    therealwolf: str = "STM8kPZiPjyWBjmZVMEPW4Qh2BspKuvKMBjvh9dxpZL7Kv2MGBYzC"
    emrebeyler: str = "STM5ShFW6UPxDRyjG4mVWYiwVWTzkmfL2k7zYoamWz2yJLpEkycju"
    ctrpch: str = "STM5oxZMtLbjgnsZVY2XUi58wriYCF1KUNedCzut4ogNEA19GhbiU"
    guiltyparties: str = "STM5oxZMtLbjgnsZVY2XUi58wriYCF1KUNedCzut4ogNEA19GhbiU"


@dataclass
class WitnessesNewSigningKeys:
    gtg: str = "STM6TqSJaS1aRj6p6yZEo5xicX7bvLhrfdVqi5ToNrKxHU3FRBEdW"
    guiltyparties: str = "STM7FGmbPEooM5xbME7F2WUG41zGAh6WPzvHMQvTfABEHKfyuGUu7"


TX_EXPIRATION: Final[str] = "2023-11-09T21:51:27"


def assert_witness_set_properties_operation_structure(
    tx: ITransaction, expected_op: dict[str, str | Collection[str]]
) -> None:
    assert tx.to_dict()["operations"][0] == expected_op


def test_witness_set_properties_basic(wax: IWaxBaseInterface, transaction: ITransaction) -> None:
    # ARRANGE
    transaction.transaction.expiration = TX_EXPIRATION
    witness_set_properties_data = WitnessSetPropertiesData(
        owner="gtg",
        witness_signing_key=WitnessesSigningKeys.gtg,
        new_signing_key=WitnessesNewSigningKeys.gtg,
        account_creation_fee={"amount": "5000", "precision": 3, "nai": "@@000000021"},
        account_subsidy_budget=1000,
        account_subsidy_decay=1000,
        hbd_exchange_rate=HbdExchangeRate(base=wax.hbd.satoshis(1000), quote=wax.hive.satoshis(1000)),
        hbd_interest_rate=1000,
        maximum_block_size=1000,
        url="https://hive.io",
    )

    # ACT
    transaction.push_operation(WitnessSetProperties(witness_set_properties_data))

    # ASSERT
    expected_op = {
        "type": "witness_set_properties_operation",
        "value": {
            "extensions": [],
            "owner": "gtg",
            "props": [
                [
                    "account_creation_fee",
                    "88130000000000002320bcbe",
                ],
                [
                    "account_subsidy_budget",
                    "e8030000",
                ],
                [
                    "account_subsidy_decay",
                    "e8030000",
                ],
                [
                    "hbd_exchange_rate",
                    "e8030000000000000320bcbee8030000000000002320bcbe",
                ],
                [
                    "hbd_interest_rate",
                    "e803",
                ],
                [
                    "key",
                    "02472d6eb6d691b6de8b103b51ebdf4e128a523946d8cd03d6ded91b1497ee2e83",
                ],
                [
                    "maximum_block_size",
                    "e8030000",
                ],
                [
                    "new_signing_key",
                    "02cf69b1f999d133ebbe178a8b4bbf4da356b264dfdc843b1c740378bff8f65b33",
                ],
                [
                    "url",
                    "0f68747470733a2f2f686976652e696f",
                ],
            ],
        },
    }
    assert_witness_set_properties_operation_structure(transaction, expected_op)


def test_witness_set_properties_with_url(transaction: ITransaction) -> None:
    # ARRANGE
    transaction.transaction.expiration = TX_EXPIRATION
    witness_set_properties_data = WitnessSetPropertiesData(
        owner="therealwolf",
        witness_signing_key=WitnessesSigningKeys.therealwolf,
        url="https://steemit.com/steem/@therealwolf/witness-application-therealwolf-updated",
    )

    # ACT
    transaction.push_operation(WitnessSetProperties(witness_set_properties_data))

    # ASSERT
    expected_op = {
        "type": "witness_set_properties_operation",
        "value": {
            "extensions": [],
            "owner": "therealwolf",
            "props": [
                [
                    "key",
                    "03fc648d2ac16432f354acc1fe010a3c6567380e4939644deb7a74c6ebbe67da56",
                ],
                [
                    "url",
                    "4e68747470733a2f2f737465656d69742e636f6d2f737465656d2f407468657265616c776f6c662f7769746e6573732d6170706c69636174696f6e2d7468657265616c776f6c662d75706461746564",
                ],
            ],
        },
    }
    assert_witness_set_properties_operation_structure(transaction, expected_op)


def test_witness_set_properties_with_budget_and_account_fee(
    transaction: ITransaction,
) -> None:
    # ARRANGE
    transaction.transaction.expiration = TX_EXPIRATION
    witness_set_properties_data = WitnessSetPropertiesData(
        owner="therealwolf",
        witness_signing_key=WitnessesSigningKeys.therealwolf,
        account_creation_fee={"amount": "3000", "precision": 3, "nai": "@@000000021"},
        account_subsidy_budget=700,
    )

    # ACT
    transaction.push_operation(WitnessSetProperties(witness_set_properties_data))

    # ASSERT
    expected_op = {
        "type": "witness_set_properties_operation",
        "value": {
            "extensions": [],
            "owner": "therealwolf",
            "props": [
                [
                    "account_creation_fee",
                    "b80b0000000000002320bcbe",
                ],
                [
                    "account_subsidy_budget",
                    "bc020000",
                ],
                [
                    "key",
                    "03fc648d2ac16432f354acc1fe010a3c6567380e4939644deb7a74c6ebbe67da56",
                ],
            ],
        },
    }
    assert_witness_set_properties_operation_structure(transaction, expected_op)


def test_witness_set_properties_with_decay_and_budget(
    transaction: ITransaction,
) -> None:
    # ARRANGE
    transaction.transaction.expiration = TX_EXPIRATION
    witness_set_properties_data = WitnessSetPropertiesData(
        owner="emrebeyler",
        witness_signing_key=WitnessesSigningKeys.emrebeyler,
        account_subsidy_budget=1,
        account_subsidy_decay=64,
    )

    # ACT
    transaction.push_operation(WitnessSetProperties(witness_set_properties_data))

    # ASSERT
    expected_op = {
        "type": "witness_set_properties_operation",
        "value": {
            "extensions": [],
            "owner": "emrebeyler",
            "props": [
                [
                    "account_subsidy_budget",
                    "01000000",
                ],
                [
                    "account_subsidy_decay",
                    "40000000",
                ],
                [
                    "key",
                    "0249202c30b95aec7506ab719fd602256922b9ca86cc31e01499c4c6339c7292a3",
                ],
            ],
        },
    }
    assert_witness_set_properties_operation_structure(transaction, expected_op)


def test_witness_set_properties_with_exchange_rate(wax: IWaxBaseInterface, transaction: ITransaction) -> None:
    # ARRANGE
    transaction.transaction.expiration = TX_EXPIRATION
    witness_set_properties_data = WitnessSetPropertiesData(
        owner="ctrpch",
        witness_signing_key=WitnessesSigningKeys.ctrpch,
        hbd_exchange_rate=HbdExchangeRate(base=wax.hbd.satoshis(424), quote=wax.hive.satoshis(1000)),
    )

    # ACT
    transaction.push_operation(WitnessSetProperties(witness_set_properties_data))

    # ASSERT
    expected_op = {
        "type": "witness_set_properties_operation",
        "value": {
            "extensions": [],
            "owner": "ctrpch",
            "props": [
                [
                    "hbd_exchange_rate",
                    "a8010000000000000320bcbee8030000000000002320bcbe",
                ],
                [
                    "key",
                    "0279687479456e2f03ca19adab071ba333acb765f83402357e71f5cd8c49bee21b",
                ],
            ],
        },
    }
    assert_witness_set_properties_operation_structure(transaction, expected_op)


def test_witness_set_properties_with_all_parameters(wax: IWaxBaseInterface, transaction: ITransaction) -> None:
    # ARRANGE
    transaction.transaction.expiration = TX_EXPIRATION
    witness_set_properties_data = WitnessSetPropertiesData(
        owner="guiltyparties",
        witness_signing_key=WitnessesSigningKeys.guiltyparties,
        new_signing_key=WitnessesNewSigningKeys.guiltyparties,
        account_creation_fee={"amount": "3000", "precision": 3, "nai": "@@000000021"},
        account_subsidy_budget=10000,
        account_subsidy_decay=3307750,
        hbd_exchange_rate=HbdExchangeRate(base=wax.hbd.satoshis(867), quote=wax.hive.satoshis(1000)),
        hbd_interest_rate=0,
        maximum_block_size=65536,
        url="https://guiltyparties.com",
    )

    # ACT
    transaction.push_operation(WitnessSetProperties(witness_set_properties_data))

    # ASSERT
    expected_op = {
        "type": "witness_set_properties_operation",
        "value": {
            "extensions": [],
            "owner": "guiltyparties",
            "props": [
                [
                    "account_creation_fee",
                    "b80b0000000000002320bcbe",
                ],
                ["account_subsidy_budget", "10270000"],
                ["account_subsidy_decay", "e6783200"],
                [
                    "hbd_exchange_rate",
                    "63030000000000000320bcbee8030000000000002320bcbe",
                ],
                ["hbd_interest_rate", "0000"],
                [
                    "key",
                    "0279687479456e2f03ca19adab071ba333acb765f83402357e71f5cd8c49bee21b",
                ],
                ["maximum_block_size", "00000100"],
                [
                    "new_signing_key",
                    "033695262a25cd5646f7875db0536db3f1b3439d7c86274ec56cce01d91ab6611b",
                ],
                ["url", "1968747470733a2f2f6775696c7479706172746965732e636f6d"],
            ],
        },
    }
    assert_witness_set_properties_operation_structure(transaction, expected_op)
