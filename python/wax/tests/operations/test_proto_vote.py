from utils.checkers import check_operations, check_transaction

from wax.proto import (
    operation_pb2,
    transaction_pb2,
    vote_pb2
)

def test_vote():
    vote: vote_pb2.vote = vote_pb2.vote(
        voter="alice", author="author", permlink="/", weight=11
    )
    vote_operation: operation_pb2.operation = operation_pb2.operation(vote=vote)

    check_operations(vote_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[vote_operation]
    )

    check_transaction(transaction)
