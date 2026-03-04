# account_update2_operation = {
#     "type": "account_update2_operation",
#     "value": {
#         "account": "rosylisboa",
#         "json_metadata": "",
#         "posting_json_metadata": "{}",
#         "extensions": [],
#     },
# }


from tests.wax.utils.checkers import check_operations, check_transaction

from wax.proto.operations import account_update2, operation
from wax.proto.transaction import transaction
from wax._private.proto.future_extensions_pb2 import future_extensions


def test_account_update2():
    extension: future_extensions = future_extensions()
    account_update2_proto: account_update2 = account_update2(
        account="rosylisboa", json_metadata="", posting_json_metadata="{}", extensions=[]
    )

    account_update2_operation: operation = operation(account_update2_operation=account_update2_proto)

    check_operations(account_update2_operation)

    proto_transaction: transaction = transaction(operations=[account_update2_operation])

    check_transaction(proto_transaction)
