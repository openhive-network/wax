from utils.checkers import check_operations

from wax.proto import comment_pb2, transaction_pb2


def test_comment_operation():
    comment: comment_pb2.comment = comment_pb2.comment(
        parent_permlink="/",
        parent_author="",
        author="alice",
        permlink="/",
        title="Best comment",
        body="<span>comment</span>",
        json_metadata="{}",
    )

    comment_operation: transaction_pb2.operation = transaction_pb2.operation(
        comment=comment
    )

    check_operations(comment_operation)
