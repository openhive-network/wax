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

from tests.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    operation,
    witness_update,
)
from wax.proto.asset import asset
from wax.proto.transaction import transaction
from wax._private.proto.legacy_chain_properties_pb2 import legacy_chain_properties


def test_witness_update():
    account_creation_fee: asset = asset(
        amount="100000", precision=3, nai="@@000000021"
    )
    fee: asset = asset(
        amount="100000", precision=3, nai="@@000000021"
    )

    legacy_chain_properties_proto: legacy_chain_properties = (
        legacy_chain_properties(
            account_creation_fee=account_creation_fee,
            maximum_block_size=131072,
            hbd_interest_rate=1000,
        )
    )

    witness_update_proto: witness_update = (
        witness_update(
            owner="steempty",
            url="fmooo/steemd-docker",
            block_signing_key="STM8LoQjQqJHvotqBo7HjnqmUbFW9oJ2theyqonzUd9DdJ7YYHsvD",
            props=legacy_chain_properties_proto,
            fee=fee,
        )
    )

    witness_update_operation: operation = operation(
        witness_update=witness_update_proto
    )

    check_operations(witness_update_operation)

    proto_transaction: transaction = transaction(
        operations=[witness_update_operation]
    )

    check_transaction(proto_transaction)
