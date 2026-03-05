from wax.proto.authority import authority
from wax.proto.operations import account_update, operation
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_account_update():
    posting: authority = authority(
        weight_threshold=1,
        account_auths={"account": 1, "account1": 2},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1},
    )
    account_update_proto: account_update = account_update(
        account="theoretical",
        posting=posting,
        memo_key="STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo",
        json_metadata="",
    )

    account_update_operation: operation = operation(account_update_operation=account_update_proto)

    check_operations(account_update_operation)

    proto_transaction: transaction = transaction(operations=[account_update_operation])

    check_transaction(proto_transaction)
