from google.protobuf.json_format import MessageToJson

from wax.cpp_python_bridge import validate_proto_operation, validate_proto_transaction, proto_to_api
from wax.proto.operations import operation
from wax.proto.transaction import transaction

def check_operations(operation_proto: operation) -> None:
    operation_json = MessageToJson(operation_proto)
    print(operation_json)
    result = proto_to_api(operation_json.encode())
    print(result)
    result = validate_proto_operation(operation_json.encode())
    print(result)
    assert result.status == result.status.ok


def check_transaction(transaction_proto: transaction) -> None:
    transaction_json = MessageToJson(transaction_proto)
    result = validate_proto_transaction(transaction_json.encode())
    print(result)
    assert result.status == result.status.ok
