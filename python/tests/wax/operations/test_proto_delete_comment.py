from tests.wax.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    delete_comment,
    operation,
)
from wax.proto.transaction import transaction


def test_delete_comment():
    delete_comment_proto: delete_comment = delete_comment(
        author="alice",
        permlink="/",
    )

    delete_comment_operation: operation = operation(delete_comment_operation=delete_comment_proto)

    check_operations(delete_comment_operation)

    proto_transaction: transaction = transaction(operations=[delete_comment_operation])

    check_transaction(proto_transaction)
