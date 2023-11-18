from utils.checkers import check_operations, check_transaction

from wax.proto import (
    operation_pb2,
    transaction_pb2,
    cancel_transfer_from_savings_pb2
)

def test_cancel_transfer_from_savings():
    cancel_transfer_from_savings: cancel_transfer_from_savings_pb2.cancel_transfer_from_savings = cancel_transfer_from_savings_pb2.cancel_transfer_from_savings(
        from_account="faddy",
        request_id=3
    )

    cancel_transfer_from_savings_operation: operation_pb2.operation = (
        operation_pb2.operation(cancel_transfer_from_savings=cancel_transfer_from_savings)
    )

    check_operations(cancel_transfer_from_savings_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[cancel_transfer_from_savings_operation]
    )

    check_transaction(transaction)
