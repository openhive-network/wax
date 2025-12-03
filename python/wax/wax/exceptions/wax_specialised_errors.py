from __future__ import annotations

import contextlib
import re
from functools import wraps
from typing import Any, Callable, ClassVar, get_type_hints

from schemas._preconfigured_base_model import PreconfiguredBaseModel
from schemas.errors import DecodeError
from schemas.fields.hive_datetime import HiveDateTime  # noqa: TCH002

from wax.exceptions.wax_error import WaxError


class CategoryNotFoundError(WaxError):
    """Raised when an assertion category could not be found in the stack frames."""


class SubcategoryNotFoundError(WaxError):
    """Raised when an assertion subcategory could not be found in the stack frames."""


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


class CxxBaseError(WaxError):
    """Base class for C++ errors parsed from JSON."""

    @property
    def assertion_hash(self) -> str:
        """Backward compatibility alias for assert_hash."""
        return getattr(self, "assert_hash", "")

    @property
    def assertion_data(self) -> str:
        """Backward compatibility alias - returns string representation of the exception."""
        return str(self)


class DetailedCxxError(PreconfiguredBaseModel, CxxBaseError):
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
                assert isinstance(category, str), "Mypy type check"
                return category
        return "unknown"

    def formatted_message(self) -> str:
        if not self.stack:
            return f"[{self.category.title()} Error] {self.message}: {self.extension.assertion_expression}"

        message = self._combine_message()
        if not message:
            message = f"{self.message}: {self.extension.assertion_expression}"
        message = f"[{self.category.title()} Error] {message}"

        if (context := self.stack[0].data.get("context")) is not None:
            message += f" ({context})"

        return message

    def __str__(self) -> str:
        return self.formatted_message()

    def _combine_message(self) -> str:
        fmt = re.sub(r"\$\{", "{", self.stack[0].format)
        kwargs = self.stack[0].data
        try:
            return fmt.format(**kwargs).strip()
        except KeyError:
            return ""


class UnhandledWaxError(CxxBaseError):
    """Raised when an error cannot be handled properly."""


class WaxBaseAssertionError(CxxBaseError):
    __registered_errors__: ClassVar[dict[str, type[WaxBaseAssertionError]]] = {}

    def __init__(self, raw: DetailedCxxError) -> None:
        super().__init__(str(raw))
        self.__raw = raw

    @property
    def raw(self) -> DetailedCxxError:
        return self.__raw

    @property
    def category(self) -> str:
        return self.__raw.category

    @property
    def subject_type(self) -> str:
        result = "none" if "subject" not in self.extras else self.extras.get("subject_type", "any")
        assert isinstance(result, str), "Mypy type check"
        return result

    @property
    def subject(self) -> Any | None:  # noqa: ANN401
        return self.extras.get("subject")

    @property
    def extras(self) -> dict[str, Any]:
        if not self.__raw.stack:
            return {}
        return self.__raw.stack[0].data

    @property
    def message(self) -> str:
        return self.__raw.formatted_message()

    @property
    def assert_hash(self) -> str:
        return self.__raw.assert_hash

    @classmethod
    def register_error(cls, *, category: str) -> Callable[[type[WaxBaseAssertionError]], type[WaxBaseAssertionError]]:
        def decorator(error_cls: type[WaxBaseAssertionError]) -> type[WaxBaseAssertionError]:
            cls.__registered_errors__[category] = error_cls
            return error_cls

        return decorator

    @classmethod
    def resolve_error_cls(cls, exception: Exception | str | bytes | dict[str, Any]) -> Exception:
        # don't process if already specialised
        if isinstance(exception, CxxBaseError):
            return exception

        if isinstance(exception, RuntimeError):
            with contextlib.suppress(ImportError, RuntimeError, TypeError, ValueError):
                from cpp_python_bridge import parse_cxx_exception  # type: ignore[import-not-found]

                parsed = parse_cxx_exception(exception)
                if parsed is not None:
                    exception = parsed

        try:
            ex_raw = cls.__parse_input(exception)
            loaded_exception = WaxBaseAssertionError.__make_instance(DetailedCxxError, ex_raw)
            try:
                err_cls = cls.__registered_errors__[loaded_exception.category]
                return err_cls(raw=loaded_exception)
            except (KeyError, CategoryNotFoundError, SubcategoryNotFoundError, DecodeError):
                return loaded_exception
        except (TypeError, DecodeError):
            return UnhandledWaxError(exception)

    @classmethod
    def __parse_input(cls, exception: Exception | str | bytes | dict[str, Any]) -> str | dict[str, Any]:
        if isinstance(exception, Exception):
            return str(exception)
        if isinstance(exception, (str, bytes)):
            return exception.decode("utf-8") if isinstance(exception, bytes) else exception
        if isinstance(exception, dict):
            return exception
        raise TypeError("Unsupported type for exception parsing.")

    @classmethod
    def __make_instance(cls, err_cls: type[DetailedCxxError], data: str | dict[str, Any]) -> DetailedCxxError:
        if isinstance(data, str):
            return err_cls.parse_raw(data)
        return err_cls.parse_builtins(data)


@WaxBaseAssertionError.register_error(category="chain")
class WaxChainAssertionError(WaxBaseAssertionError):
    """
    Raised for chain-related assertion errors.

    Like operation, transaction or block processing related errors.
    """


@WaxBaseAssertionError.register_error(category="protocol")
class WaxProtocolAssertionError(WaxBaseAssertionError):
    """
    Raised for protocol-related assertion errors.

    Like validation of account names, assets or operations related errors.
    """


def is_python_result_return(func: Callable[..., Any]) -> bool:
    """Check if the function return type is python_result."""
    with contextlib.suppress(NameError):
        from wax.wax_result import python_result

        return get_type_hints(func).get("return") is python_result
    return False


def _coerce_to_str(res: Any) -> str:  # noqa: ANN401
    """Coerce a C++ result value to str for python_result wrapping."""
    if res is None:
        return ""
    if isinstance(res, bytes):
        return res.decode("utf-8")
    if isinstance(res, str):
        return res
    return str(res)


def wax_error_boundary(foo: Callable[..., Any]) -> Callable[..., Any]:
    """
    Unified wrapper for proxy functions/methods.

    - Catches exceptions from C++/Python and raises specialised Wax errors via resolve_error_cls.
    - If the wrapped function returns a python_result with failure status, raises specialised Wax error
        using its exception_message (or content as fallback).
    """
    is_python_result = is_python_result_return(foo)

    @wraps(foo)
    def wrapper(*args: Any, **kwargs: Any) -> Any:  # noqa: ANN401
        from wax import python_error_code, python_result

        try:
            res = foo(*args, **kwargs)
            if is_python_result:
                res = python_result(python_error_code.ok, result=_coerce_to_str(res), exception_message="")
        except Exception as ex:
            new_ex = WaxBaseAssertionError.resolve_error_cls(ex)
            raise new_ex from ex

        # If function returned python_result, assert success and raise on failure
        try:
            if isinstance(res, python_result) and res.status == python_error_code.fail:
                payload = getattr(res, "exception_message", None)
                if payload is None or payload in (b"", ""):
                    payload = getattr(res, "result", None)
                raise WaxBaseAssertionError.resolve_error_cls(payload if payload is not None else "")
        except NameError:
            # python_result not yet defined in scope; wrapper will be applied after imports.
            pass

        return res

    return wrapper
