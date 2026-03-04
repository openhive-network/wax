from google.protobuf.json_format import ParseDict

from wax.proto.operations import vote, operation
from wax.proto.transaction import transaction
from wax.wax_visitor import OperationVisitor

tx_json = {
    "operations": [
        {"vote_operation": {"voter": "Alice", "author": "Bob", "permlink": "/", "weight": 11}},
        {"limit_order_cancel_operation": {"owner": "orderabc", "orderid": 5}},
    ]
}


class MyOperationVisitor(OperationVisitor):
    vote_obj: vote | None = None

    def vote(self, op: vote) -> None:
        print("Processing 'vote' operation")
        self.vote_obj = op


def test_operation_visitor():
    tx = ParseDict(tx_json, transaction())

    visitor = MyOperationVisitor()
    for op in tx.operations:
        visitor.accept(op)

    assert visitor.vote_obj == ParseDict(tx_json["operations"][0]["vote_operation"], vote())
