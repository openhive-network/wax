from wax.proto.operations import operation, vote
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_vote():
    proto_vote: vote = vote(voter="alice", author="author", permlink="/", weight=11)
    vote_operation: operation = operation(vote_operation=proto_vote)

    check_operations(vote_operation)

    proto_transaction: transaction = transaction(operations=[vote_operation])

    check_transaction(proto_transaction)
