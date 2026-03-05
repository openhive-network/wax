# create_proposal_operation={
#   "type": "create_proposal_operation",
#   "value": {
#     "creator": "ecency",
#     "receiver": "ecency",
#     "start_date": "2022-11-30T00:00:00",
#     "end_date": "2023-11-30T00:00:00",
#     "daily_pay": {
#       "amount": "600000",
#       "precision": 3,
#       "nai": "@@000000013"
#     },
#     "subject": "Ecency'
#         ' development and maintenance #3",
#     "permlink": "ecency-development-and-maintenance-3",
#     "extensions": []
#   }
# }


from wax.proto.asset import asset
from wax.proto.operations import (
    create_proposal,
    operation,
)
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_create_proposal():
    daily_pay: asset = asset(amount="600000", precision=3, nai="@@000000013")

    create_proposal_proto: create_proposal = create_proposal(
        creator="ecency",
        receiver="ecency",
        start_date="2022-11-30T00:00:00",
        end_date="2023-11-30T00:00:00",
        daily_pay=daily_pay,
        subject="Ecency development and maintenance #3",
        permlink="ecency-development-and-maintenance-3",
        extensions=[],
    )
    create_proposal_operation: operation = operation(create_proposal_operation=create_proposal_proto)

    check_operations(create_proposal_operation)

    transaction_proto: transaction = transaction(operations=[create_proposal_operation])

    check_transaction(transaction_proto)
