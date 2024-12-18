from __future__ import annotations

import json
from typing import Any, TypeAlias, cast

from google.protobuf.json_format import MessageToJson
from google.protobuf.message import Message

from schemas.operation import Operation
from schemas.operations.representation_types import Hf26OperationRepresentationType
from schemas.operations.representations import HF26Representation, convert_to_representation
from wax._private.core.encoders import to_cpp_string, to_python_string
from wax._private.exceptions import InvalidOperationFormatError, WaxValidationFailedError
from wax._private.result_tools import validate_wax_result
from wax.cpp_python_bridge import api_to_proto, proto_to_api
from wax.wax_result import python_result

OperationCreatable: TypeAlias = Message
OperationHF26: TypeAlias = (
    bytes | dict[str, Any] | str | python_result | Message | Operation | Hf26OperationRepresentationType
)


def prepare_operation_to_validate(operation: OperationHF26) -> bytes:
    if isinstance(operation, Message):
        operation = proto_to_api(to_cpp_string(MessageToJson(operation)))

    if isinstance(operation, bytes):
        return operation

    if isinstance(operation, str):
        return to_cpp_string(operation)

    if isinstance(operation, python_result):
        validate_wax_result(operation)
        return operation.result

    if isinstance(operation, HF26Representation):
        return to_cpp_string(operation.json(by_alias=True))

    if isinstance(operation, Operation):
        return to_cpp_string(cast(HF26Representation, convert_to_representation(operation)).json(by_alias=True))

    return to_cpp_string(json.dumps(operation))


def prepare_operation_to_get_impacted_accounts(operation: OperationHF26) -> bytes:
    if isinstance(operation, bytes):
        operation = to_python_string(operation)

    if isinstance(operation, str):
        operation = json.loads(operation)

    if isinstance(operation, python_result):
        validate_wax_result(operation)
        operation = to_python_string(operation.result)

    if isinstance(operation, Message):
        return to_cpp_string(MessageToJson(operation))

    if isinstance(operation, HF26Representation):
        operation = operation.dict(by_alias=True)

    if isinstance(operation, Operation):
        operation = cast(HF26Representation, convert_to_representation(operation)).dict(by_alias=True)

    assert isinstance(operation, dict), "Operation must be dict at this moment."

    try:
        formatted_operation = api_to_proto(to_cpp_string(json.dumps(operation)))
        validate_wax_result(formatted_operation)
    except WaxValidationFailedError as error:
        raise InvalidOperationFormatError("Operation is not in the correct format.") from error

    return formatted_operation.result
