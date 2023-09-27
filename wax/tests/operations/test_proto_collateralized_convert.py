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

from utils.checkers import check_operations

from wax.proto import asset_pb2, collateralized_convert_pb2, transaction_pb2


def test_collateralized_convert():
    amount: asset_pb2.asset = asset_pb2.asset(
        amount="102", precision=3, nai="@@000000021"
    )

    collateralized_convert: collateralized_convert_pb2.collateralized_convert = (
        collateralized_convert_pb2.collateralized_convert(
            owner="karbea", requestid=2, amount=amount
        )
    )

    collateralized_convert_operation: transaction_pb2.operation = (
        transaction_pb2.operation(collateralized_convert=collateralized_convert)
    )

    check_operations(collateralized_convert_operation)
