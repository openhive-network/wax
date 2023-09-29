# account_witness_proxy_operation = {
#   "type": "account_witness_proxy_operation",
#   "value": {
#     "account": "bunkermining",
#     "proxy": "datasecuritynode"
#   }
# }

from utils.checkers import check_operations

from wax.proto import (
    account_witness_proxy_pb2,
    operation_pb2,
    transaction_pb2
)

def test_account_witness_proxy():
    account_witness_proxy: account_witness_proxy_pb2.account_witness_proxy = (
        account_witness_proxy_pb2.account_witness_proxy(
            account="bunkermining", proxy="datasecuritynode"
        )
    )

    account_witness_proxy_operation: operation_pb2.operation = (
        operation_pb2.operation(account_witness_proxy=account_witness_proxy)
    )

    check_operations(account_witness_proxy_operation)
