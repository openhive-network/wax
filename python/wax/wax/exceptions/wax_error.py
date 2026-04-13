from __future__ import annotations

import warnings
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
    """Base for all C++ assertion errors. Carries structured exception data."""

    def __init__(self, raw: CxxExceptionData) -> None:
        self._raw = raw
        super().__init__(raw.formatted_message())

    @property
    def raw(self) -> CxxExceptionData:
        return self._raw

    @property
    def category(self) -> str:
        return self._raw.category

    @property
    def subject_type(self) -> str:
        return self._raw.subject_type

    @property
    def subject(self) -> Any | None:  # noqa: ANN401
        return self._raw.subject

    @property
    def extras(self) -> dict[str, Any]:
        return self._raw.stack[0].data if self._raw.stack else {}

    @property
    def message(self) -> str:
        return self._raw.formatted_message()

    @property
    def assert_hash(self) -> str:
        return self._raw.assert_hash

    # Deprecated aliases for renamed attributes (old API: assertion_hash, assertion_data)
    @property
    def assertion_hash(self) -> str:
        warnings.warn("assertion_hash is deprecated, use assert_hash", DeprecationWarning, stacklevel=2)
        return self.assert_hash

    @property
    def assertion_data(self) -> CxxExceptionData:
        warnings.warn("assertion_data is deprecated, use raw", DeprecationWarning, stacklevel=2)
        return self._raw


class WaxUnhandledAssertionError(WaxAssertionError):
    """Raised for assertion errors that cannot be classified into a known category."""


# --- Protocol category ---


class WaxProtocolAssertionError(WaxAssertionError):
    """Raised for protocol-level assertion errors (validation of account names, assets, operations, etc.)."""


class WaxProtocolAssetAssertionError(WaxProtocolAssertionError):
    """Protocol assertion: asset validation failure."""


class WaxProtocolAuthorityAssertionError(WaxProtocolAssertionError):
    """Protocol assertion: authority/permission validation failure."""


class WaxProtocolAccountNameAssertionError(WaxProtocolAssertionError):
    """Protocol assertion: invalid account name."""


class WaxProtocolNumberAssertionError(WaxProtocolAssertionError):
    """Protocol assertion: numeric constraint violation."""


class WaxProtocolStringAssertionError(WaxProtocolAssertionError):
    """Protocol assertion: string constraint violation."""


class WaxProtocolHardforkAssertionError(WaxProtocolAssertionError):
    """Protocol assertion: hardfork-related validation failure."""


class WaxProtocolUnreachableCodeAssertionError(WaxProtocolAssertionError):
    """Protocol assertion: code path that should never execute."""


# --- Chain category ---


class WaxChainAssertionError(WaxAssertionError):
    """Raised for chain-level assertion errors (evaluator, transaction, block processing, etc.)."""


class WaxChainAssetAssertionError(WaxChainAssertionError):
    """Chain assertion: asset validation failure."""


class WaxChainBalanceAssertionError(WaxChainAssertionError):
    """Chain assertion: insufficient balance."""


class WaxChainHardforkAssertionError(WaxChainAssertionError):
    """Chain assertion: hardfork-related validation failure."""


class WaxChainTreasuryAssertionError(WaxChainAssertionError):
    """Chain assertion: treasury-related validation failure."""


class WaxChainTimeAssertionError(WaxChainAssertionError):
    """Chain assertion: time constraint violation."""


class WaxChainLimitAssertionError(WaxChainAssertionError):
    """Chain assertion: limit exceeded."""


class WaxChainStateAssertionError(WaxChainAssertionError):
    """Chain assertion: invalid chain state."""


class WaxChainVotingAssertionError(WaxChainAssertionError):
    """Chain assertion: voting-related validation failure."""


class WaxChainPermissionAssertionError(WaxChainAssertionError):
    """Chain assertion: permission-related validation failure."""


class WaxChainUnreachableCodeAssertionError(WaxChainAssertionError):
    """Chain assertion: code path that should never execute."""
