from tests.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    operation,
    transfer_from_savings,
)
from wax.proto.asset import asset
from wax.proto.transaction import transaction


def test_transfer_from_savings():
    amount: asset = asset(
        nai="@@000000021", precision=3, amount="7000"
    )

    transfer_from_savings_proto: transfer_from_savings = (
        transfer_from_savings(
            from_account="abcde",
            request_id=3,
            to_account="abcdef",
            amount=amount,
            memo="memo"
        )
    )

    transfer_from_savings_operation: operation = (
        operation(transfer_from_savings_operation=transfer_from_savings_proto)
    )

    check_operations(transfer_from_savings_operation)

    transaction_proto: transaction = transaction(
        operations=[transfer_from_savings_operation]
    )

    check_transaction(transaction_proto)
