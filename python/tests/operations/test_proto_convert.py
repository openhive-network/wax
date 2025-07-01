# convert_operation = {
#   "type": "convert_operation",
#   "value": {
#     "owner": "summon",
#     "requestid": 1467592156,
#     "amount": {
#       "amount": "5000",
#       "precision": 3,
#       "nai": "@@000000013"
#     }
#   }
# }

from tests.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    convert,
    operation,
)
from wax.proto.transaction import transaction
from wax.proto.asset import asset

def test_convert():
    amount: asset = asset(
        nai="@@000000013", precision=3, amount="5000"
    )

    convert_proto: convert = convert(
        owner="summon", requestid=1467592156, amount=amount
    )

    convert_operation: operation = operation(
        convert_operation=convert_proto
    )
    check_operations(convert_operation)

    transaction_proto: transaction = transaction(
        operations=[convert_operation]
    )

    check_transaction(transaction_proto)
