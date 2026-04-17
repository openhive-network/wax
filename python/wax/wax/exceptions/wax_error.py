from __future__ import annotations

from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from wax.exceptions.wax_specialised_errors import CxxExceptionData


class WaxError(Exception):
    """Base exception for all wax operations."""


class WaxCommunicationError(WaxError):
    """Raised when a transport-level error occurs (timeout, connection refused, DNS failure, etc.)."""


class WaxImportProtoBeforeCompileError(WaxError):
    """Raised when trying to import a proto module before compiling it."""

    def __init__(self) -> None:
        super().__init__(
            "You must compile the proto files before importing them.Using `build_wax..sh` script is recommended."
        )


class WaxAssertionError(WaxError):
    """
    Base class for C++ assertion errors raised by the Hive protocol or chain layer.

    Subclasses cover common "what went wrong" cases (invalid account name, insufficient
    balance, invalid asset, etc.). Assertions that do not match any subclass are raised
    as :class:`WaxAssertionError` itself; callers can inspect :pyattr:`category`,
    :pyattr:`subject_type` and :pyattr:`subject` to identify the exact assertion.
    """

    def __init__(self, raw: CxxExceptionData) -> None:
        self._raw = raw
        super().__init__(raw.formatted_message())

    @property
    def raw(self) -> CxxExceptionData:
        """The raw parsed C++ exception data."""
        return self._raw

    @property
    def category(self) -> str:
        """Origin of the assertion: ``"protocol"`` or ``"chain"``."""
        return self._raw.category

    @property
    def subject_type(self) -> str:
        """Kind of the value that failed validation (e.g. ``"account_name"``, ``"asset"``, ``"balance"``)."""
        return self._raw.subject_type

    @property
    def subject(self) -> Any | None:  # noqa: ANN401
        """The value that failed the assertion (e.g. the invalid account name)."""
        return self._raw.subject

    @property
    def extras(self) -> dict[str, Any]:
        """Additional fields from the top-level C++ stack frame."""
        return self._raw.stack[0].data if self._raw.stack else {}

    @property
    def message(self) -> str:
        """Human-readable error message."""
        return self._raw.formatted_message()

    @property
    def assert_hash(self) -> str:
        """Hash identifying the specific C++ assertion site."""
        return self._raw.assert_hash


class WaxUnhandledAssertionError(WaxAssertionError):
    """Raised when an assertion cannot be classified by category or subject type."""


class WaxInvalidAccountNameError(WaxAssertionError):
    """Raised when an account name is invalid (too short, too long, bad characters, etc.)."""

    @property
    def account_name(self) -> str | None:
        """The invalid account name, if available from the assertion data."""
        return self.subject if isinstance(self.subject, str) else None


class WaxInvalidPermlinkError(WaxAssertionError):
    """Raised when a permlink is invalid."""

    @property
    def permlink(self) -> str | None:
        """The invalid permlink, if available from the assertion data."""
        return self.subject if isinstance(self.subject, str) else None


class WaxInvalidAssetError(WaxAssertionError):
    """Raised when an asset is invalid (wrong type, zero/negative amount, bad precision, etc.)."""

    @property
    def asset(self) -> Any | None:  # noqa: ANN401
        """The invalid asset value, if available from the assertion data."""
        return self.subject


class WaxInvalidFeeError(WaxAssertionError):
    """Raised when a fee does not match the required value."""

    @property
    def fee(self) -> Any | None:  # noqa: ANN401
        """The invalid fee value, if available from the assertion data."""
        return self.subject


class WaxInsufficientBalanceError(WaxAssertionError):
    """Raised when an account has insufficient balance for the requested operation."""

    @property
    def balance(self) -> Any | None:  # noqa: ANN401
        """The balance-related asset value from the assertion data."""
        return self.subject

    @property
    def account(self) -> str | None:
        """The account name related to the insufficient balance, if available."""
        name = self.extras.get("name")
        return name if isinstance(name, str) else None
