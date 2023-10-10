from utils.checkers import check_operations, check_transaction

from wax.proto import (
    operation_pb2,
    transaction_pb2,
    decline_voting_rights_pb2
)

def test_decline_voting_rights():
    decline_voting_rights: decline_voting_rights_pb2.decline_voting_rights = decline_voting_rights_pb2.decline_voting_rights(
        account="faddy",
        decline=True
    )

    decline_voting_rights_operation: operation_pb2.operation = (
        operation_pb2.operation(decline_voting_rights=decline_voting_rights)
    )

    check_operations(decline_voting_rights_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[decline_voting_rights_operation]
    )

    check_transaction(transaction)
