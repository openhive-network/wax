from __future__ import annotations

import pytest

from wax import python_required_authority_collection, has_authorization
from tests.wax.utils.refs import ACCOUNT_AUTHS


def test_has_authorization_active_pass() -> None:
    """Correct active key satisfies active authority requirement."""
    required = python_required_authority_collection(
        posting_accounts=set(),
        active_accounts={"brofund-witness"},
        owner_accounts=set(),
        other_authorities=[],
    )
    result = has_authorization(
        required_authorities=required,
        signature_public_keys=["STM5zw6KDtQiiJMhkdkFm8CXxPUEa2QyitHBhkCE1iMJEGmEfd5aE"],
        authorities_map=ACCOUNT_AUTHS,
    )
    assert result is True


def test_has_authorization_wrong_key() -> None:
    """Wrong key does not satisfy active authority requirement."""
    required = python_required_authority_collection(
        posting_accounts=set(),
        active_accounts={"brofund-witness"},
        owner_accounts=set(),
        other_authorities=[],
    )
    # Use posting key for active authority check - should fail
    result = has_authorization(
        required_authorities=required,
        signature_public_keys=["STM8AaJXJfZ6gdSLKcVgMcNU6oEkuL7hcYxrqrUjN3Kwd2eHvXp4v"],
        authorities_map=ACCOUNT_AUTHS,
    )
    assert result is False


def test_has_authorization_missing_account() -> None:
    """Missing account in authorities_map returns False (unsatisfiable authority)."""
    required = python_required_authority_collection(
        posting_accounts=set(),
        active_accounts={"nonexistent-account"},
        owner_accounts=set(),
        other_authorities=[],
    )
    result = has_authorization(
        required_authorities=required,
        signature_public_keys=["STM5zw6KDtQiiJMhkdkFm8CXxPUEa2QyitHBhkCE1iMJEGmEfd5aE"],
        authorities_map=ACCOUNT_AUTHS,
    )
    assert result is False


def test_has_authorization_posting_pass() -> None:
    """Correct posting key satisfies posting authority requirement."""
    required = python_required_authority_collection(
        posting_accounts={"brofund-witness"},
        active_accounts=set(),
        owner_accounts=set(),
        other_authorities=[],
    )
    result = has_authorization(
        required_authorities=required,
        signature_public_keys=["STM8AaJXJfZ6gdSLKcVgMcNU6oEkuL7hcYxrqrUjN3Kwd2eHvXp4v"],
        authorities_map=ACCOUNT_AUTHS,
    )
    assert result is True
