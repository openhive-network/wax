from python.tests.utils.checkers import check_transaction
from wax.proto import comment_pb2, operation_pb2, transaction_pb2, vote_pb2


def test_transaction() -> None:
    vote: vote_pb2.vote = vote_pb2.vote(voter="alice", author="author", permlink="/", weight=11)  # type: ignore[annotation-unchecked]
    vote_operation: operation_pb2.operation = operation_pb2.operation(vote=vote)  # type: ignore[annotation-unchecked]

    comment: comment_pb2.comment = comment_pb2.comment(  # type: ignore[annotation-unchecked]
        parent_permlink="/",
        parent_author="",
        author="alice",
        permlink="/",
        title="Best comment",
        body="<span>comment</span>",
        json_metadata="{}",
    )
    comment_operation: operation_pb2.operation = operation_pb2.operation(comment=comment)  # type: ignore[annotation-unchecked]

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(  # type: ignore[annotation-unchecked]
        operations=[vote_operation, comment_operation]
    )

    check_transaction(transaction)
    check_transaction(transaction)
