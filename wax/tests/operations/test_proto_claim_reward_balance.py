# claim_reward_balance_operation={
#   "type": "claim_reward_balance_operation",
#   "value": {
#     "account": "bradleyarrow",
#     "reward_hive": {
#       "amount": "0",
#       "precision": 3,
#       "nai": "@@000000021"
#     },
#     "reward_hbd": {
#       "amount": "104",
#       "precision": 3,
#       "nai": "@@000000013"
#     },
#     "reward_vests": {
#       "amount": "531747227",
#       "precision": 6,
#       "nai": "@@000000037"
#     }
#   }
# }

from utils.checkers import check_operations

from wax.proto import (
    asset_pb2,
    claim_reward_balance_pb2,
    operation_pb2,
    transaction_pb2
)

def test_claim_reward_balance():
    reward_hive: asset_pb2.asset = asset_pb2.asset(
        amount="0", precision=3, nai="@@000000021"
    )
    reward_hbd: asset_pb2.asset = asset_pb2.asset(
        amount="104", precision=3, nai="@@000000013"
    )
    reward_vests: asset_pb2.asset = asset_pb2.asset(
        amount="531747227", precision=6, nai="@@000000037"
    )

    claim_reward_balance: claim_reward_balance_pb2.claim_reward_balance = (
        claim_reward_balance_pb2.claim_reward_balance(
            account="bradleyarrow",
            reward_hive=reward_hive,
            reward_hbd=reward_hbd,
            reward_vests=reward_vests,
        )
    )

    claim_reward_balance_operation: operation_pb2.operation = (
        operation_pb2.operation(claim_reward_balance=claim_reward_balance)
    )

    check_operations(claim_reward_balance_operation)
