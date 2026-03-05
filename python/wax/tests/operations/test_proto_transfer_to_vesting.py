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

from wax_local_tools.checkers import check_operations, check_transaction

from wax.proto.operations import operation, transfer_to_vesting
from wax.proto.transaction import transaction
from wax.proto.asset import asset


def test_transfer_to_vesting():
    proto_asset: asset = asset(nai="@@000000021", precision=3, amount="357000")

    transfer_to_vesting_proto: transfer_to_vesting = transfer_to_vesting(
        from_account="faddy", to_account="", amount=proto_asset
    )

    transfer_to_vesting_operation: operation = operation(transfer_to_vesting_operation=transfer_to_vesting_proto)

    check_operations(transfer_to_vesting_operation)

    proto_transaction: transaction = transaction(operations=[transfer_to_vesting_operation])

    check_transaction(proto_transaction)
