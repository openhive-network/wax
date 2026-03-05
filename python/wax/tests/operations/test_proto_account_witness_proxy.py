# account_witness_proxy_operation = {
#   "type": "account_witness_proxy_operation",
#   "value": {
#     "account": "bunkermining",
#     "proxy": "datasecuritynode"
#   }
# }

from wax.proto.operations import account_witness_proxy, operation
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_account_witness_proxy():
    account_witness_proxy_proto: account_witness_proxy = account_witness_proxy(
        account="bunkermining", proxy="datasecuritynode"
    )

    account_witness_proxy_operation: operation = operation(account_witness_proxy_operation=account_witness_proxy_proto)

    check_operations(account_witness_proxy_operation)

    proto_transaction: transaction = transaction(operations=[account_witness_proxy_operation])

    check_transaction(proto_transaction)
