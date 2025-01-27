from __future__ import annotations

from typing import TYPE_CHECKING

from wax.exceptions.wax_error import WaxError

if TYPE_CHECKING:
    from wax.models.basic import AccountName


class WaxValidationFailedError(WaxError):
    """Raises when validation using wax failed."""

    def __init__(self, reason: str) -> None:
        self.reason = reason
        self.message = f"Validation using wax failed due to: {reason}"
        super().__init__(self.message)


class InvalidAccountNameError(WaxError):
    """
    Raised when an account name is invalid.

    Note that this error is different from `AccountNotFoundError` and is created to not make an API call
    when the account name is invalid.
    """

    def __init__(self, account: AccountName) -> None:
        self.account = account
        self.message = f"Account name '{account}' is invalid."
        super().__init__(self.message)


class InvalidOperationFormatError(WaxError):
    """Raised when operation is in invalid format."""
