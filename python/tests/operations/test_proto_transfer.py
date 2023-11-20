from utils.checkers import check_operations, check_transaction

from wax.proto import (
    asset_pb2,
    operation_pb2,
    transaction_pb2,
    transfer_pb2
)

def test_transfer():
    amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="357000"
    )

    transfer: transfer_pb2.transfer = transfer_pb2.transfer(
        from_account="faddy",
        to_account="daddy",
        amount=amount,
        memo="memo"
    )

    transfer_operation: operation_pb2.operation = (
        operation_pb2.operation(transfer=transfer)
    )

    check_operations(transfer_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[transfer_operation]
    )

    check_transaction(transaction)
