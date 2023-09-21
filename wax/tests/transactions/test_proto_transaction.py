from utils.checkers import check_transaction

from wax.proto import comment_pb2, transaction_pb2, vote_pb2


def test_transaction():
    vote: vote_pb2.vote = vote_pb2.vote(
        voter="alice", author="author", permlink="/", weight=11
    )
    vote_operation: transaction_pb2.operation = transaction_pb2.operation(vote=vote)

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

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[vote_operation, comment_operation]
    )

    check_transaction(transaction)
    check_transaction(transaction)
