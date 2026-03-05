# collateralized_convert_operation={
#   "type": "collateralized_convert_operation",
#   "value": {
#     "owner": "karbea",
#     "requestid": 2,
#     "amount": {
#       "amount": "102",
#       "precision": 3,
#       "nai": "@@000000021"
#     }
#   }
# }

from wax_local_tools.checkers import check_operations, check_transaction

from wax.proto.operations import (
    collateralized_convert,
    operation,
)
from wax.proto.transaction import transaction
from wax.proto.asset import asset


def test_collateralized_convert():
    amount: asset = asset(amount="102", precision=3, nai="@@000000021")

    collateralized_convert_proto: collateralized_convert = collateralized_convert(
        owner="karbea", requestid=2, amount=amount
    )

    collateralized_convert_operation: operation = operation(
        collateralized_convert_operation=collateralized_convert_proto
    )

    check_operations(collateralized_convert_operation)

    transaction_proto: transaction = transaction(operations=[collateralized_convert_operation])

    check_transaction(transaction_proto)
