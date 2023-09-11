from google.protobuf.json_format import ParseDict
from wax.proto import transaction_pb2
from wax.wax_visitor import MyOperationVisitor

tx_json = {
    "operations": [
        {"vote": {"voter": "Alice", "author": "Bob", "permlink": "/", "weight": 11}},
        {"limit_order_cancel": {"order": "orderabc", "orderid": 5}},
        {
            "comment": {
                "parent_permlink": "/",
                "parent_author": "",
                "author": "alice",
                "permlink": "/",
                "title": "Best comment",
                "body": "<span>comment</span>",
                "json_metadata": "{}",
            }
        },
    ]
}

if __name__ == "__main__":
    tx = ParseDict(tx_json, transaction_pb2.transaction())
    visit = MyOperationVisitor()
    for op in tx.operations:
      visit.accept(op)