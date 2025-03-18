# delegate_vesting_shares_operation = {
#     "type": "delegate_vesting_shares_operation",
#     "value": {
#         "delegator": "elamaria",
#         "delegatee": "music1sound",
#         "vesting_shares": {
#             "amount": "90111193694",
#             "precision": 6,
#             "nai": "@@000000037",
#         },
#     },
# }

from tests.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    delegate_vesting_shares,
    operation,
)
from wax.proto.asset import asset
from wax.proto.transaction import transaction

def test_delegate_vesting_shares():
    vesting_shares: asset = asset(
        amount="90111193694", precision=6, nai="@@000000037"
    )
    delegate_vesting_shares_proto: delegate_vesting_shares = (
        delegate_vesting_shares(
            delegator="elamaria", delegatee="music1sound", vesting_shares=vesting_shares
        )
    )

    delegate_vesting_shares_operation: operation = (
        operation(delegate_vesting_shares=delegate_vesting_shares_proto)
    )

    check_operations(delegate_vesting_shares_operation)

    transaction_proto: transaction = transaction(
        operations=[delegate_vesting_shares_operation]
    )

    check_transaction(transaction_proto)
