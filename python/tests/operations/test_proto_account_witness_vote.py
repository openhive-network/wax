# account_witness_vote_operation={
#   "type": "account_witness_vote_operation",
#   "value": {
#     "account": "donalddrumpf",
#     "witness": "berniesanders",
#     "approve": True
#   }
# }

from tests.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    account_witness_vote,
    operation,
)
from wax.proto.transaction import transaction


def test_account_witness_vote():
    account_witness_vote_proto: account_witness_vote = account_witness_vote(
        account="donalddrumpf", witness="berniesanders", approve=True
    )

    account_witness_vote_operation: operation = operation(account_witness_vote_operation=account_witness_vote_proto)

    check_operations(account_witness_vote_operation)

    proto_transaction: transaction = transaction(operations=[account_witness_vote_operation])

    check_transaction(proto_transaction)
