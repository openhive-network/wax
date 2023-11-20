from utils.checkers import check_operations, check_transaction

from wax.proto import (
    operation_pb2,
    transaction_pb2,
    asset_pb2,
    legacy_chain_properties_pb2,
    pow2_pb2
)

def test_pow2_1():
    pow2_input: pow2_pb2.pow2_input = pow2_pb2.pow2_input(
        worker_account="a001",
        prev_block="00710409525ac2205533d5cecf688dcfb9ed9763",
        nonce=3241876694
    )
    equihash_proof: pow2_pb2.equihash_proof = pow2_pb2.equihash_proof(
        n=140,
        k=6,
        seed="d296b7ce0c09a892ae175637f2f5b770a8f30bbd16e39e2c546b39751ae8a4e8",
        inputs=[
            838843,1700112,591240,1271741,384555,1031240,217723,1490024,772230,1612780,939183,1884770,1217975,1438841,1430504,1436435,
            411362,1100868,307196,1390157,255802,1384698,1805320,1912373,280246,2028292,1272016,1803615,995155,2050443,1399714,1603127,
            526061,981170,566961,911924,863697,2026678,1045939,1730488,42567,483535,411203,1670411,1484557,1515259,1913303,2037715,
            840141,1323426,695733,1186023,998304,1599633,894176,1119032,795201,1776040,1237487,1780635,66689,585288,581870,1723459]
    )
    equihash_pow: pow2_pb2.equihash_pow = pow2_pb2.equihash_pow(
        input=pow2_input,
        proof=equihash_proof,
        prev_block="0071040e86541666c009ebe1b5cb050ae9854d04",
        pow_summary=4200245725
    )
    pow2_work: pow2_pb2.pow2_work = pow2_pb2.pow2_work(
        equihash_pow=equihash_pow
    )
    amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="1"
    )
    legacy_chain_properties: legacy_chain_properties_pb2.legacy_chain_properties = legacy_chain_properties_pb2.legacy_chain_properties(
        account_creation_fee=amount,
        maximum_block_size=131072,
        hbd_interest_rate=1000
    )

    pow2: pow2_pb2.pow2 = pow2_pb2.pow2(
        work=pow2_work,
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

def test_pow2_2():
    pow2_input: pow2_pb2.pow2_input = pow2_pb2.pow2_input(
        worker_account="aizen06",
        prev_block="003ea604345523c344fbadab605073ea712dd76f",
        nonce=1052853013628665497
    )
    pow2_pow: pow2_pb2.pow2_pow = pow2_pb2.pow2_pow(
        input=pow2_input,
        pow_summary=3817904373
    )
    pow2_work: pow2_pb2.pow2_work = pow2_pb2.pow2_work(
        pow2=pow2_pow
    )
    amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="1"
    )
    legacy_chain_properties: legacy_chain_properties_pb2.legacy_chain_properties = legacy_chain_properties_pb2.legacy_chain_properties(
        account_creation_fee=amount,
        maximum_block_size=131072,
        hbd_interest_rate=1000
    )

    pow2: pow2_pb2.pow2 = pow2_pb2.pow2(
        work=pow2_work,
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
