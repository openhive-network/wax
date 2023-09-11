from google.protobuf.json_format import MessageToDict, ParseDict

from wax.proto import comment_pb2, limit_order_cancel_pb2, transaction_pb2, vote_pb2
from wax.wax_visitor import OperationVisitor

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


class MyOperationVisitor(OperationVisitor):
    def limit_order_cancel(self, op: limit_order_cancel_pb2.limit_order_cancel):
        print(f"Handling limit_order_cancel operation:\n{op}")
        assert op.order == "orderabc"
        assert op.orderid == 5

    def vote(self, op: vote_pb2.vote) -> None:
        print(f"Handling vote operation:\n{op}")
        assert op.voter == "Alice"
        assert op.author == "Bob"
        assert op.permlink == "/"
        assert op.weight == 11

    def comment(self, op: comment_pb2.comment) -> None:
        print(f"Handling comment operation:\n{op}")
        assert op.parent_permlink == "/"
        assert op.parent_author == ""
        assert op.author == "alice"
        assert op.permlink == "/"
        assert op.title == "Best comment"
        assert op.body == "<span>comment</span>"
        assert op.json_metadata == "{}"


if __name__ == "__main__":
    tx = ParseDict(tx_json, transaction_pb2.transaction())
    visit = MyOperationVisitor()
    for op in tx.operations:
        visit.accept(op)
