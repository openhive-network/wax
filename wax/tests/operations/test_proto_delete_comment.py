from utils.checkers import check_operations, check_transaction

from wax.proto import (
    delete_comment_pb2,
    operation_pb2,
    transaction_pb2
)

def test_delete_comment():
    delete_comment: delete_comment_pb2.delete_comment = delete_comment_pb2.delete_comment(
        author="alice",
        permlink="/",
    )

    delete_comment_operation: operation_pb2.operation = operation_pb2.operation(
        delete_comment=delete_comment
    )

    check_operations(delete_comment_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[delete_comment_operation]
    )

    check_transaction(transaction)
