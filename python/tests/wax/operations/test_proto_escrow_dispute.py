from tests.wax.utils.checkers import check_operations, check_transaction

from wax.proto.operations import operation, escrow_dispute
from wax.proto.transaction import transaction


def test_escrow_dispute():
    escrow_dispute_proto: escrow_dispute = escrow_dispute(
        from_account="faddy", to_account="daddy", agent="agent", who="daddy", escrow_id=1
    )

    escrow_dispute_operation: operation = operation(escrow_dispute_operation=escrow_dispute_proto)

    check_operations(escrow_dispute_operation)

    proto_transaction: transaction = transaction(operations=[escrow_dispute_operation])

    check_transaction(proto_transaction)
