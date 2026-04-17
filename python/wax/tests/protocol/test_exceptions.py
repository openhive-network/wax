from __future__ import annotations

import json

import pytest

import wax
from wax.exceptions import (
    WaxAssertionError,
    WaxInvalidAccountNameException,
    WaxInvalidAssetException,
    WaxProtocolAssertionError,
    WaxProtocolNumberAssertionError,
    WaxProtocolStringAssertionError,
)

# NAI constants
HIVE_NAI = "@@000000021"
HBD_NAI = "@@000000013"
VESTS_NAI = "@@000000037"


def _hive(amount: str) -> dict:
    return {"nai": HIVE_NAI, "precision": 3, "amount": amount}


def _hbd(amount: str) -> dict:
    return {"nai": HBD_NAI, "precision": 3, "amount": amount}


def _vests(amount: str) -> dict:
    return {"nai": VESTS_NAI, "precision": 6, "amount": amount}


def _op(op_type: str, value: dict) -> str:
    return json.dumps({"type": op_type, "value": value})


# ---------------------------------------------------------------------------
# Hierarchy tests — verify that subclasses are catchable by parent types
# ---------------------------------------------------------------------------


def test_user_facing_exception_catchable_as_base() -> None:
    """User-facing exceptions (e.g. WaxInvalidAccountNameException) are catchable as WaxAssertionError."""
    invalid_op = _op(
        "transfer_operation",
        {
            "from": "in",
            "to": "alpha",
            "amount": _hive("10"),
            "memo": "test",
        },
    )

    with pytest.raises(WaxAssertionError):
        wax.validate_operation(invalid_op)


def test_protocol_exception_hierarchy() -> None:
    """Protocol-specific assertions (e.g. number, string) are still catchable as WaxProtocolAssertionError."""
    op = _op(
        "vote_operation",
        {
            "voter": "initminer",
            "author": "alpha",
            "permlink": "test-post",
            "weight": 10001,
        },
    )

    with pytest.raises(WaxProtocolAssertionError):
        wax.validate_operation(op)


# ---------------------------------------------------------------------------
# subject_type: "account_name" — HIVE_PROTOCOL_ACCOUNT_NAME_ASSERT
# ---------------------------------------------------------------------------


class TestProtocolAccountNameAssertions:
    """Tests for operations that trigger HIVE_PROTOCOL_ACCOUNT_NAME_ASSERT."""

    def test_account_name_too_short(self) -> None:
        """Account name shorter than HIVE_MIN_ACCOUNT_NAME_LENGTH (3)."""
        op = _op(
            "transfer_operation",
            {
                "from": "in",
                "to": "alpha",
                "amount": _hive("10"),
                "memo": "",
            },
        )

        with pytest.raises(WaxInvalidAccountNameException) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"
        assert exc.value.subject_type == "account_name"

    def test_account_name_too_long(self) -> None:
        """Account name longer than HIVE_MAX_ACCOUNT_NAME_LENGTH (16)."""
        op = _op(
            "transfer_operation",
            {
                "from": "abcdefghijklmnopqrs",
                "to": "alpha",
                "amount": _hive("10"),
                "memo": "",
            },
        )

        with pytest.raises(WaxProtocolStringAssertionError) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"
        assert exc.value.subject_type == "string"

    def test_account_name_invalid_characters(self) -> None:
        """Account name with uppercase letters (violates RFC 1035 subset rules)."""
        op = _op(
            "transfer_operation",
            {
                "from": "INVALID",
                "to": "alpha",
                "amount": _hive("10"),
                "memo": "",
            },
        )

        with pytest.raises(WaxInvalidAccountNameException) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"
        assert exc.value.subject_type == "account_name"

    def test_self_delegation(self) -> None:
        """delegate_vesting_shares with delegator == delegatee triggers account_name assertion."""
        op = _op(
            "delegate_vesting_shares_operation",
            {
                "delegator": "initminer",
                "delegatee": "initminer",
                "vesting_shares": _vests("100"),
            },
        )

        with pytest.raises(WaxInvalidAccountNameException) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"

    def test_recurrent_transfer_to_self(self) -> None:
        """recurrent_transfer with from == to."""
        op = _op(
            "recurrent_transfer_operation",
            {
                "from": "initminer",
                "to": "initminer",
                "amount": _hive("100"),
                "memo": "",
                "recurrence": 24,
                "executions": 2,
                "extensions": [],
            },
        )

        with pytest.raises(WaxInvalidAccountNameException) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"


