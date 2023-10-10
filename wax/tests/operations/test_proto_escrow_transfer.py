from utils.checkers import check_operations, check_transaction

from wax.proto import (
    asset_pb2,
    operation_pb2,
    transaction_pb2,
    escrow_transfer_pb2
)

def test_escrow_transfer():
    amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="357000"
    )

    escrow_transfer: escrow_transfer_pb2.escrow_transfer = escrow_transfer_pb2.escrow_transfer(
        from_account="faddy",
        to_account="daddy",
        agent="agent",
        escrow_id=1,
        hbd_amount=amount,
        hive_amount=amount,
        fee=amount,
        ratification_deadline="2023-12-30T00:00:00",
        escrow_expiration="2023-11-30T00:00:00",
        json_meta="{}"
    )

    escrow_transfer_operation: operation_pb2.operation = (
        operation_pb2.operation(escrow_transfer=escrow_transfer)
    )

    check_operations(escrow_transfer_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[escrow_transfer_operation]
    )

    check_transaction(transaction)
