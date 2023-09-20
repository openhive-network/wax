from google.protobuf.json_format import MessageToJson

from wax import validate_proto_operation, validate_proto_transaction
from wax.proto import comment_pb2, transaction_pb2, vote_pb2


def check_operations(operation: transaction_pb2.operation):
    operation_json = MessageToJson(operation)
    result = validate_proto_operation(operation_json.encode())
    print(result)
    assert result.status == result.status.ok


def check_transaction(transaction: transaction_pb2.transaction):
    transaction_json = MessageToJson(transaction)
    result = validate_proto_transaction(transaction_json.encode())
    print(result)
    assert result.status == result.status.ok


if __name__ == "__main__":
    vote: vote_pb2.vote = vote_pb2.vote(
        voter="alice", author="author", permlink="/", weight=11
    )
    vote_operation: transaction_pb2.operation = transaction_pb2.operation(vote=vote)

    comment: comment_pb2.comment = comment_pb2.comment(
        parent_permlink="/",
        parent_author="",
        author="alice",
        permlink="/",
        title="Best comment",
        body="<span>comment</span>",
        json_metadata="{}",
    )
    comment_operation: transaction_pb2.operation = transaction_pb2.operation(
        comment=comment
    )

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[vote_operation, comment_operation]
    )

    check_operations(vote_operation)
    check_operations(comment_operation)
    check_transaction(transaction)
