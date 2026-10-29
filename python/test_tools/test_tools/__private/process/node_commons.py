from __future__ import annotations

from collections.abc import Iterable
from pathlib import Path
from typing import TYPE_CHECKING, Any, Generic, Literal, Self, TypeVar

from hiveio_api.fields.serializable import Serializable

if TYPE_CHECKING:
    BacktraceAllowedValues = Literal["yes", "no"]
    SinkAllowedValues = Literal["STDERR", "STDOUT", "WLOG", "ELOG", "DLOG", "ILOG"]
    ReportTypes = Literal["NONE", "MINIMAL", "REGULAR", "FULL"]
else:
    BacktraceAllowedValues = str
    SinkAllowedValues = str
    ReportTypes = str


class QuotedMarker:
    """Following string will be serialized with quotes and will be deserialized without them."""


if TYPE_CHECKING:
    StringQuoted = str
    PathQuoted = Path
else:

    class StringQuoted(str, Serializable):
        @classmethod
        def deserialize(cls, value: str) -> StringQuoted:
            if len(value) == 0 or value == '""':
                return StringQuoted()
            return StringQuoted(value.strip('"'))

        def serialize(self) -> Any:
            return f'"{self}"'

    class PathQuoted(Path, Serializable):
        @classmethod
        def deserialize(cls, value: str) -> PathQuoted:
            if len(value) == 0 or value == '""':
                return PathQuoted()
            return PathQuoted(value.strip('"'))

        def serialize(self) -> Any:
            return f'"{self.as_posix()}"'


T = TypeVar("T")


class UniqueList(list[T], Serializable, Generic[T]):
    def __init__(self, _obj: Iterable[T] | T = []) -> None:  # noqa: B006
        super().__init__(set(_obj) if isinstance(_obj, Iterable) else [_obj])
        self.sort()

    def append(self, __object: T) -> None:
        if __object not in self:
            super().append(__object)
            self.sort()

    def extend(self, __iterable: Iterable[T]) -> None:
        outcome = {*self, *__iterable}
        self.clear()
        super().extend(outcome)
        self.sort()

    def __iadd__(self, _: Any) -> Self:  # type: ignore[override]
        raise NotImplementedError

    def __add__(self, _: Any) -> Self:  # type: ignore[override]
        raise NotImplementedError

    def serialize(self) -> Any:
        return list(self)
