from utils.checkers import check_operations

from wax.proto import (
    operation_pb2,
    transaction_pb2,
    vote_pb2
)

def test_vote_operation():
    vote: vote_pb2.vote = vote_pb2.vote(
        voter="alice", author="author", permlink="/", weight=11
    )
    vote_operation: operation_pb2.operation = operation_pb2.operation(vote=vote)

    check_operations(vote_operation)
