# witness_set_properties_operation={
#   "type": "witness_set_properties_operation",
#   "value": {
#     "owner": "alloyxuast",
#     "props": [
#       [
#         "hbd_exchange_rate",
#         "67010000000000000353424400000000e80300000000000003535445454d0000"
#       ],
#       [
#         "key",
#         "03d8cb826edbc3222ac59f30ce5d419d95903b94d0adfb197e25c60bca3b1ab5ae"
#       ]
#     ],
#     "extensions": []
#   }
# }

from wax.proto.operations import operation, witness_set_properties
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_witness_set_properties():
    witness_set_properties_proto: witness_set_properties = witness_set_properties(
        owner="alloyxuast",
        props={
            "hbd_exchange_rate": "67010000000000000353424400000000e80300000000000003535445454d0000",
            "key": "03d8cb826edbc3222ac59f30ce5d419d95903b94d0adfb197e25c60bca3b1ab5ae",
        },
        extensions=[],
    )

    witness_set_properties_operation: operation = operation(
        witness_set_properties_operation=witness_set_properties_proto
    )

    check_operations(witness_set_properties_operation)

    transaction_proto: transaction = transaction(operations=[witness_set_properties_operation])

    check_transaction(transaction_proto)
