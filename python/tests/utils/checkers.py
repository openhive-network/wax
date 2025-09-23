from google.protobuf.json_format import MessageToJson

from wax.cpp_python_bridge import validate_proto_operation, validate_proto_transaction
from wax.proto.operations import operation
from wax.proto.transaction import transaction

def check_operations(operation_proto: operation) -> None:
    operation_json = MessageToJson(operation_proto, including_default_value_fields=True)
    print(operation_json)
    # We do not convert operations (legacy code)
    # result = proto_to_api(operation_json)
    # print(result)
    result = validate_proto_operation(operation_json)
    print(result)
    assert result.status == result.status.ok


def check_transaction(transaction_proto: transaction) -> None:
    transaction_json = MessageToJson(transaction_proto, including_default_value_fields=True)
    result = validate_proto_transaction(transaction_json)
    print(result)
    assert result.status == result.status.ok
