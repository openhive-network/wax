from wax_local_tools.checkers import check_operations, check_transaction

from wax.proto.operations import operation, escrow_transfer
from wax.proto.asset import asset
from wax.proto.transaction import transaction


def test_escrow_transfer():
    hbd_amount: asset = asset(nai="@@000000013", precision=3, amount="357000")
    hive_amount: asset = asset(nai="@@000000021", precision=3, amount="357000")

    escrow_transfer_proto: escrow_transfer = escrow_transfer(
        from_account="faddy",
        to_account="daddy",
        agent="agent",
        escrow_id=1,
        hbd_amount=hbd_amount,
        hive_amount=hive_amount,
        fee=hive_amount,
        ratification_deadline="2023-11-30T00:00:00",
        escrow_expiration="2023-12-30T00:00:00",
        json_meta="{}",
    )

    escrow_transfer_operation: operation = operation(escrow_transfer_operation=escrow_transfer_proto)

    check_operations(escrow_transfer_operation)

    proto_transaction: transaction = transaction(operations=[escrow_transfer_operation])

    check_transaction(proto_transaction)
