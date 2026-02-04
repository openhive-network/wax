from __future__ import annotations

import pytest

from wax.hive_apps_operations.rc import ResourceCreditsOperation


@pytest.mark.describe("Should delegate RCs to a single account correctly")
def test_delegate_single_account() -> None:
    # Arrange
    op = ResourceCreditsOperation()
    working_account = "alice"
    max_rc = 1_000
    delegatee = "bob"

    # Act
    op.delegate(working_account, max_rc, delegatee).authorize("testAuthority")

    # Assert
    expected_json = (
        "\"[delegate_rc, {'from_account': 'alice', 'max_rc': 1000, 'delegatees': ['bob'], 'extensions': []}]\""
    )

    assert op.ops[0].required_posting_auths == ["testAuthority"]
    assert op.ops[0].id == "rc"
    assert op.ops[0].json == expected_json


@pytest.mark.describe("Should delegate RCs to multiple accounts correctly")
def test_delegate_multiple_accounts() -> None:
    # Arrange
    op = ResourceCreditsOperation()
    working_account = "alice"
    max_rc = 1_000
    delegatee = "bob"
    other_delegatees = ["carol", "dave"]

    # Act
    op.delegate(working_account, max_rc, delegatee, *other_delegatees).authorize("testAuthority")

    # Assert
    expected_json = (
        "\"[delegate_rc, {'from_account': 'alice', 'max_rc': 1000, "
        "'delegatees': ['bob', 'carol', 'dave'], 'extensions': []}]\""
    )

    assert op.ops[0].required_posting_auths == ["testAuthority"]
    assert op.ops[0].id == "rc"
    assert op.ops[0].json == expected_json


@pytest.mark.describe("Should remove delegation for a single account correctly")
def test_remove_delegation_single() -> None:
    # Arrange
    op = ResourceCreditsOperation()
    working_account = "alice"
    delegatee = "bob"

    # Act
    op.remove_delegation(working_account, delegatee).authorize("testAuthority")

    # Assert
    expected_json = "\"[delegate_rc, {'from_account': 'alice', 'rc': '0', 'delegatees': ['bob'], 'extensions': []}]\""

    assert op.ops[0].required_posting_auths == ["testAuthority"]
    assert op.ops[0].id == "rc"
    assert op.ops[0].json == expected_json


@pytest.mark.describe("Should remove delegation for multiple accounts correctly")
def test_remove_delegation_multiple() -> None:
    # Arrange
    op = ResourceCreditsOperation()
    working_account = "alice"
    delegatee = "bob"
    other_delegatees = ["carol", "dan"]

    # Act
    op.remove_delegation(working_account, delegatee, *other_delegatees).authorize("testAuthority")

    # Assert
    expected_json = (
        "\"[delegate_rc, {'from_account': 'alice', 'max_rc': '0', 'delegatees': "
        "['bob', 'carol', 'dan'], 'extensions': []}]\""
    )

    assert op.ops[0].required_posting_auths == ["testAuthority"]
    assert op.ops[0].id == "rc"
    assert op.ops[0].json == expected_json
