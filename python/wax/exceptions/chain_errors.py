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
