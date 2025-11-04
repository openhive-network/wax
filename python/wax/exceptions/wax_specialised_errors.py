from __future__ import annotations

import re
from typing import Any, Callable, ClassVar

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


class AbstractCxxError(PreconfiguredBaseModel, WaxError):
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
        raise CategoryNotFoundError

    def formatted_message(self) -> str:
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
        return fmt.format(**kwargs).strip()


class UnhandableWaxError(WaxError):
    """Raised when an error cannot be handled properly."""


class WaxBaseAssertionError(WaxError):
    __registered_errors__: ClassVar[dict[str, type[WaxBaseAssertionError]]] = {}

    def __init__(self, raw: AbstractCxxError) -> None:
        super().__init__(str(raw))
        self.__raw = raw

    @property
    def raw(self) -> AbstractCxxError:
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
        return self.__raw.stack[0].data

    @property
    def message(self) -> str:
        return self.__raw.formatted_message()

    @classmethod
    def register_error(cls, *, category: str) -> Callable[[type[WaxBaseAssertionError]], type[WaxBaseAssertionError]]:
        def decorator(error_cls: type[WaxBaseAssertionError]) -> type[WaxBaseAssertionError]:
            cls.__registered_errors__[category] = error_cls
            return error_cls

        return decorator

    @classmethod
    def resolve_error_cls(cls, exception: Exception | str | bytes | dict[str, Any]) -> Exception:
        try:
            ex_raw = cls.__parse_input(exception)
            loaded_exception = WaxBaseAssertionError.__make_instance(AbstractCxxError, ex_raw)
            try:
                err_cls = cls.__registered_errors__[loaded_exception.category]
                return err_cls(raw=loaded_exception)
            except (KeyError, CategoryNotFoundError, SubcategoryNotFoundError, DecodeError):
                return loaded_exception
        except (TypeError, DecodeError):
            return UnhandableWaxError(exception)

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
    def __make_instance(cls, err_cls: type[AbstractCxxError], data: str | dict[str, Any]) -> AbstractCxxError:
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
