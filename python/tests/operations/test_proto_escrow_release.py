from utils.checkers import check_operations, check_transaction

from wax.proto import (
    asset_pb2,
    operation_pb2,
    transaction_pb2,
    escrow_release_pb2
)

def test_escrow_release():
    hbd_amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000013", precision=3, amount="357000"
    )
    hive_amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="357000"
    )

    escrow_release: escrow_release_pb2.escrow_release = escrow_release_pb2.escrow_release(
        from_account="faddy",
        to_account="daddy",
        agent="agent",
        who="daddy",
        receiver="faddy",
        escrow_id=1,
        hbd_amount=hbd_amount,
        hive_amount=hive_amount
    )

    escrow_release_operation: operation_pb2.operation = (
        operation_pb2.operation(escrow_release=escrow_release)
    )

    check_operations(escrow_release_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[escrow_release_operation]
    )

    check_transaction(transaction)
