# limit_order_create_operation={
#   "type": "limit_order_create_operation",
#   "value": {
#     "owner": "linouxis9",
#     "orderid": 10,
#     "amount_to_sell": {
#       "amount": "9950",
#       "precision": 3,
#       "nai": "@@000000021"
#     },
#     "min_to_receive": {
#       "amount": "3500",
#       "precision": 3,
#       "nai": "@@000000013"
#     },
#     "fill_or_kill": false,
#     "expiration": "2035-10-29T06:32:22"
#   }
# }

from utils.checkers import check_operations, check_transaction

from wax.proto import (
    asset_pb2,
    limit_order_create_pb2,
    operation_pb2,
    transaction_pb2
)

def test_limit_order_create():
    amount_to_sell: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="1000"
    )
    min_to_receive: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000013", precision=3, amount="3500"
    )

    limit_order_create: limit_order_create_pb2.limit_order_create = (
        limit_order_create_pb2.limit_order_create(
            owner="linouxis9",
            orderid=10,
            amount_to_sell=amount_to_sell,
            min_to_receive=min_to_receive,
            fill_or_kill=False,
            expiration="2035-10-29T06:32:22",
        )
    )

    limit_order_create_operation: operation_pb2.operation = operation_pb2.operation(
        limit_order_create=limit_order_create
    )

    check_operations(limit_order_create_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[limit_order_create_operation]
    )

    check_transaction(transaction)
