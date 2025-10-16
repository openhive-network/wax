from __future__ import annotations

from typing import TYPE_CHECKING

from wax.exceptions.wax_error import WaxError

if TYPE_CHECKING:
    from beekeepy.interfaces import HttpUrl
    from wax.models.basic import AccountName, PublicKey


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


class InvalidEndpointUrlFormatError(WaxError):
    """Raised when endpoint url is in invalid format."""

    def __init__(self, url: HttpUrl | str) -> None:
        self.url = url
        self.message = f"Endpoint url '{url}' is in invalid format."
        super().__init__(self.message)


class InvalidAccountOrKeyError(WaxError):
    """Raised when account or key is invalid."""

    def __init__(self, account_or_key: str) -> None:
        self.account_or_key = account_or_key
        self.message = f"Account or key '{account_or_key}' is invalid."
        super().__init__(self.message)


class InvalidMemoKeyError(WaxError):
    """Raised when an invalid memo key is provided."""

    def __init__(self, memo_key: PublicKey) -> None:
        self.memo_key = memo_key
        self.message = f"Invalid memo key: {memo_key} provided."
        super().__init__(self.message)


class NoAuthorityOperationGeneratedError(WaxError):
    """Raised when no operations are generated."""

    def __init__(self) -> None:
        self.message = "No operations updating account authority generated."
        super().__init__(self.message)


class ToLongFollowingListError(WaxError):
    """Raised when the following list exceeds the maximum allowed length."""

    def __init__(self, max_length: int) -> None:
        self.max_length = max_length
        self.message = f"Too long following list. Accepted max length: {max_length}."
        super().__init__(self.message)
