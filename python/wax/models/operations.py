from __future__ import annotations

from typing import Any, TypeAlias

from google.protobuf.message import Message

from wax._private.operation_base import OperationBase

WaxMetaOperation: TypeAlias = Message | OperationBase
"""WaxMetaOperation is a type alias for a protobuf message or an OperationBase instance."""
ProtoOperation: TypeAlias = dict[str, Any] | str | Message
"""ProtoOperation is a type alias for a type that can be converted to a proto message."""
ProtocolOperation: TypeAlias = dict[str, Any] | str
"""ProtocolOperation is a type alias for the operation in the protocol (hf26) format."""
Operation: TypeAlias = ProtoOperation | ProtocolOperation
"""Either a proto or a protocol(hf26) operation."""
