remove_proposal_operation = {
    "type": "remove_proposal_operation",
    "value": {"proposal_owner": "doze", "proposal_ids": [225], "extensions": []},
}

from tests.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    remove_proposal,
    operation,
)
from wax.proto.transaction import transaction

def test_remove_proposal():
    remove_proposal_proto: remove_proposal = (
        remove_proposal(
            proposal_owner="doze", proposal_ids=[225], extensions=[]
        )
    )

    remove_proposal_operation: operation = operation(
        remove_proposal_operation=remove_proposal_proto
    )

    check_operations(remove_proposal_operation)

    transaction_proto: transaction = transaction(
        operations=[remove_proposal_operation]
    )

    check_transaction(transaction_proto)
