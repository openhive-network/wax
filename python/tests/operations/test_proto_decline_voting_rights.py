from tests.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    operation,
    decline_voting_rights,
)
from wax.proto.transaction import transaction


def test_decline_voting_rights():
    decline_voting_rights_proto: decline_voting_rights = decline_voting_rights(account="faddy", decline=True)

    decline_voting_rights_operation: operation = operation(decline_voting_rights_operation=decline_voting_rights_proto)

    check_operations(decline_voting_rights_operation)

    transaction_proto: transaction = transaction(operations=[decline_voting_rights_operation])

    check_transaction(transaction_proto)
