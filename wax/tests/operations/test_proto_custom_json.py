from utils.checkers import check_operations, check_transaction

from wax.proto import (
    custom_json_pb2,
    operation_pb2,
    transaction_pb2
)

'''
        required_auths: collections.abc.Iterable[builtins.str] | None = ...,
        required_posting_auths: collections.abc.Iterable[builtins.str] | None = ...,
        id: builtins.str | None = ...,
        json: builtins.str | None = ...,
'''

def test_custom_json():
    custom_json: custom_json_pb2.custom_json = custom_json_pb2.custom_json(
        required_auths=["bytemaster"],
        required_posting_auths=["other"],
        id="666",
        json="{}"
    )

    custom_json_operation: operation_pb2.operation = operation_pb2.operation(
        custom_json=custom_json
    )
    check_operations(custom_json_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[custom_json_operation]
    )

    check_transaction(transaction)
