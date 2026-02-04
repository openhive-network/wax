from __future__ import annotations

import json
from functools import singledispatch
from typing import TYPE_CHECKING, Any

from google.protobuf.message import Message
from typing_extensions import TypeIs

from wax.exceptions.validation_errors import InvalidOperationFormatError

if TYPE_CHECKING:
    from wax.models.operations import Operation, ProtocolOperation


@singledispatch
def is_hive_protocol_format(operation: Operation) -> TypeIs[ProtocolOperation]:
    raise InvalidOperationFormatError(f"Operation format {type(operation)} not recognized.")


@is_hive_protocol_format.register(str)
def _(operation: str) -> bool:
    as_dict = json.loads(operation)
    return "type" in as_dict


@is_hive_protocol_format.register(Message)
def _(operation: Message) -> bool:  # noqa: ARG001
    return False


@is_hive_protocol_format.register(dict)
def _(operation: dict[str, Any]) -> bool:
    return "type" in operation
