from tests.utils.checkers import check_operations, check_transaction

from wax.proto.operations import operation, escrow_approve
from wax.proto.transaction import transaction


def test_escrow_approve():
    escrow_approve_proto: escrow_approve = escrow_approve(
        from_account="faddy", to_account="daddy", agent="agent", who="daddy", escrow_id=1, approve=True
    )

    escrow_approve_operation: operation = operation(escrow_approve_operation=escrow_approve_proto)

    check_operations(escrow_approve_operation)

    transaction_proto: transaction = transaction(operations=[escrow_approve_operation])

    check_transaction(transaction_proto)
