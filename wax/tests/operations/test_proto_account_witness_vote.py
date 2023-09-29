# account_witness_vote_operation={
#   "type": "account_witness_vote_operation",
#   "value": {
#     "account": "donalddrumpf",
#     "witness": "berniesanders",
#     "approve": True
#   }
# }

from utils.checkers import check_operations

from wax.proto import (
    account_witness_vote_pb2,
    operation_pb2,
    transaction_pb2
)

def test_account_witness_vote():
    account_witness_vote: account_witness_vote_pb2.account_witness_vote = (
        account_witness_vote_pb2.account_witness_vote(
            account="donalddrumpf", witness="berniesanders", approve=True
        )
    )

    account_witness_vote_operation: operation_pb2.operation = (
        operation_pb2.operation(account_witness_vote=account_witness_vote)
    )

    check_operations(account_witness_vote_operation)
