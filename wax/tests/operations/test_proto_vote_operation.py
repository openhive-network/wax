from utils.checkers import check_operations

from wax.proto import transaction_pb2, vote_pb2


def test_vote_operation():
    vote: vote_pb2.vote = vote_pb2.vote(
        voter="alice", author="author", permlink="/", weight=11
    )
    vote_operation: transaction_pb2.operation = transaction_pb2.operation(vote=vote)

    check_operations(vote_operation)
