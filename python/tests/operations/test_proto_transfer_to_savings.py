from tests.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    operation,
    transfer_to_savings,
)
from wax.proto.asset import asset
from wax.proto.transaction import transaction

def test_transfer_to_savings():
    amount: asset = asset(
        nai="@@000000021", precision=3, amount="7000"
    )

    transfer_to_savings_proto: transfer_to_savings = (
        transfer_to_savings(
            from_account="faddy",
            to_account="daddy",
            amount=amount,
            memo="memo"
        )
    )

    transfer_to_savings_operation: operation = (
        operation(transfer_to_savings_operation=transfer_to_savings_proto)
    )

    check_operations(transfer_to_savings_operation)

    transaction_proto: transaction = transaction(
        operations=[transfer_to_savings_operation]
    )

    check_transaction(transaction_proto)
