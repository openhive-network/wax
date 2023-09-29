# withdraw_vesting_operation={
#   "type": "withdraw_vesting_operation",
#   "value": {
#     "account": "steemit",
#     "vesting_shares": {
#       "amount": "200000000000",
#       "precision": 6,
#       "nai": "@@000000037"
#     }
#   }
# }

from utils.checkers import check_operations

from wax.proto import (
    asset_pb2,
    operation_pb2,
    transaction_pb2,
    withdraw_vesting_pb2
)

def test_withdraw_vesting():
    vesting_shares: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000037", precision=6, amount="200000000000"
    )

    withdraw_vesting: withdraw_vesting_pb2.withdraw_vesting = (
        withdraw_vesting_pb2.withdraw_vesting(
            account="steemit", vesting_shares=vesting_shares
        )
    )

    withdraw_vesting_operation: operation_pb2.operation = operation_pb2.operation(
        withdraw_vesting=withdraw_vesting
    )

    check_operations(withdraw_vesting_operation)
