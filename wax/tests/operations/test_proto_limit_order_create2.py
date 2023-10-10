from utils.checkers import check_operations, check_transaction

from wax.proto import (
    asset_pb2,
    price_pb2,
    limit_order_create2_pb2,
    operation_pb2,
    transaction_pb2
)

def test_limit_order_create2():
    amount_to_sell: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="1000"
    )
    amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000013", precision=3, amount="3500"
    )
    price: price_pb2.price = price_pb2.price(
        base=amount_to_sell, quote=amount
    )

    limit_order_create2: limit_order_create2_pb2.limit_order_create2 = (
        limit_order_create2_pb2.limit_order_create2(
            owner="linouxis9",
            orderid=10,
            amount_to_sell=amount_to_sell,
            fill_or_kill=False,
            exchange_rate=price,
            expiration="2035-10-29T06:32:22"
        )
    )

    limit_order_create2_operation: operation_pb2.operation = operation_pb2.operation(
        limit_order_create2=limit_order_create2
    )

    check_operations(limit_order_create2_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[limit_order_create2_operation]
    )

    check_transaction(transaction)
