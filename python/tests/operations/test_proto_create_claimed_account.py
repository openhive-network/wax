from utils.checkers import check_operations, check_transaction

from wax.proto import (
    asset_pb2,
    create_claimed_account_pb2,
    operation_pb2,
    transaction_pb2,
    future_extensions_pb2,
    authority_pb2
)

def test_create_claimed_account():
    extension: future_extensions_pb2.future_extensions = future_extensions_pb2.future_extensions()
    asset: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="10"
    )
    authority: authority_pb2.authority = authority_pb2.authority(
        weight_threshold=1,
        account_auths={"account": 1, "account1": 2},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1}
    )
    create_claimed_account: create_claimed_account_pb2.create_claimed_account = create_claimed_account_pb2.create_claimed_account(
        creator="creator",
        new_account_name="account",
        owner=authority,
        active=authority,
        posting=authority,
        memo_key="STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo",
        json_metadata="{}",
        extensions=[]
    )

    create_claimed_account_operation: operation_pb2.operation = operation_pb2.operation(
        create_claimed_account=create_claimed_account
    )

    check_operations(create_claimed_account_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[create_claimed_account_operation]
    )

    check_transaction(transaction)