# ---------------------------------------------------------------------------
# subject_type: "asset" — HIVE_PROTOCOL_ASSET_ASSERT
# ---------------------------------------------------------------------------


class TestProtocolAssetAssertions:
    """Tests for operations that trigger HIVE_PROTOCOL_ASSET_ASSERT."""

    def test_wrong_asset_type_vests_in_transfer(self) -> None:
        """Transfer operation with VESTS instead of HIVE/HBD."""
        op = _op(
            "transfer_operation",
            {
                "from": "initminer",
                "to": "alpha",
                "amount": _vests("10"),
                "memo": "",
            },
        )

        with pytest.raises(WaxInvalidAssetException) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"
        assert exc.value.subject_type == "asset"

    def test_zero_transfer_amount(self) -> None:
        """Transfer amount must be greater than zero."""
        op = _op(
            "transfer_operation",
            {
                "from": "initminer",
                "to": "alpha",
                "amount": _hive("0"),
                "memo": "",
            },
        )

        with pytest.raises(WaxInvalidAssetException) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"
        assert exc.value.subject_type == "asset"

    def test_negative_transfer_amount(self) -> None:
        """Transfer amount cannot be negative."""
        op = _op(
            "transfer_operation",
            {
                "from": "initminer",
                "to": "alpha",
                "amount": _hive("-100"),
                "memo": "",
            },
        )

        with pytest.raises(WaxInvalidAssetException) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"
        assert exc.value.subject_type == "asset"

    def test_wrong_precision(self) -> None:
        """Asset with incorrect precision for its NAI."""
        op = _op(
            "transfer_operation",
            {
                "from": "initminer",
                "to": "alpha",
                "amount": {"nai": HIVE_NAI, "precision": 6, "amount": "10"},
                "memo": "",
            },
        )

        with pytest.raises(WaxInvalidAssetException) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"
        assert exc.value.subject_type == "asset"

    def test_claim_account_fee_wrong_asset(self) -> None:
        """claim_account fee must be HIVE, not HBD."""
        op = _op(
            "claim_account_operation",
            {
                "creator": "initminer",
                "fee": _hbd("1"),
                "extensions": [],
            },
        )

        with pytest.raises(WaxInvalidAssetException) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"


# ---------------------------------------------------------------------------
# subject_type: "number" — HIVE_PROTOCOL_NUMBER_ASSERT
# ---------------------------------------------------------------------------


class TestProtocolNumberAssertions:
    """Tests for operations that trigger HIVE_PROTOCOL_NUMBER_ASSERT."""

    def test_vote_weight_exceeds_100_percent(self) -> None:
        """Vote weight must be in [-10000, 10000] range."""
        op = _op(
            "vote_operation",
            {
                "voter": "initminer",
                "author": "alpha",
                "permlink": "test-post",
                "weight": 10001,
            },
        )

        with pytest.raises(WaxProtocolNumberAssertionError) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"
        assert exc.value.subject_type == "number"

    def test_custom_operation_no_required_auths(self) -> None:
        """custom_operation requires at least one required_auth."""
        op = _op(
            "custom_operation",
            {
                "required_auths": [],
                "id": 0,
                "data": "",
            },
        )

        with pytest.raises(WaxProtocolNumberAssertionError) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"

    def test_custom_json_no_auths(self) -> None:
        """custom_json requires at least one authority (required_auths or required_posting_auths)."""
        op = _op(
            "custom_json_operation",
            {
                "required_auths": [],
                "required_posting_auths": [],
                "id": "test",
                "json": "{}",
            },
        )

        with pytest.raises(WaxProtocolNumberAssertionError) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"

    def test_recurrent_transfer_too_few_executions(self) -> None:
        """recurrent_transfer requires at least 2 executions."""
        op = _op(
            "recurrent_transfer_operation",
            {
                "from": "initminer",
                "to": "alpha",
                "amount": _hive("100"),
                "memo": "",
                "recurrence": 24,
                "executions": 1,
                "extensions": [],
            },
        )

        with pytest.raises(WaxProtocolNumberAssertionError) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"


# ---------------------------------------------------------------------------
# subject_type: "string" — HIVE_PROTOCOL_STRING_ASSERT
# ---------------------------------------------------------------------------


