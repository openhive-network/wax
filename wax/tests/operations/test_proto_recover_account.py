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
    authority: authority_pb2.authority = authority_pb2.authority(
        weight_threshold=1,
        account_auths={"STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo": 1},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1}
    )
    recover_account: recover_account_pb2.recover_account = recover_account_pb2.recover_account(
        account_to_recover="account",
        new_owner_authority=authority,
        recent_owner_authority=authority,
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
