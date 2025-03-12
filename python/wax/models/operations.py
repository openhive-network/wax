from __future__ import annotations

from typing import Any, TypeAlias

from google.protobuf.message import Message

from wax._private.operation_base import OperationBase

WaxMetaOperation: TypeAlias = Message | OperationBase
ProtoOperation: TypeAlias = dict[str, Any] | str | Message
ProtocolOperation: TypeAlias = dict[str, Any] | str
Operation: TypeAlias = ProtoOperation | ProtocolOperation
