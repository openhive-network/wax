from google.protobuf.json_format import MessageToJson

from wax import validate_proto_operation, validate_proto_transaction, proto_to_api
from wax.proto import operation_pb2, transaction_pb2


def check_operations(operation: operation_pb2.operation):
    operation_json = MessageToJson(operation)
    print(operation_json)
    result = proto_to_api(operation_json.encode())
    print(result)
    result = validate_proto_operation(operation_json.encode())
    print(result)
    assert result.status == result.status.ok


def check_transaction(transaction: transaction_pb2.transaction):
    transaction_json = MessageToJson(transaction)
    result = validate_proto_transaction(transaction_json.encode())
    print(result)
    assert result.status == result.status.ok
