from wax._private.proto.price_pb2 import price
from wax.proto.asset import asset
from wax.proto.operations import feed_publish, operation
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_feed_publish():
    base: asset = asset(nai="@@000000021", precision=3, amount="1000")

    quote: asset = asset(nai="@@000000013", precision=3, amount="1000000")

    price_proto: price = price(base=base, quote=quote)

    feed_publish_proto: feed_publish = feed_publish(
        publisher="abit",
        exchange_rate=price_proto,
    )

    feed_publish_operation: operation = operation(feed_publish_operation=feed_publish_proto)

    check_operations(feed_publish_operation)

    proto_transaction: transaction = transaction(operations=[feed_publish_operation])

    check_transaction(proto_transaction)
