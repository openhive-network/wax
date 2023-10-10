from utils.checkers import check_operations, check_transaction

from wax.proto import (
    operation_pb2,
    transaction_pb2,
    asset_pb2,
    legacy_chain_properties_pb2,
    pow2_pb2
)

def test_pow2():
    pow2_input: pow2_pb2.pow2_input = pow2_pb2.pow2_input(
        worker_account="worker",
        prev_block="111122222",
        nonce=8383494
    )
    equihash_proof: pow2_pb2.equihash_proof = pow2_pb2.equihash_proof(
        n=3,
        k=17,
        seed="302754",
        inputs=[333]
    )
    equihash_pow: pow2_pb2.equihash_pow = pow2_pb2.equihash_pow(
        input=pow2_input,
        proof=equihash_proof,
        prev_block="111122222",
        pow_summary=100
    )
    pow2_work: pow2_pb2.pow2_work = pow2_pb2.pow2_work(
        equihash_pow=equihash_pow
    )
    amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="3000"
    )
    legacy_chain_properties: legacy_chain_properties_pb2.legacy_chain_properties = legacy_chain_properties_pb2.legacy_chain_properties(
        account_creation_fee=amount,
        maximum_block_size=10000,
        hbd_interest_rate=66,
    )

    pow2: pow2_pb2.pow2 = pow2_pb2.pow2(
        work=pow2_work,
        new_owner_key="STM8LoQjQqJHvotqBo7HjnqmUbFW9oJ2theyqonzUd9DdJ7YYHsvD",
        props=legacy_chain_properties
    )

    pow2_operation: operation_pb2.operation = operation_pb2.operation(
        pow2=pow2
    )

    check_operations(pow2_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[pow2_operation]
    )

    check_transaction(transaction)
