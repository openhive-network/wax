from tests.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    change_recovery_account,
    operation,
)
from wax.proto.transaction import transaction
from wax._private.proto.future_extensions_pb2 import future_extensions

def test_change_recovery_account():
    extension: future_extensions = future_extensions()
    change_recovery_account_proto: change_recovery_account = change_recovery_account(
        account_to_recover="account",
        new_recovery_account="account1",
        extensions=[]
    )

    change_recovery_account_operation: operation = operation(
        change_recovery_account=change_recovery_account_proto
    )

    check_operations(change_recovery_account_operation)

    proto_transaction: transaction = transaction(
        operations=[change_recovery_account_operation]
    )

    check_transaction(proto_transaction)
