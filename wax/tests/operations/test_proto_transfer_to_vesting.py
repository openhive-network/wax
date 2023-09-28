# transfer_to_vesting_operation={
#   "type": "transfer_to_vesting_operation",
#   "value": {
#     "from": "faddy",
#     "to": "",
#     "amount": {
#       "amount": "357000",
#       "precision": 3,
#       "nai": "@@000000021"
#     }
#   }
# }

from utils.checkers import check_operations

from wax.proto import asset_pb2, transaction_pb2, transfer_to_vesting_pb2


def test_transfer_to_vesting():
    amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="357000"
    )

    transfer_to_vesting: transfer_to_vesting_pb2.transfer_to_vesting = (
        transfer_to_vesting_pb2.transfer_to_vesting(
            from_account="faddy", to_account="", amount=amount
        )
    )

    transfer_to_vesting_opertaion: transaction_pb2.operation = (
        transaction_pb2.operation(transfer_to_vesting=transfer_to_vesting)
    )

    check_operations(transfer_to_vesting_opertaion)