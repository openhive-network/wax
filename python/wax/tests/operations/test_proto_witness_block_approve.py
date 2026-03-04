from tests.wax.utils.checkers import check_operations, check_transaction

from wax.proto.operations import operation, witness_block_approve
from wax.proto.transaction import transaction


def test_witness_block_approve():
    witness_block_approve_proto: witness_block_approve = witness_block_approve(
        witness="gtg", block_id="000004433bd4602cf5f74dbb564183837df9cef8"
    )

    witness_block_approve_operation: operation = operation(witness_block_approve_operation=witness_block_approve_proto)

    check_operations(witness_block_approve_operation)

    proto_transaction: transaction = transaction(operations=[witness_block_approve_operation])

    check_transaction(proto_transaction)
