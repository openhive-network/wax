remove_proposal_operation = {
    "type": "remove_proposal_operation",
    "value": {"proposal_owner": "doze", "proposal_ids": [225], "extensions": []},
}

from utils.checkers import check_operations

from wax.proto import (
    remove_proposal_pb2,
    operation_pb2,
    transaction_pb2
)

def test_remove_proposal():
    remove_proposal: remove_proposal_pb2.remove_proposal = (
        remove_proposal_pb2.remove_proposal(
            proposal_owner="doze", proposal_ids=[225], extensions=[]
        )
    )

    remove_proposal_operation: operation_pb2.operation = operation_pb2.operation(
        remove_proposal=remove_proposal
    )

    check_operations(remove_proposal_operation)
