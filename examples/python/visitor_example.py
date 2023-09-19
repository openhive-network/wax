from google.protobuf.json_format import ParseDict

from wax.proto import (
    comment_pb2,
    limit_order_cancel_pb2,
    recurrent_transfer_pb2,
    transaction_pb2,
    vote_pb2,
)
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
        {
            "recurrent_transfer": {
                "from": "alice",
                "to": "harry",
                "amount": {"nai": "@@000000021", "precision": 3, "amount": "10"},
                "memo": "it is only memo",
                "recurrence": 1,
                "executions": 3,
                "extensions": [{"recurrent_transfer_pair_id": {"pair_id": 0}}],
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

    def recurrent_transfer(self, op: recurrent_transfer_pb2.recurrent_transfer) -> None:
        print(f"Handling recurrent_transfer operation:\n{op}")
        assert op._from == "alice"
        assert op.to == "harry"
        assert op.amount.nai == "@@000000021"
        assert op.amount.precision == 3
        assert op.amount.amount == "10"
        assert op.memo == "it is only memo"
        assert op.recurrence == 1
        assert op.executions == 3
        assert op.extensions[0].recurrent_transfer_pair_id.pair_id == 0


if __name__ == "__main__":
    tx = ParseDict(tx_json, transaction_pb2.transaction())
    visit = MyOperationVisitor()
    for op in tx.operations:
        visit.accept(op)
