"""
Test that API error responses produce the same exceptions as C++/Python layer validation.

This test verifies that when a transaction with an invalid account name is:
1. Validated locally via C++/Python layer (validate_transaction)
2. Rejected by hived via the broadcast API

...both paths produce the same WaxProtocolAccountNameAssertionError exception type
with equivalent category, subject_type, and assert_hash.
"""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from typing import Any

import pytest

import wax
from wax import IHiveChainInterface, validate_transaction
from wax._private.api.models import ApiTransaction
from wax.exceptions import WaxAssertionError, WaxProtocolAccountNameAssertionError
from wax.proto.operations import transfer

HIVE_NAI = "@@000000021"


def _build_invalid_account_transaction() -> dict[str, Any]:
    """Build an API-format transaction containing a transfer with an invalid (too short) account name."""
    return {
        "ref_block_num": 19260,
        "ref_block_prefix": 2140466769,
        "expiration": (datetime.now(tz=timezone.utc) + timedelta(seconds=60)).strftime("%Y-%m-%dT%H:%M:%S"),
        "operations": [
            {
                "type": "transfer_operation",
                "value": {
                    "from": "a",
                    "to": "initminer",
                    "amount": {"nai": HIVE_NAI, "precision": 3, "amount": "100"},
                    "memo": "",
                },
            }
        ],
        "extensions": [],
        "signatures": [],
    }


class TestCppLayerValidation:
    """Verify that validate_transaction catches invalid account names via C++/Python layer."""

    def test_validate_transaction_rejects_short_account_name(self) -> None:
        tx = _build_invalid_account_transaction()

        with pytest.raises(WaxProtocolAccountNameAssertionError) as exc:
            validate_transaction(json.dumps(tx))

        assert exc.value.category == "protocol"
        assert exc.value.subject_type == "account_name"
        assert exc.value.assert_hash

    def test_transaction_validate_rejects_short_account_name(self) -> None:
        """Transaction.validate() validates through C++ and should raise the same exception."""
        foundation = wax.create_wax_foundation()
        tx = foundation.create_transaction_with_tapos(tapos_block_id="0000000000000000000000000000000000000000")
        tx.push_operation(
            transfer(
                from_account="a",
                to_account="initminer",
                amount=foundation.hive.coins(100),
                memo="",
            )
        )

        with pytest.raises(WaxProtocolAccountNameAssertionError) as exc:
            tx.validate()

        assert exc.value.category == "protocol"
        assert exc.value.subject_type == "account_name"


class TestApiExceptionParity:
    """Verify that API error responses produce the same exception types as local C++ validation."""

    async def test_broadcast_rejects_invalid_account_name_same_as_local_validation(
        self, remote_chain: IHiveChainInterface
    ) -> None:
        """Compare exceptions from push_operation (C++) and broadcast (API) paths."""
        # --- Path 1: C++/Python layer validation ---
        cpp_exception: WaxAssertionError | None = None
        tx_dict = _build_invalid_account_transaction()
        try:
            validate_transaction(json.dumps(tx_dict))
        except WaxProtocolAccountNameAssertionError as ex:
            cpp_exception = ex

        assert cpp_exception is not None, "C++ layer should raise WaxProtocolAccountNameAssertionError"

        # --- Path 2: API broadcast ---
        # push_operation validates through C++ and will raise the same exception locally.
        # We also catch it and compare.
        api_exception: WaxAssertionError | None = None
        try:
            transaction = await remote_chain.create_transaction()
            transaction.push_operation(
                transfer(
                    from_account="a",
                    to_account="initminer",
                    amount=remote_chain.hive.coins(100),
                    memo="",
                )
            )
            await remote_chain.broadcast(transaction)
        except WaxProtocolAccountNameAssertionError as ex:
            api_exception = ex

        assert api_exception is not None, "API path should raise WaxProtocolAccountNameAssertionError"

        # --- Compare both exceptions ---
        assert type(cpp_exception) is type(api_exception)
        assert cpp_exception.category == api_exception.category
        assert cpp_exception.subject_type == api_exception.subject_type
        assert cpp_exception.assert_hash == api_exception.assert_hash

    async def test_broadcast_raw_transaction_with_invalid_account(self, remote_chain: IHiveChainInterface) -> None:
        """
        Bypass push_operation validation by sending a raw transaction dict to the API.

        This exercises the full network path: hived validates and returns a structured
        error, WaxOverseer parses it via resolve_exception(), same exception type is raised.
        """
        # Build a raw transaction with valid tapos from the chain but an invalid account name.
        # We need valid tapos/expiration so hived reaches the account name validation step.
        template_tx = await remote_chain.create_transaction()
        tx_dict = template_tx.to_dict()
        tx_dict["operations"] = [
            {
                "type": "transfer_operation",
                "value": {
                    "from": "a",
                    "to": "initminer",
                    "amount": {"nai": HIVE_NAI, "precision": 3, "amount": "100"},
                    "memo": "",
                },
            }
        ]

        # Capture the C++ layer exception for comparison
        cpp_exception: WaxAssertionError | None = None
        try:
            validate_transaction(json.dumps(tx_dict))
        except WaxProtocolAccountNameAssertionError as ex:
            cpp_exception = ex

        assert cpp_exception is not None

        # Send raw transaction directly through the API (bypasses push_operation)
        api_exception: WaxAssertionError | None = None
        try:
            internal_api = remote_chain.api
            await internal_api.network_broadcast_api.broadcast_transaction(
                trx=ApiTransaction(**tx_dict), max_block_age=-1
            )
        except WaxProtocolAccountNameAssertionError as ex:
            api_exception = ex

        assert api_exception is not None, (
            "Broadcasting a transaction with invalid account name should raise "
            "WaxProtocolAccountNameAssertionError from the API path"
        )

        # Both paths should produce equivalent exceptions
        assert type(cpp_exception) is type(api_exception)
        assert cpp_exception.category == api_exception.category
        assert cpp_exception.subject_type == api_exception.subject_type
        assert cpp_exception.assert_hash == api_exception.assert_hash
