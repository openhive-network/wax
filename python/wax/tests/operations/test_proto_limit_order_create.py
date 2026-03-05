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

from wax.proto.asset import asset
from wax.proto.operations import (
    limit_order_create,
    operation,
)
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_limit_order_create():
    amount_to_sell: asset = asset(nai="@@000000021", precision=3, amount="1000")
    min_to_receive: asset = asset(nai="@@000000013", precision=3, amount="3500")

    limit_order_create_proto: limit_order_create = limit_order_create(
        owner="linouxis9",
        orderid=10,
        amount_to_sell=amount_to_sell,
        min_to_receive=min_to_receive,
        fill_or_kill=False,
        expiration="2035-10-29T06:32:22",
    )

    limit_order_create_operation: operation = operation(limit_order_create_operation=limit_order_create_proto)

    check_operations(limit_order_create_operation)

    transaction_proto: transaction = transaction(operations=[limit_order_create_operation])

    check_transaction(transaction_proto)
