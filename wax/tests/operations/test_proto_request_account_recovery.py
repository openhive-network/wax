from utils.checkers import check_operations, check_transaction

from wax.proto import (
    request_account_recovery_pb2,
    operation_pb2,
    transaction_pb2,
    future_extensions_pb2,
    authority_pb2
)

def test_request_account_recovery():
    extension: future_extensions_pb2.future_extensions = future_extensions_pb2.future_extensions()
    authority: authority_pb2.authority = authority_pb2.authority(
        weight_threshold=1,
        account_auths={"STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo": 1},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1}
    )
    request_account_recovery: request_account_recovery_pb2.request_account_recovery = request_account_recovery_pb2.request_account_recovery(
        recovery_account="rec_account",
        account_to_recover="account",
        new_owner_authority=authority,
        extensions=[]
    )

    request_account_recovery_operation: operation_pb2.operation = operation_pb2.operation(
        request_account_recovery=request_account_recovery
    )

    check_operations(request_account_recovery_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[request_account_recovery_operation]
    )

    check_transaction(transaction)
