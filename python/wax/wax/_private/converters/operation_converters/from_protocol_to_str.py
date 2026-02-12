from __future__ import annotations

import json
from functools import singledispatch
from typing import TYPE_CHECKING, Any

from wax.exceptions.validation_errors import InvalidOperationFormatError

if TYPE_CHECKING:
    from wax.models.operations import ProtocolOperation


@singledispatch
def from_protocol_to_str(operation: ProtocolOperation) -> str:
    raise InvalidOperationFormatError(
        f"Operation in format {type(operation)} not recognized when converted from protocol format to str."
    )


@from_protocol_to_str.register(str)
def _(operation: str) -> str:
    return operation


@from_protocol_to_str.register(dict)
def _(operation: dict[str, Any]) -> str:
    return json.dumps(operation)
