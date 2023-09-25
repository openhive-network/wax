# feed_publish_operation={
#   "type": "feed_publish_operation",
#   "value": {
#     "publisher": "abit",
#     "exchange_rate": {
#       "base": {
#         "amount": "1000",
#         "precision": 3,
#         "nai": "@@000000013"
#       },
#       "quote": {
#         "amount": "1000000",
#         "precision": 3,
#         "nai": "@@000000021"
#       }
#     }
#   }
# }

from utils.checkers import check_operations

from wax.proto import asset_pb2, feed_publish_pb2, price_pb2, transaction_pb2


def test_feed_publish():
    base: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000013", precision=3, amount="1000"
    )

    quote: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000013", precision=3, amount="1000000"
    )

    price: price_pb2.price = price_pb2.price(base=base, quote=quote)

    feed_publish: feed_publish_pb2.feed_publish = feed_publish_pb2.feed_publish(
        publisher="abit",
        exchange_rate=price,
    )

    feed_publish_operation: transaction_pb2.operation = transaction_pb2.operation(
        feed_publish=feed_publish
    )

    check_operations(feed_publish_operation)
