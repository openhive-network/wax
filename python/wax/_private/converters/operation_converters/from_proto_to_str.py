from __future__ import annotations

import json
from functools import singledispatch
from typing import TYPE_CHECKING, Any

from google.protobuf.json_format import MessageToJson
from google.protobuf.message import Message

from wax.exceptions.validation_errors import InvalidOperationFormatError

if TYPE_CHECKING:
    from wax.models.operations import ProtoOperation


@singledispatch
def from_proto_to_str(operation: ProtoOperation) -> str:
    raise InvalidOperationFormatError(
        f"Operation in format {type(operation)} not recognized when converted from proto format to bytes."
    )


@from_proto_to_str.register(str)
def _(operation: str) -> str:
    return operation


@from_proto_to_str.register(dict)
def _(operation: dict[str, Any]) -> str:
    return json.dumps(operation)


@from_proto_to_str.register(Message)
def _(operation: Message) -> str:
    return MessageToJson(operation)
