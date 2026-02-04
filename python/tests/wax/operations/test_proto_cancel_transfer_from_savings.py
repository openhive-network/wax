from tests.wax.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    operation,
    cancel_transfer_from_savings,
)
from wax.proto.transaction import transaction


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
