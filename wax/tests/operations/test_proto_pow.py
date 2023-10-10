from utils.checkers import check_operations, check_transaction

from wax.proto import (
    operation_pb2,
    transaction_pb2,
    asset_pb2,
    legacy_chain_properties_pb2,
    pow_pb2
)

def test_pow():
    pow_work: pow_pb2.pow_work = pow_pb2.pow_work(
        worker="worker",
        input="12345678123456781234567812345678",
        signature="abcdef12abcdef12abcdef12abcdef12abcdef12abcdef12abcdef12abcdef123",
        work="12345678123456781234567812345678"
    )
    amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="3000"
    )
    legacy_chain_properties: legacy_chain_properties_pb2.legacy_chain_properties = legacy_chain_properties_pb2.legacy_chain_properties(
        account_creation_fee=amount,
        maximum_block_size=10000,
        hbd_interest_rate=66,
    )

    pow: pow_pb2.pow = pow_pb2.pow(
        worker_account="worker",
        block_id="123",
        nonce=123456,
        work=pow_work,
        props=legacy_chain_properties
    )

    pow_operation: operation_pb2.operation = operation_pb2.operation(
        pow=pow
    )

    check_operations(pow_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[pow_operation]
    )

    check_transaction(transaction)
