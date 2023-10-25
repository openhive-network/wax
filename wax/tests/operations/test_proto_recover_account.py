from utils.checkers import check_operations, check_transaction

from wax.proto import (
    recover_account_pb2,
    operation_pb2,
    transaction_pb2,
    future_extensions_pb2,
    authority_pb2
)

def test_recover_account():
    extension: future_extensions_pb2.future_extensions = future_extensions_pb2.future_extensions()
    authority1: authority_pb2.authority = authority_pb2.authority(
        weight_threshold=1,
        account_auths={"account": 1, "account1": 2},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1}
    )
    authority2: authority_pb2.authority = authority_pb2.authority(
        weight_threshold=1,
        account_auths={"account1": 1, "account2": 2},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1}
    )
    recover_account: recover_account_pb2.recover_account = recover_account_pb2.recover_account(
        account_to_recover="account",
        new_owner_authority=authority1,
        recent_owner_authority=authority2,
        extensions=[]
    )

    recover_account_operation: operation_pb2.operation = operation_pb2.operation(
        recover_account=recover_account
    )

    check_operations(recover_account_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[recover_account_operation]
    )

    check_transaction(transaction)
