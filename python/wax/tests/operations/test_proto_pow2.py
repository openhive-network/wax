from wax._private.proto import legacy_chain_properties_pb2, pow2_pb2
from wax.proto.asset import asset
from wax.proto.operations import operation, pow2
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_pow2_1():
    # tx #e4cc9d33f441f5a65cdab60472f1ff3fd6055fa4
    pow2_input: pow2_pb2.pow2_input = pow2_pb2.pow2_input(
        worker_account="kartoffel19", prev_block="00a231448a2018f4fccec2c9f1e1196a2fd7985b", nonce=9003093069788329103
    )
    equihash_proof: pow2_pb2.equihash_proof = pow2_pb2.equihash_proof(
        n=140,
        k=6,
        seed="e1b5678bd1a88c3e61fb4f26ef8b0f59a53fd1fa3587dd3102aef09739d8e056",
        inputs=[
            2930666,
            3055534,
            16227194,
            1878724,
            3055534,
            3370375,
            10368718,
            8279292,
            1878724,
            12665269,
            13416647,
            14101780,
            14954112,
            16332900,
            7269530,
            13055417,
            16709657,
            14859041,
            8879475,
            3839300,
            8879475,
            14954112,
            3370375,
            7416112,
            15613499,
            15613499,
            6086878,
            9856240,
            587509,
            587509,
            6047993,
            10368718,
            6449363,
            7416112,
            15056305,
            8279292,
            13055417,
            6086878,
            16332900,
            14859041,
            308997,
            13416647,
            14101780,
            2930666,
            2552223,
            12665269,
            2552223,
            6047993,
            308997,
            16709657,
            3654688,
            9885009,
            15056305,
            9856240,
            7269530,
            3654688,
            5757028,
            16227194,
            5757028,
            3839300,
            9885009,
            6449363,
            2141293,
            2141293,
        ],
    )
    equihash_pow: pow2_pb2.equihash_pow = pow2_pb2.equihash_pow(
        input=pow2_input,
        proof=equihash_proof,
        prev_block="00a231448a2018f4fccec2c9f1e1196a2fd7985b",
        pow_summary=3542335882,
    )
    pow2_work: pow2_pb2.pow2_work = pow2_pb2.pow2_work(equihash_pow=equihash_pow)
    amount: asset = asset(nai="@@000000021", precision=3, amount="1")
    legacy_chain_properties: legacy_chain_properties_pb2.legacy_chain_properties = (
        legacy_chain_properties_pb2.legacy_chain_properties(
            account_creation_fee=amount, maximum_block_size=131072, hbd_interest_rate=1000
        )
    )

    pow2_proto: pow2 = pow2(work=pow2_work, props=legacy_chain_properties)

    pow2_operation: operation = operation(pow2_operation=pow2_proto)

    check_operations(pow2_operation)

    transaction_proto: transaction = transaction(operations=[pow2_operation])

    check_transaction(transaction_proto)


def test_pow2_2():
    pow2_input: pow2_pb2.pow2_input = pow2_pb2.pow2_input(
        worker_account="aizen06", prev_block="003ea604345523c344fbadab605073ea712dd76f", nonce=1052853013628665497
    )
    pow2_pow: pow2_pb2.pow2_pow = pow2_pb2.pow2_pow(input=pow2_input, pow_summary=3817904373)
    pow2_work: pow2_pb2.pow2_work = pow2_pb2.pow2_work(pow2=pow2_pow)
    amount: asset = asset(nai="@@000000021", precision=3, amount="1")
    legacy_chain_properties: legacy_chain_properties_pb2.legacy_chain_properties = (
        legacy_chain_properties_pb2.legacy_chain_properties(
            account_creation_fee=amount, maximum_block_size=131072, hbd_interest_rate=1000
        )
    )

    pow2_proto: pow2 = pow2(work=pow2_work, props=legacy_chain_properties)

    pow2_operation: operation = operation(pow2_operation=pow2_proto)

    check_operations(pow2_operation)

    transaction_proto: transaction = transaction(operations=[pow2_operation])

    check_transaction(transaction_proto)
