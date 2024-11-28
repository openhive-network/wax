from __future__ import annotations

import json
from typing import Any, TypeAlias

from google.protobuf.json_format import MessageToJson
from google.protobuf.message import Message

from wax import api_to_proto, proto_to_api
from wax._private.exceptions import InvalidOperationFormatError, WaxValidationFailedError
from wax._private.result_tools import to_cpp_string, to_python_string, validate_wax_result
from wax.wax_result import python_result

WaxMetaOperation: TypeAlias = Message
Operation: TypeAlias = bytes | dict[str, Any] | str | python_result | Message


def prepare_operation_to_validate(operation: Operation) -> bytes:
    if isinstance(operation, Message):
        operation = proto_to_api(to_cpp_string(MessageToJson(operation)))

    if isinstance(operation, bytes):
        return operation

    if isinstance(operation, str):
        return to_cpp_string(operation)

    if isinstance(operation, python_result):
        validate_wax_result(operation)
        return operation.result

    return to_cpp_string(json.dumps(operation))


def prepare_operation_to_get_impacted_accounts(operation: Operation) -> bytes:
    if isinstance(operation, bytes):
        operation = to_python_string(operation)

    if isinstance(operation, str):
        operation = json.loads(operation)

    if isinstance(operation, python_result):
        validate_wax_result(operation)
        operation = to_python_string(operation.result)

    if isinstance(operation, Message):
        return to_cpp_string(MessageToJson(operation))

    assert isinstance(operation, dict), "Operation must be dict at this moment."

    try:
        formatted_operation = api_to_proto(to_cpp_string(json.dumps(operation)))
        validate_wax_result(formatted_operation)
    except WaxValidationFailedError as error:
        raise InvalidOperationFormatError("Operation is not in the correct format.") from error

    return formatted_operation.result
