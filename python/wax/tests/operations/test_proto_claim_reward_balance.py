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

from wax_local_tools.checkers import check_operations, check_transaction

from wax.proto.operations import (
    claim_reward_balance,
    operation,
)
from wax.proto.transaction import transaction
from wax.proto.asset import asset


def test_claim_reward_balance():
    reward_hive: asset = asset(amount="0", precision=3, nai="@@000000021")
    reward_hbd: asset = asset(amount="104", precision=3, nai="@@000000013")
    reward_vests: asset = asset(amount="531747227", precision=6, nai="@@000000037")

    claim_reward_balance_proto: claim_reward_balance = claim_reward_balance(
        account="bradleyarrow",
        reward_hive=reward_hive,
        reward_hbd=reward_hbd,
        reward_vests=reward_vests,
    )

    claim_reward_balance_operation: operation = operation(claim_reward_balance_operation=claim_reward_balance_proto)

    check_operations(claim_reward_balance_operation)

    proto_transaction: transaction = transaction(operations=[claim_reward_balance_operation])

    check_transaction(proto_transaction)
