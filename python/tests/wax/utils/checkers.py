from __future__ import annotations

from wax._private.proto_utils import message_to_json_with_defaults
from wax.cpp_python_bridge import validate_proto_operation, validate_proto_transaction
from wax.proto.operations import operation
from wax.proto.transaction import transaction


def check_operations(operation_proto: operation) -> None:
    operation_json = message_to_json_with_defaults(operation_proto).encode()
    print(operation_json.decode())
    result = validate_proto_operation(operation_json)
    print(result)
    assert result.status == result.status.ok


def check_transaction(transaction_proto: transaction) -> None:
    transaction_json = message_to_json_with_defaults(transaction_proto)
    result = validate_proto_transaction(transaction_json.encode())
    print(result)
    assert result.status == result.status.ok
