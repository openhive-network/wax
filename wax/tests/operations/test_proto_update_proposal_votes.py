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

from utils.checkers import check_operations

from wax.proto import transaction_pb2, update_proposal_votes_pb2


def test_update_proposal_votes():
    update_proposal_votes: update_proposal_votes_pb2.update_proposal_votes = (
        update_proposal_votes_pb2.update_proposal_votes(
            voter="ballenaprepago", proposal_ids=[0], approve=True, extensions=[]
        )
    )
    update_proposal_votes_operations: transaction_pb2.operation = (
        transaction_pb2.operation(update_proposal_votes=update_proposal_votes)
    )

    check_operations(update_proposal_votes_operations)
