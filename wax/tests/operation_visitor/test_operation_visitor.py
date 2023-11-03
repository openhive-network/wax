from google.protobuf.json_format import ParseDict

from wax.proto import (
    vote_pb2,
    limit_order_cancel_pb2,
    operation_pb2,
    transaction_pb2
)

from wax.wax_visitor import OperationVisitor

tx_json = {
    "operations": [
        {"vote": {"voter": "Alice", "author": "Bob", "permlink": "/", "weight": 11}},
        {"limit_order_cancel": {"owner": "orderabc", "orderid": 5}}
    ]
}

class MyOperationVisitor(OperationVisitor):
    vote_obj: vote_pb2.vote = None
    
    def vote(self, op: vote_pb2.vote) -> None:
        print("Processing 'vote' operation")
        self.vote_obj = op


def test_operation_visitor():
    tx = ParseDict(tx_json, transaction_pb2.transaction())

    visitor = MyOperationVisitor()
    for op in tx.operations:
        visitor.accept(op)

    assert visitor.vote_obj == ParseDict(tx_json["operations"][0]["vote"], vote_pb2.vote())
