# witness_update_operation={
#   "type": "witness_update_operation",
#   "value": {
#     "owner": "steempty",
#     "url": "fmooo/steemd-docker",
#     "block_signing_key": "STM8LoQjQqJHvotqBo7HjnqmUbFW9oJ2theyqonzUd9DdJ7YYHsvD",
#     "props": {
#       "account_creation_fee": {
#         "amount": "100000",
#         "precision": 3,
#         "nai": "@@000000021"
#       },
#       "maximum_block_size": 131072,
#       "hbd_interest_rate": 1000
#     },
#     "fee": {
#       "amount": "0",
#       "precision": 3,
#       "nai": "@@000000021"
#     }
#   }
# }

from utils.checkers import check_operations

from wax.proto import (
    asset_pb2,
    legacy_chain_properties_pb2,
    operation_pb2,
    transaction_pb2,
    witness_update_pb2,
)


def test_witness_update():
    account_creation_fee: asset_pb2.asset = asset_pb2.asset(
        amount="100000", precision=3, nai="@@000000021"
    )
    fee: asset_pb2.asset = asset_pb2.asset(
        amount="100000", precision=3, nai="@@000000021"
    )

    legacy_chain_properties: legacy_chain_properties_pb2.legacy_chain_properties = (
        legacy_chain_properties_pb2.legacy_chain_properties(
            account_creation_fee=account_creation_fee,
            maximum_block_size=131072,
            hbd_interest_rate=1000,
        )
    )

    witness_update: witness_update_pb2.witness_update = (
        witness_update_pb2.witness_update(
            owner="steempty",
            url="fmooo/steemd-docker",
            block_signing_key="STM8LoQjQqJHvotqBo7HjnqmUbFW9oJ2theyqonzUd9DdJ7YYHsvD",
            props=legacy_chain_properties,
            fee=fee,
        )
    )

    witness_update_operation: operation_pb2.operation = operation_pb2.operation(
        witness_update=witness_update
    )

    check_operations(witness_update_operation)
