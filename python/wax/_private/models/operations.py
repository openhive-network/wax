from __future__ import annotations

import json
from typing import Any, TypeAlias, cast

from google.protobuf.json_format import MessageToJson

from schemas.operation import Operation
from schemas.operations.representation_types import Hf26OperationRepresentationType
from schemas.operations.representations import HF26Representation, convert_to_representation
from wax._private.exceptions import InvalidOperationFormatError
from wax.cpp_python_bridge import proto_to_api
from wax.proto import operation_pb2
from wax.wax_result import python_error_code, python_result

OperationCreatable: TypeAlias = operation_pb2.operation
OperationHF26: TypeAlias = (
    bytes | dict[str, Any] | str | python_result | operation_pb2.operation | Operation | Hf26OperationRepresentationType
)


def prepare_operation_to_validate(operation: OperationHF26) -> bytes:
    if isinstance(operation, operation_pb2.operation):
        operation = proto_to_api(MessageToJson(operation).encode())

    if isinstance(operation, bytes):
        return operation

    if isinstance(operation, str):
        return operation.encode()

    if isinstance(operation, python_result):
        assert_operation_status_ok(operation)
        return operation.result

    if isinstance(operation, HF26Representation):
        return operation.json(by_alias=True).encode()

    if isinstance(operation, Operation):
        return cast(HF26Representation, convert_to_representation(operation)).json(by_alias=True).encode()

    return json.dumps(operation).encode()


def prepare_operation_to_get_impacted_accounts(operation: OperationHF26) -> bytes:
    if isinstance(operation, bytes):
        operation = operation.decode()

    if isinstance(operation, str):
        operation = json.loads(operation)

    if isinstance(operation, python_result):
        assert_operation_status_ok(operation)
        operation = operation.result.decode()

    if isinstance(operation, operation_pb2.operation):
        return MessageToJson(operation).encode()

    if isinstance(operation, HF26Representation):
        operation = operation.dict(by_alias=True)

    if isinstance(operation, Operation):
        operation = cast(HF26Representation, convert_to_representation(operation)).dict(by_alias=True)

    assert isinstance(operation, dict), "Operation must be dict at this moment."

    try:
        formatted_operation = {operation["type"].removesuffix("_operation"): operation["value"]}
    except KeyError as error:
        raise InvalidOperationFormatError(
            "Operation does not have 'type' or 'value' field (is not in HF26 format)."
        ) from error

    return json.dumps(formatted_operation).encode()


def assert_operation_status_ok(operation: python_result) -> None:
    assert operation.status == python_error_code.ok, "Operation is not valid, python result status is not ok."
