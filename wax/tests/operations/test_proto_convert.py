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

from utils.checkers import check_operations

from wax.proto import (
    asset_pb2,
    convert_pb2,
    operation_pb2,
    transaction_pb2
)

def test_convert():
    amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000013", precision=3, amount="5000"
    )

    conver: convert_pb2.convert = convert_pb2.convert(
        owner="summon", requestid=1467592156, amount=amount
    )

    conver_operation: operation_pb2.operation = operation_pb2.operation(
        convert=conver
    )
    check_operations(conver_operation)
