from wax.proto.operations import (
    cancel_transfer_from_savings,
    operation,
)
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_cancel_transfer_from_savings():
    cancel_transfer_from_savings_proto: cancel_transfer_from_savings = cancel_transfer_from_savings(
        from_account="faddy", request_id=3
    )

    cancel_transfer_from_savings_operation: operation = operation(
        cancel_transfer_from_savings_operation=cancel_transfer_from_savings_proto
    )

    check_operations(cancel_transfer_from_savings_operation)

    transaction_proto: transaction = transaction(operations=[cancel_transfer_from_savings_operation])

    check_transaction(transaction_proto)
