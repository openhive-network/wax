from utils.checkers import check_operations, check_transaction

from wax.proto import (
    asset_pb2,
    operation_pb2,
    transaction_pb2,
    transfer_from_savings_pb2
)

def test_transfer_from_savings():
    amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="7000"
    )

    transfer_from_savings: transfer_from_savings_pb2.transfer_from_savings = (
        transfer_from_savings_pb2.transfer_from_savings(
            from_account="abcde",
            request_id=3,
            to_account="abcdef",
            amount=amount,
            memo="memo"
        )
    )

    transfer_from_savings_operation: operation_pb2.operation = (
        operation_pb2.operation(transfer_from_savings=transfer_from_savings)
    )

    check_operations(transfer_from_savings_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[transfer_from_savings_operation]
    )

    check_transaction(transaction)
