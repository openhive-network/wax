from wax_local_tools.checkers import check_operations, check_transaction

from wax.proto.operations import (
    comment,
    operation,
)
from wax.proto.transaction import transaction


def test_comment():
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

    check_operations(comment_operation)

    transaction_proto: transaction = transaction(operations=[comment_operation])

    check_transaction(transaction_proto)
