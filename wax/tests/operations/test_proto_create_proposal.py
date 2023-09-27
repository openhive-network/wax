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


from utils.checkers import check_operations

from wax.proto import asset_pb2, create_proposal_pb2, transaction_pb2


def test_create_proposal():
    daily_pay: asset_pb2.asset = asset_pb2.asset(
        amount="600000", precision=3, nai="@@000000013"
    )

    create_proposal: create_proposal_pb2.create_proposal = (
        create_proposal_pb2.create_proposal(
            creator="ecency",
            receiver="ecency",
            start_date="2022-11-30T00:00:00",
            end_date="2023-11-30T00:00:00",
            daily_pay=daily_pay,
            subject="Ecency development and maintenance #3",
            permlink="ecency-development-and-maintenance-3",
            extensions=[],
        )
    )
    create_proposal_operation: transaction_pb2.operation = transaction_pb2.operation(
        create_proposal=create_proposal
    )

    check_operations(create_proposal_operation)
