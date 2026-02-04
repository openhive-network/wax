from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, Iterable, TypeAlias

from google.protobuf.message import Message

if TYPE_CHECKING:
    from wax.interfaces import IWaxBaseInterface


ConvertedToProtoOperation: TypeAlias = Message


class OperationBase(ABC):
    @abstractmethod
    def finalize(self, api: IWaxBaseInterface) -> Iterable[ConvertedToProtoOperation]: ...
