# update_proposal_votes_operation={
#   "type": "update_proposal_votes_operation",
#   "value": {
#     "voter": "ballenaprepago",
#     "proposal_ids": [
#       0
#     ],
#     "approve": True,
#     "extensions": []
#   }
# }

from utils.checkers import check_operations, check_transaction

from wax.proto import (
    operation_pb2,
    transaction_pb2,
    update_proposal_votes_pb2
)

def test_update_proposal_votes():
    update_proposal_votes: update_proposal_votes_pb2.update_proposal_votes = (
        update_proposal_votes_pb2.update_proposal_votes(
            voter="ballenaprepago", proposal_ids=[0], approve=True, extensions=[]
        )
    )
    update_proposal_votes_operations: operation_pb2.operation = (
        operation_pb2.operation(update_proposal_votes=update_proposal_votes)
    )

    check_operations(update_proposal_votes_operations)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[update_proposal_votes_operations]
    )

    check_transaction(transaction)
