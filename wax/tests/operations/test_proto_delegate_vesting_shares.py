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

from utils.checkers import check_operations

from wax.proto import asset_pb2, delegate_vesting_shares_pb2, transaction_pb2


def test_delegate_vesting_shares():
    vesting_shares: asset_pb2.asset = asset_pb2.asset(
        amount="90111193694", precision=6, nai="@@000000037"
    )
    delegate_vesting_shares: delegate_vesting_shares_pb2.delegate_vesting_shares = (
        delegate_vesting_shares_pb2.delegate_vesting_shares(
            delegator="elamaria", delegatee="music1sound", vesting_shares=vesting_shares
        )
    )

    delegate_vesting_shares_operation: transaction_pb2.operation = (
        transaction_pb2.operation(delegate_vesting_shares=delegate_vesting_shares)
    )

    check_operations(delegate_vesting_shares_operation)
