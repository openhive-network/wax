from wax.proto.operations import (
    decline_voting_rights,
    operation,
)
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_decline_voting_rights():
    decline_voting_rights_proto: decline_voting_rights = decline_voting_rights(account="faddy", decline=True)

    decline_voting_rights_operation: operation = operation(decline_voting_rights_operation=decline_voting_rights_proto)

    check_operations(decline_voting_rights_operation)

    transaction_proto: transaction = transaction(operations=[decline_voting_rights_operation])

    check_transaction(transaction_proto)
