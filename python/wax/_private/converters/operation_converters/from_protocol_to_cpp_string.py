from __future__ import annotations

import json
from functools import singledispatch
from typing import TYPE_CHECKING, Any

from wax._private.exceptions import InvalidOperationFormatError
from wax._private.result_tools import to_cpp_string

if TYPE_CHECKING:
    from wax._private.models.operations import ProtocolOperation


@singledispatch
def from_protocol_to_cpp_string(operation: ProtocolOperation) -> bytes:
    raise InvalidOperationFormatError(
        f"Operation in format {type(operation)} not recognized when converted from protocol format to bytes."
    )


@from_protocol_to_cpp_string.register(str)
def _(operation: str) -> bytes:
    return to_cpp_string(operation)


@from_protocol_to_cpp_string.register(dict)
def _(operation: dict[str, Any]) -> bytes:
    return to_cpp_string(json.dumps(operation))
