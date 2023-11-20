from utils.checkers import check_operations, check_transaction

from wax.proto import (
    change_recovery_account_pb2,
    operation_pb2,
    transaction_pb2,
    future_extensions_pb2
)

def test_change_recovery_account():
    extension: future_extensions_pb2.future_extensions = future_extensions_pb2.future_extensions()
    change_recovery_account: change_recovery_account_pb2.change_recovery_account = change_recovery_account_pb2.change_recovery_account(
        account_to_recover="account",
        new_recovery_account="account1",
        extensions=[]
    )

    change_recovery_account_operation: operation_pb2.operation = operation_pb2.operation(
        change_recovery_account=change_recovery_account
    )

    check_operations(change_recovery_account_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[change_recovery_account_operation]
    )

    check_transaction(transaction)
