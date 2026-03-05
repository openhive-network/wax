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

from wax.proto.operations import operation, update_proposal_votes
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_update_proposal_votes():
    update_proposal_votes_proto: update_proposal_votes = update_proposal_votes(
        voter="ballenaprepago", proposal_ids=[0], approve=True, extensions=[]
    )
    update_proposal_votes_operations: operation = operation(update_proposal_votes_operation=update_proposal_votes_proto)

    check_operations(update_proposal_votes_operations)

    proto_transaction: transaction = transaction(operations=[update_proposal_votes_operations])

    check_transaction(proto_transaction)
