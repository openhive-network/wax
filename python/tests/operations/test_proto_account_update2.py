# account_update2_operation = {
#     "type": "account_update2_operation",
#     "value": {
#         "account": "rosylisboa",
#         "json_metadata": "",
#         "posting_json_metadata": "{}",
#         "extensions": [],
#     },
# }


from utils.checkers import check_operations, check_transaction

from wax.proto import (
    account_update2_pb2,
    operation_pb2,
    transaction_pb2,
    future_extensions_pb2
)

def test_account_update2():
    extension: future_extensions_pb2.future_extensions = future_extensions_pb2.future_extensions()
    account_update2: account_update2_pb2.account_update2 = (
        account_update2_pb2.account_update2(
            account="rosylisboa",
            json_metadata="",
            posting_json_metadata="{}",
            extensions=[]
        )
    )

    account_update2_operation: operation_pb2.operation = operation_pb2.operation(
        account_update2=account_update2
    )

    check_operations(account_update2_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[account_update2_operation]
    )

    check_transaction(transaction)
