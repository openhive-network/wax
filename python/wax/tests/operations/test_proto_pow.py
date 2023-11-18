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
        worker="STM6esxvc2FqcacZPW3GuebniB3m95sVpJJ63kv9RmZu6Uhv4f4p1",
        input="40280961baf560b7ac75275719fd32347824a36e332d14d9650b3edecc8444fc",
        signature="20e04849e13ab128d7d32e68f6989b95a0c7a2b0f9efac2a0ebb65ef649506af0d5b9fa80555116880348e99b0947c30af612750fe4c09d829c0947ed8eb4ee2fc",
        work="000000026fadb7729a31f60d04bb8a8e83707fd3a108e75d4881c14410f4024b"
    )
    amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="3000"
    )
    legacy_chain_properties: legacy_chain_properties_pb2.legacy_chain_properties = legacy_chain_properties_pb2.legacy_chain_properties(
        account_creation_fee=amount,
        maximum_block_size=100000,
        hbd_interest_rate=66,
    )

    pow: pow_pb2.pow = pow_pb2.pow(
        worker_account="steemit15",
        block_id="0031078448f8b2ceffc5052d9f9dd32951a184a4",
        nonce=17268219029926207870,
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
