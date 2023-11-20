from utils.checkers import check_operations, check_transaction

from wax.proto import (
    operation_pb2,
    transaction_pb2,
    escrow_approve_pb2
)

def test_escrow_approve():
    escrow_approve: escrow_approve_pb2.escrow_approve = escrow_approve_pb2.escrow_approve(
        from_account="faddy",
        to_account="daddy",
        agent="agent",
        who="daddy",
        escrow_id=1,
        approve=True
    )

    escrow_approve_operation: operation_pb2.operation = (
        operation_pb2.operation(escrow_approve=escrow_approve)
    )

    check_operations(escrow_approve_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[escrow_approve_operation]
    )

    check_transaction(transaction)
