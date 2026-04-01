from __future__ import annotations

import contextlib
import re
from functools import wraps
from typing import TYPE_CHECKING, Any

from schemas._preconfigured_base_model import PreconfiguredBaseModel
from schemas.errors import DecodeError
from schemas.fields.hive_datetime import HiveDateTime  # noqa: TCH002

from wax.exceptions.wax_error import (
    WaxAssertionError,
    WaxChainAssertionError,
    WaxChainAssetAssertionError,
    WaxChainBalanceAssertionError,
    WaxChainHardforkAssertionError,
    WaxChainLimitAssertionError,
    WaxChainPermissionAssertionError,
    WaxChainStateAssertionError,
    WaxChainTimeAssertionError,
    WaxChainTreasuryAssertionError,
    WaxChainUnreachableCodeAssertionError,
    WaxChainVotingAssertionError,
    WaxError,
    WaxProtocolAccountNameAssertionError,
    WaxProtocolAssertionError,
    WaxProtocolAssetAssertionError,
    WaxProtocolAuthorityAssertionError,
    WaxProtocolHardforkAssertionError,
    WaxProtocolNumberAssertionError,
    WaxProtocolStringAssertionError,
    WaxProtocolUnreachableCodeAssertionError,
    WaxUnhandledAssertionError,
)

if TYPE_CHECKING:
    from collections.abc import Callable

# ---------------------------------------------------------------------------
# Data models for parsed C++ exception JSON
# ---------------------------------------------------------------------------


class StackContext(PreconfiguredBaseModel):
    level: str
    file: str
    line: int
    method: str
    hostname: str
    thread_name: str
    timestamp: HiveDateTime | None = None


class StackFrame(PreconfiguredBaseModel):
    context: StackContext
    format: str
    data: dict[str, Any]


class ExtensionData(PreconfiguredBaseModel):
    assertion_expression: str


class CxxExceptionData(PreconfiguredBaseModel):
    """Parsed C++ exception data. This is a pure data model, not an exception."""

    assert_hash: str
    code: int
    extension: ExtensionData
    message: str
    name: str
    stack: list[StackFrame]

    @property
    def category(self) -> str:
        for frame in self.stack:
            if (category := frame.data.get("category")) is not None:
                assert isinstance(category, str)
                return category
        return "unknown"

    @property
    def subject_type(self) -> str:
        extras = self.stack[0].data if self.stack else {}
        if "subject" not in extras:
            return "none"
        result = extras.get("subject_type", "any")
        assert isinstance(result, str)
        return result

    @property
    def subject(self) -> Any | None:  # noqa: ANN401
        if not self.stack:
            return None
        return self.stack[0].data.get("subject")

    def formatted_message(self) -> str:
        message = self._combine_message()
        if not message:
            message = f"{self.message}: {self.extension.assertion_expression}"
        message = f"[{self.category.title()} Error] {message}"

        if self.stack and (context := self.stack[0].data.get("context")) is not None:
            message += f" ({context})"

        return message

    def __str__(self) -> str:
        return self.formatted_message()

    def _combine_message(self) -> str:
        if not self.stack:
            return ""
        fmt = re.sub(r"\$\{", "{", self.stack[0].format)
        kwargs = self.stack[0].data
        return fmt.format(**kwargs).strip()


# Backward-compatible alias
DetailedCxxError = CxxExceptionData


# ---------------------------------------------------------------------------
# Exception resolver — maps C++ exception data to the correct Python class
# ---------------------------------------------------------------------------

_WAX_EXCEPTION_NAME_TO_CATEGORY: dict[str, str] = {
    "WaxProtocolAssertionError": "protocol",
    "WaxChainAssertionError": "chain",
}

_CATEGORY_MAP: dict[str, type[WaxAssertionError]] = {
    "protocol": WaxProtocolAssertionError,
    "chain": WaxChainAssertionError,
}

_SUBJECT_TYPE_MAP: dict[tuple[str, str], type[WaxAssertionError]] = {
    # Protocol subject types (from HIVE_PROTOCOL_*_ASSERT macros)
    ("protocol", "asset"): WaxProtocolAssetAssertionError,
    ("protocol", "authority"): WaxProtocolAuthorityAssertionError,
    ("protocol", "account_name"): WaxProtocolAccountNameAssertionError,
    ("protocol", "number"): WaxProtocolNumberAssertionError,
    ("protocol", "string"): WaxProtocolStringAssertionError,
    ("protocol", "hardfork"): WaxProtocolHardforkAssertionError,
    ("protocol", "unreachable_code"): WaxProtocolUnreachableCodeAssertionError,
    # Chain subject types (from HIVE_CHAIN_*_ASSERT macros)
    ("chain", "asset"): WaxChainAssetAssertionError,
    ("chain", "balance"): WaxChainBalanceAssertionError,
    ("chain", "hardfork"): WaxChainHardforkAssertionError,
    ("chain", "treasury"): WaxChainTreasuryAssertionError,
    ("chain", "time"): WaxChainTimeAssertionError,
    ("chain", "limit"): WaxChainLimitAssertionError,
    ("chain", "state"): WaxChainStateAssertionError,
    ("chain", "voting"): WaxChainVotingAssertionError,
    ("chain", "permission"): WaxChainPermissionAssertionError,
    ("chain", "unreachable_code"): WaxChainUnreachableCodeAssertionError,
}


def _parse_to_data(raw: str | dict[str, Any]) -> CxxExceptionData:
    """Parse raw exception data (JSON string or dict) into CxxExceptionData."""
    if isinstance(raw, str):
        return CxxExceptionData.parse_raw(raw)
    return CxxExceptionData.parse_builtins(raw)


