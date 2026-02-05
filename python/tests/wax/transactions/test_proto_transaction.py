from tests.wax.utils.checkers import check_transaction
from wax.proto.operations import comment, operation, vote
from wax.proto.transaction import transaction


def test_transaction() -> None:
    vote_proto: vote = vote(voter="alice", author="author", permlink="/", weight=11)
    vote_operation: operation = operation(vote_operation=vote_proto)

    comment_proto: comment = comment(
        parent_permlink="/",
        parent_author="",
        author="alice",
        permlink="/",
        title="Best comment",
        body="<span>comment</span>",
        json_metadata="{}",
    )
    comment_operation: operation = operation(comment_operation=comment_proto)

    transaction_proto: transaction = transaction(
        operations=[vote_operation, comment_operation]
    )

    check_transaction(transaction_proto)
    check_transaction(transaction_proto)
