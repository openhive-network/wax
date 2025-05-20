from tests.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    create_claimed_account,
    operation,
)
from wax.proto.asset import asset
from wax.proto.transaction import transaction
from wax.proto.authority import authority
from wax._private.proto import future_extensions_pb2

def test_create_claimed_account():
    extension: future_extensions_pb2.future_extensions = future_extensions_pb2.future_extensions()
    asset_proto: asset = asset(
        nai="@@000000021", precision=3, amount="10"
    )
    authority_proto: authority = authority(
        weight_threshold=1,
        account_auths={"account": 1, "account1": 2},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1}
    )
    create_claimed_account_proto: create_claimed_account = create_claimed_account(
        creator="creator",
        new_account_name="account",
        owner=authority_proto,
        active=authority_proto,
        posting=authority_proto,
        memo_key="STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo",
        json_metadata="{}",
        extensions=[]
    )

    create_claimed_account_operation: operation = operation(
        create_claimed_account_operation=create_claimed_account_proto
    )

    check_operations(create_claimed_account_operation)

    transaction_proto: transaction = transaction(
        operations=[create_claimed_account_operation]
    )

    check_transaction(transaction_proto)
