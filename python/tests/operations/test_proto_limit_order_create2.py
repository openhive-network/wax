from tests.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    limit_order_create2,
    operation,
)
from wax.proto.asset import asset
from wax.proto.transaction import transaction
from wax._private.proto.price_pb2 import price


def test_limit_order_create2():
    amount_to_sell: asset = asset(nai="@@000000021", precision=3, amount="1000")
    amount: asset = asset(nai="@@000000013", precision=3, amount="3500")
    price_proto: price = price(base=amount_to_sell, quote=amount)

    limit_order_create2_proto: limit_order_create2 = limit_order_create2(
        owner="linouxis9",
        orderid=10,
        amount_to_sell=amount_to_sell,
        fill_or_kill=False,
        exchange_rate=price_proto,
        expiration="2035-10-29T06:32:22",
    )

    limit_order_create2_operation: operation = operation(limit_order_create2_operation=limit_order_create2_proto)

    check_operations(limit_order_create2_operation)

    transaction_proto: transaction = transaction(operations=[limit_order_create2_operation])

    check_transaction(transaction_proto)