def _determine_category(data: CxxExceptionData, wax_exception_name: str | None) -> str:
    """Determine the exception category from the parsed data or the C++ exception class name."""
    category = data.category
    if category != "unknown":
        return category
    if wax_exception_name is not None:
        return _WAX_EXCEPTION_NAME_TO_CATEGORY.get(wax_exception_name, "unknown")
    return "unknown"


_ASSERT_HASH_CLASSIFICATION_CACHE: dict[str, tuple[str, str]] = {}
"""Runtime cache mapping assert_hash → (category, subject_type).

Populated when resolve_exception() successfully classifies an exception via the C++
bridge (which includes category/subject_type in stack frame data).  When the same
assert_hash appears later in an API response (which lacks those fields), the cached
classification is used instead of falling back to WaxUnhandledAssertionError.
"""


def _build_exception(data: CxxExceptionData, category: str) -> WaxAssertionError:
    """Instantiate the most specific exception class for the given data and category."""
    subject_type = data.subject_type

    # When the stack data doesn't carry category/subject_type (e.g. API responses
    # from hived versions without HIVE_SPECIALISED_ASSERT metadata), fall back to
    # the assert_hash cache populated by earlier C++ bridge resolutions.
    # Only use cache when "category" is genuinely absent from stack frames,
    # not when it's explicitly set to "unknown".
    _category_absent = not any("category" in frame.data for frame in data.stack)
    if category == "unknown" and _category_absent and data.assert_hash in _ASSERT_HASH_CLASSIFICATION_CACHE:
        category, subject_type = _ASSERT_HASH_CLASSIFICATION_CACHE[data.assert_hash]
        # Inject cached classification into the stack data so that properties
        # like WaxAssertionError.category and .subject_type read correct values.
        if data.stack:
            frame_data = data.stack[0].data
            frame_data.setdefault("category", category)
            frame_data.setdefault("subject_type", subject_type)
            # Ensure "subject" key exists so WaxAssertionError.subject_type reads it.
            # The subject value may be present under a different key in API responses.
            if "subject" not in frame_data:
                frame_data["subject"] = frame_data.get("name", "")

    # Try the most specific match: (category, subject_type)
    cls = _SUBJECT_TYPE_MAP.get((category, subject_type))
    if cls is not None:
        _ASSERT_HASH_CLASSIFICATION_CACHE[data.assert_hash] = (category, subject_type)
        return cls(raw=data)
    # Fall back to category-level match
    cls = _CATEGORY_MAP.get(category)
    if cls is not None:
        _ASSERT_HASH_CLASSIFICATION_CACHE[data.assert_hash] = (category, subject_type)
        return cls(raw=data)
    # Unknown category
    return WaxUnhandledAssertionError(raw=data)


def resolve_exception(
    exception: Exception | str | bytes | dict[str, Any],
    wax_exception_name: str | None = None,
) -> Exception:
    """
    Parse and classify a C++ exception into the proper Python exception type.

    Args:
        exception: The raw exception — a RuntimeError from Cython, a JSON string/bytes,
                   or an already-parsed dict.
        wax_exception_name: Optional C++ exception class name (e.g. "WaxProtocolAssertionError")
                            used as fallback for category detection when the JSON doesn't contain it.
    """
    if isinstance(exception, WaxError):
        return exception

    # For RuntimeError coming from Cython, try to extract structured data via C++ bridge
    if isinstance(exception, RuntimeError) and wax_exception_name is None:
        with contextlib.suppress(ImportError, RuntimeError, TypeError, ValueError):
            from cpp_python_bridge import parse_cxx_exception  # type: ignore[import-not-found]

            parsed = parse_cxx_exception(exception)
            if parsed is not None:
                exc_name, exc_data = parsed
                return resolve_exception(exc_data, wax_exception_name=exc_name)

    # Normalize input to str or dict
    raw: str | dict[str, Any]
    if isinstance(exception, Exception):
        raw = str(exception)
    elif isinstance(exception, bytes):
        raw = exception.decode("utf-8")
    elif isinstance(exception, (str, dict)):
        raw = exception
    else:
        return WaxError(str(exception))

    try:
        data = _parse_to_data(raw)
    except (TypeError, DecodeError, ValueError):
        return WaxError(str(exception))

    category = _determine_category(data, wax_exception_name)
    return _build_exception(data, category)


# ---------------------------------------------------------------------------
# API response error resolver — extracts structured data from JSON-RPC errors
# ---------------------------------------------------------------------------


def resolve_api_response_error(response: dict[str, Any]) -> Exception | None:
    """
    Extract structured error data from a JSON-RPC response and resolve it.

    Looks for ``response["error"]["data"]`` containing structured hived exception
    data (with ``name`` and ``stack`` fields) and passes it through
    :func:`resolve_exception` — the same function used for C++ exceptions.

    Returns:
        A :class:`WaxAssertionError` subclass (or generic :class:`WaxError`) when
        structured data is found and parseable, or ``None`` when the response does
        not contain structured error data.
    """
    error_obj = response.get("error")
    if not isinstance(error_obj, dict):
        return None
    data = error_obj.get("data")
    if not isinstance(data, dict):
        return None
    # Lightweight check: structured hived errors carry at least "name" and "stack"
    if "name" not in data or "stack" not in data:
        return None
    return resolve_exception(data)


# ---------------------------------------------------------------------------
# Exception boundary decorator for Cython proxy functions
# ---------------------------------------------------------------------------


def wax_error_boundary(foo: Callable[..., Any]) -> Callable[..., Any]:
    """Catch exceptions from the wrapped function and re-raise them as Wax errors."""

    @wraps(foo)
    def wrapper(*args: Any, **kwargs: Any) -> Any:  # noqa: ANN401
        try:
            return foo(*args, **kwargs)
        except Exception as ex:
            raise resolve_exception(ex) from ex

    return wrapper
