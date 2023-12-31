from utils.checkers import check_operations, check_transaction

from wax.proto import (
    account_update_pb2,
    authority_pb2,
    operation_pb2,
    transaction_pb2
)


def test_account_update():
    posting: authority_pb2.authority = authority_pb2.authority(
        weight_threshold=1,
        account_auths={"account": 1, "account1": 2},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1},
    )
    account_update: account_update_pb2.account_update = (
        account_update_pb2.account_update(
            account="theoretical",
            posting=posting,
            memo_key="STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo",
            json_metadata="",
        )
    )

    account_update_operation: operation_pb2.operation = operation_pb2.operation(
        account_update=account_update
    )

    check_operations(account_update_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[account_update_operation]
    )

    check_transaction(transaction)
