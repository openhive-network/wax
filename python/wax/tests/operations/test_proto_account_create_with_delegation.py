from wax_local_tools.checkers import check_operations, check_transaction

from wax.proto.operations import account_create_with_delegation, operation
from wax.proto.asset import asset
from wax.proto.transaction import transaction
from wax.proto.authority import authority
from wax._private.proto.future_extensions_pb2 import future_extensions


def test_account_create_with_delegation():
    extension: future_extensions = future_extensions()
    vests: asset = asset(nai="@@000000037", precision=6, amount="10")
    hive: asset = asset(nai="@@000000021", precision=3, amount="10")
    proto_authority: authority = authority(
        weight_threshold=1,
        account_auths={"account": 1, "account1": 2},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1},
    )
    account_create_with_delegation_proto: account_create_with_delegation = account_create_with_delegation(
        fee=hive,
        delegation=vests,
        creator="creator",
        new_account_name="account2",
        owner=proto_authority,
        active=proto_authority,
        posting=proto_authority,
        memo_key="STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo",
        json_metadata="{}",
        extensions=[],
    )

    account_create_with_delegation_operation: operation = operation(
        account_create_with_delegation_operation=account_create_with_delegation_proto
    )

    check_operations(account_create_with_delegation_operation)

    proto_transaction: transaction = transaction(operations=[account_create_with_delegation_operation])

    check_transaction(proto_transaction)
