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

from tests.wax.utils.checkers import check_operations, check_transaction

from wax.proto.asset import asset
from wax.proto.transaction import transaction
from wax.proto.operations import operation, withdraw_vesting


def test_withdraw_vesting():
    vesting_shares: asset = asset(nai="@@000000037", precision=6, amount="200000000000")

    withdraw_vesting_proto: withdraw_vesting = withdraw_vesting(account="steemit", vesting_shares=vesting_shares)

    withdraw_vesting_operation: operation = operation(withdraw_vesting_operation=withdraw_vesting_proto)
    check_operations(withdraw_vesting_operation)

    proto_transaction: transaction = transaction(operations=[withdraw_vesting_operation])

    check_transaction(proto_transaction)
