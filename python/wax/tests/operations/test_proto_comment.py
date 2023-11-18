from utils.checkers import check_operations, check_transaction

from wax.proto import (
    comment_pb2,
    operation_pb2,
    transaction_pb2
)


def test_comment():
    comment: comment_pb2.comment = comment_pb2.comment(
        parent_permlink="/",
        parent_author="",
        author="alice",
        permlink="/",
        title="Best comment",
        body="<span>comment</span>",
        json_metadata="{}",
    )

    comment_operation: operation_pb2.operation = operation_pb2.operation(
        comment=comment
    )

    check_operations(comment_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[comment_operation]
    )

    check_transaction(transaction)
