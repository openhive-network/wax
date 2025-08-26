from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from schemas.fields.resolvables import Resolvable

from wax._private.core.constants import HIVE_TIME_FORMAT

__all__ = [
    "HiveDateTime",
]


class HiveDateTime(datetime, Resolvable["HiveDateTime", str | datetime]):
    def __new__(cls, value: str | datetime | HiveDateTime, *args: Any) -> HiveDateTime:  # NOQA: PYI034
        # source: https://stackoverflow.com/a/45981230
        if len(args) > 0:
            value = datetime(value, *args)  # type: ignore[arg-type] # NOQA: DTZ001
        date = cls.__convert_to_datetime(value)
        return super().__new__(
            cls,
            date.year,
            date.month,
            date.day,
            date.hour,
            date.minute,
            date.second,
            date.microsecond,
            date.tzinfo,
            fold=date.fold,
        )

    def __copy__(self) -> HiveDateTime:
        return HiveDateTime.resolve(HiveDateTime, self.serialize())

    def __deepcopy__(self, memo: Any) -> HiveDateTime:  # NOQA: ANN401
        return self.__copy__()

    @classmethod
    def __convert_to_datetime(cls, value: str | datetime) -> datetime:
        if isinstance(value, datetime):
            return cls.__normalize(value)
        if isinstance(value, str):
            try:
                return cls.__normalize(datetime.strptime(value, HIVE_TIME_FORMAT))  # NOQA: DTZ007
            except ValueError as error:
                raise ValueError(f"Date must be in format {HIVE_TIME_FORMAT}") from error
        raise TypeError("Value must be a datetime or a string in the correct format.")

    @classmethod
    def __normalize(cls, value: datetime) -> datetime:
        return value.replace(tzinfo=timezone.utc)

    @staticmethod
    def resolve(incoming_cls: type, value: str | datetime) -> HiveDateTime:  # noqa: ARG004
        return HiveDateTime(value=value)

    @staticmethod
    def now() -> HiveDateTime:  # type: ignore[override]
        return HiveDateTime(value=datetime.now())  # NOQA: DTZ005

    def serialize(self) -> str:
        return self.strftime(HIVE_TIME_FORMAT)
