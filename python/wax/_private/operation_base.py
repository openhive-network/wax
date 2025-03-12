from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, Iterable, TypeAlias

from wax.proto.operations import operation

if TYPE_CHECKING:
    from wax.interfaces import IWaxBaseInterface


ConvertedToProtoOperation: TypeAlias = operation


class OperationBase(ABC):
    @abstractmethod
    def finalize(self, api: IWaxBaseInterface) -> Iterable[ConvertedToProtoOperation]: ...