class TestProtocolStringAssertions:
    """Tests for operations that trigger HIVE_PROTOCOL_STRING_ASSERT."""

    def test_comment_empty_body(self) -> None:
        """Comment body cannot be empty."""
        op = _op(
            "comment_operation",
            {
                "parent_author": "",
                "parent_permlink": "test",
                "author": "initminer",
                "permlink": "my-post",
                "title": "Test",
                "body": "",
                "json_metadata": "{}",
            },
        )

        with pytest.raises(WaxProtocolStringAssertionError) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"
        assert exc.value.subject_type == "string"

    def test_comment_title_too_long(self) -> None:
        """Comment title cannot exceed 255 characters."""
        op = _op(
            "comment_operation",
            {
                "parent_author": "",
                "parent_permlink": "test",
                "author": "initminer",
                "permlink": "my-post",
                "title": "x" * 300,
                "body": "content",
                "json_metadata": "{}",
            },
        )

        with pytest.raises(WaxProtocolStringAssertionError) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"
        assert exc.value.subject_type == "string"

    def test_witness_update_empty_url(self) -> None:
        """Witness URL cannot be empty."""
        op = _op(
            "witness_update_operation",
            {
                "owner": "initminer",
                "url": "",
                "block_signing_key": "STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW",
                "props": {
                    "account_creation_fee": _hive("3000"),
                    "maximum_block_size": 131072,
                    "hbd_interest_rate": 1000,
                },
                "fee": _hive("0"),
            },
        )

        with pytest.raises(WaxProtocolStringAssertionError) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"

    def test_witness_update_url_too_long(self) -> None:
        """Witness URL cannot exceed HIVE_MAX_WITNESS_URL_LENGTH (2048)."""
        op = _op(
            "witness_update_operation",
            {
                "owner": "initminer",
                "url": "x" * 2100,
                "block_signing_key": "STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW",
                "props": {
                    "account_creation_fee": _hive("3000"),
                    "maximum_block_size": 131072,
                    "hbd_interest_rate": 1000,
                },
                "fee": _hive("0"),
            },
        )

        with pytest.raises(WaxProtocolStringAssertionError) as exc:
            wax.validate_operation(op)

        assert exc.value.category == "protocol"


# ---------------------------------------------------------------------------
# Exception data properties — verify structured metadata is accessible
# ---------------------------------------------------------------------------


class TestExceptionDataProperties:
    """Verify that WaxAssertionError exposes structured C++ exception metadata."""

    def test_assert_hash_is_populated(self) -> None:
        """assert_hash should be a non-empty numeric string."""
        op = _op(
            "transfer_operation",
            {
                "from": "in",
                "to": "alpha",
                "amount": _hive("10"),
                "memo": "",
            },
        )

        with pytest.raises(WaxAssertionError) as exc:
            wax.validate_operation(op)

        assert exc.value.assert_hash
        assert exc.value.assert_hash.isdigit()

    def test_raw_data_accessible(self) -> None:
        """Raw property should expose the parsed CxxExceptionData."""
        op = _op(
            "transfer_operation",
            {
                "from": "in",
                "to": "alpha",
                "amount": _hive("10"),
                "memo": "",
            },
        )

        with pytest.raises(WaxAssertionError) as exc:
            wax.validate_operation(op)

        raw = exc.value.raw
        assert raw.assert_hash
        assert raw.name
        assert raw.extension.assertion_expression

    def test_extras_contains_category(self) -> None:
        """Extras dict should contain category from C++ macro metadata."""
        op = _op(
            "transfer_operation",
            {
                "from": "in",
                "to": "alpha",
                "amount": _hive("10"),
                "memo": "",
            },
        )

        with pytest.raises(WaxAssertionError) as exc:
            wax.validate_operation(op)

        assert "category" in exc.value.extras
        assert exc.value.extras["category"] == "protocol"

    def test_message_is_formatted(self) -> None:
        """Message property should return a human-readable formatted string."""
        op = _op(
            "transfer_operation",
            {
                "from": "in",
                "to": "alpha",
                "amount": _hive("10"),
                "memo": "",
            },
        )

        with pytest.raises(WaxAssertionError) as exc:
            wax.validate_operation(op)

        assert isinstance(exc.value.message, str)
        assert len(exc.value.message) > 0
        assert "Protocol" in exc.value.message or "protocol" in exc.value.message.lower()

    def test_subject_present_for_asset_error(self) -> None:
        """Asset assertion errors should populate the subject field."""
        op = _op(
            "transfer_operation",
            {
                "from": "initminer",
                "to": "alpha",
                "amount": _vests("10"),
                "memo": "",
            },
        )

        with pytest.raises(WaxInvalidAssetException) as exc:
            wax.validate_operation(op)

        assert exc.value.subject is not None
        assert exc.value.subject_type == "asset"
        assert exc.value.asset is not None
