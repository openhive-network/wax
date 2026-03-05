from wax_local_tools.checkers import check_operations, check_transaction

from wax.proto.operations import operation, escrow_release
from wax.proto.asset import asset
from wax.proto.transaction import transaction


def test_escrow_release():
    hbd_amount: asset = asset(nai="@@000000013", precision=3, amount="357000")
    hive_amount: asset = asset(nai="@@000000021", precision=3, amount="357000")

    escrow_release_proto: escrow_release = escrow_release(
        from_account="faddy",
        to_account="daddy",
        agent="agent",
        who="daddy",
        receiver="faddy",
        escrow_id=1,
        hbd_amount=hbd_amount,
        hive_amount=hive_amount,
    )

    escrow_release_operation: operation = operation(escrow_release_operation=escrow_release_proto)

    check_operations(escrow_release_operation)

    transaction_proto: transaction = transaction(operations=[escrow_release_operation])

    check_transaction(transaction_proto)
