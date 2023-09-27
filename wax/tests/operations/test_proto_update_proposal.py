# update_proposal_operation={
#   "type": "update_proposal_operation",
#   "value": {
#     "proposal_id": 247,
#     "creator": "arcange",
#     "daily_pay": {
#       "amount": "135000",
#       "precision": 3,
#       "nai": "@@000000013"
#     },
#     "subject": "HiveSQL Services Proposal - Let\'s Keep It Free To Use",
#     "permlink": "hivesql-proposal-2023-2024",
#     "extensions": []
#   }
# }

from utils.checkers import check_operations

from wax.proto import asset_pb2, transaction_pb2, update_proposal_pb2


def test_update_proposal():
    daily_pay: asset_pb2.asset = asset_pb2.asset(
        amount="135000", precision=3, nai="@@000000013"
    )

    update_proposal: update_proposal_pb2.update_proposal = (
        update_proposal_pb2.update_proposal(
            proposal_id=247,
            creator="arcange",
            daily_pay=daily_pay,
            subject="HiveSQL Services Proposal - Let's Keep It Free To Use",
            permlink="hivesql-proposal-2023-2024",
            extensions=[],
        )
    )

    update_proposal_operation: transaction_pb2.operation = transaction_pb2.operation(
        update_proposal=update_proposal
    )

    check_operations(update_proposal_operation)
