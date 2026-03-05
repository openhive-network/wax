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

from wax._private.proto.update_proposal_pb2 import update_proposal_end_date, update_proposal_extension
from wax.proto.asset import asset
from wax.proto.operations import (
    operation,
    update_proposal,
)
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_update_proposal():
    daily_pay: asset = asset(amount="135000", precision=3, nai="@@000000013")
    update_proposal_end_date_proto: update_proposal_end_date = update_proposal_end_date(end_date="2035-10-29T06:32:22")
    extension: update_proposal_extension = update_proposal_extension(
        update_proposal_end_date=update_proposal_end_date_proto
    )

    update_proposal_proto: update_proposal = update_proposal(
        proposal_id=247,
        creator="arcange",
        daily_pay=daily_pay,
        subject="HiveSQL Services Proposal - Let's Keep It Free To Use",
        permlink="hivesql-proposal-2023-2024",
        extensions=[extension],
    )

    update_proposal_operation: operation = operation(update_proposal_operation=update_proposal_proto)

    check_operations(update_proposal_operation)

    transaction_proto: transaction = transaction(operations=[update_proposal_operation])

    check_transaction(transaction_proto)
