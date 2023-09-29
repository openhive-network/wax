from utils.checkers import check_operations

from wax.proto import (
    operation_pb2,
    transaction_pb2,
    witness_block_approve_pb2
)

def test_witness_block_approve():
    witness_block_approve: witness_block_approve_pb2.witness_block_approve = (
        witness_block_approve_pb2.witness_block_approve(
            witness="gtg", block_id="000004433bd4602cf5f74dbb564183837df9cef8"
        )
    )

    witness_block_approve_operation: operation_pb2.operation = (
        operation_pb2.operation(witness_block_approve=witness_block_approve)
    )

    check_operations(witness_block_approve_operation)
