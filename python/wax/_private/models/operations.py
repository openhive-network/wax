from __future__ import annotations

from typing import Any, TypeAlias

from google.protobuf.message import Message

WaxMetaOperation: TypeAlias = Message
ProtoOperation: TypeAlias = dict[str, Any] | str | Message
ProtocolOperation: TypeAlias = dict[str, Any] | str
Operation: TypeAlias = ProtoOperation | ProtocolOperation
