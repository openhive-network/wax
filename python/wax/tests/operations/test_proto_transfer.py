from wax_local_tools.checkers import check_operations, check_transaction

from wax.proto.operations import (
    operation,
    transfer,
)
from wax.proto.asset import asset
from wax.proto.transaction import transaction


def test_transfer():
    amount: asset = asset(nai="@@000000021", precision=3, amount="357000")

    transfer_proto: transfer = transfer(from_account="faddy", to_account="daddy", amount=amount, memo="memo")

    transfer_operation: operation = operation(transfer_operation=transfer_proto)

    check_operations(transfer_operation)

    transaction_proto: transaction = transaction(operations=[transfer_operation])

    check_transaction(transaction_proto)
