from __future__ import annotations

import json
from functools import singledispatch
from typing import TYPE_CHECKING, Any

from wax._private.result_tools import to_cpp_string
from wax.exceptions.validation_errors import InvalidOperationFormatError

if TYPE_CHECKING:
    from wax.models.operations import ProtocolOperation


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
