from utils.checkers import check_operations, check_transaction

from wax.proto import (
    asset_pb2,
    account_create_with_delegation_pb2,
    operation_pb2,
    transaction_pb2,
    future_extensions_pb2,
    authority_pb2
)

def test_account_create_with_delegation():
    extension: future_extensions_pb2.future_extensions = future_extensions_pb2.future_extensions()
    asset: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="10"
    )
    authority: authority_pb2.authority = authority_pb2.authority(
        weight_threshold=1,
        account_auths={"STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo": 1},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1},
    )
    account_create_with_delegation: account_create_with_delegation_pb2.account_create_with_delegation = account_create_with_delegation_pb2.account_create_with_delegation(
        fee=asset,
        delegation=asset,
        creator="creator",
        new_account_name="new_account_name",
        owner=authority,
        active=authority,
        posting=authority,
        memo_key="STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo",
        json_metadata="{}",
        extensions=[]
    )

    account_create_with_delegation_operation: operation_pb2.operation = operation_pb2.operation(
        account_create_with_delegation=account_create_with_delegation
    )

    check_operations(account_create_with_delegation_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[account_create_with_delegation_operation]
    )

    check_transaction(transaction)
