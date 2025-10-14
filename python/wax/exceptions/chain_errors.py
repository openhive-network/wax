from __future__ import annotations

from typing import TYPE_CHECKING

from wax.exceptions.wax_error import WaxError

if TYPE_CHECKING:
    from wax.models.basic import AccountName


class AccountNotFoundError(WaxError):
    """Raised when an account is not found when calling `find_accounts` API call."""

    def __init__(self, account: AccountName) -> None:
        self.account = account
        self.message = f"Account '{account}' not found."
        super().__init__(self.message)


class HiveAccountCategoryError(WaxError):
    """Base class for HiveAccountCategory errors."""


class HiveTempAccountUsedError(HiveAccountCategoryError):
    """Raised when trying to edit a temporary account in the hive category."""

    def __init__(self) -> None:
        self.message = "Cannot edit temporary account in hive category"
        super().__init__(self.message)


class HiveMaxAuthorityMembershipExceededError(HiveAccountCategoryError):
    """Raised when the authority membership exceeds the maximum."""

    def __init__(self, max_membership: int, current_membership: int) -> None:
        self.message = f"Authority membership exceeds. Max: {max_membership}, current: {current_membership}"
        self.max_membership = max_membership
        self.current_membership = current_membership
        super().__init__(self.message)


class AuthorityCannotBeSatisfiedError(HiveAccountCategoryError):
    """Raised when the authority cannot be satisfied."""

    def __init__(self, authority_level: str) -> None:
        self.message = f"{authority_level} authority cannot be satisfied due to insufficient weight"
        self.authority_level = authority_level
        super().__init__(self.message)


class PrivateKeyDetectedInMemoError(WaxError):
    """Raised when private key was detected in the memo field."""
