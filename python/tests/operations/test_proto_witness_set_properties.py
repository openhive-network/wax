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

from utils.checkers import check_operations, check_transaction

from wax.proto import (
    operation_pb2,
    transaction_pb2,
    witness_set_properties_pb2
)


def test_witness_set_properties():
    witness_set_properties: witness_set_properties_pb2.witness_set_properties = witness_set_properties_pb2.witness_set_properties(
        owner="alloyxuast",
        props=[
            [
                "hbd_exchange_rate",
                "67010000000000000353424400000000e80300000000000003535445454d0000",
            ],
            [
                "key",
                "03d8cb826edbc3222ac59f30ce5d419d95903b94d0adfb197e25c60bca3b1ab5ae",
            ],
        ],
        extensions=[],
    )

    witness_set_properties_operation: operation_pb2.operation = (
        operation_pb2.operation(witness_set_properties=witness_set_properties)
    )

    check_operations(witness_set_properties_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[witness_set_properties_operation]
    )

    check_transaction(transaction)
