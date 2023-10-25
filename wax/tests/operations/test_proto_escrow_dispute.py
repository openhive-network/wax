from utils.checkers import check_operations, check_transaction

from wax.proto import (
    operation_pb2,
    transaction_pb2,
    escrow_dispute_pb2
)

def test_escrow_dispute():
    escrow_dispute: escrow_dispute_pb2.escrow_dispute = escrow_dispute_pb2.escrow_dispute(
        from_account="faddy",
        to_account="daddy",
        agent="agent",
        who="daddy",
        escrow_id=1
    )

    escrow_dispute_operation: operation_pb2.operation = (
        operation_pb2.operation(escrow_dispute=escrow_dispute)
    )

    check_operations(escrow_dispute_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[escrow_dispute_operation]
    )

    check_transaction(transaction)
