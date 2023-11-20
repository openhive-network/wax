from utils.checkers import check_operations, check_transaction

from wax.proto import (
    asset_pb2,
    operation_pb2,
    transaction_pb2,
    transfer_to_savings_pb2
)

def test_transfer_to_savings():
    amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="7000"
    )

    transfer_to_savings: transfer_to_savings_pb2.transfer_to_savings = (
        transfer_to_savings_pb2.transfer_to_savings(
            from_account="faddy",
            to_account="daddy",
            amount=amount,
            memo="memo"
        )
    )

    transfer_to_savings_operation: operation_pb2.operation = (
        operation_pb2.operation(transfer_to_savings=transfer_to_savings)
    )

    check_operations(transfer_to_savings_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[transfer_to_savings_operation]
    )

    check_transaction(transaction)
