from tests.wax.utils.checkers import check_operations, check_transaction

from wax._private.proto import pow_pb2, legacy_chain_properties_pb2
from wax.proto.operations import (
    operation,
    pow,
)
from wax.proto.asset import asset
from wax.proto.transaction import transaction


def test_pow():
    pow_work: pow_pb2.pow_work = pow_pb2.pow_work(
        worker="STM6esxvc2FqcacZPW3GuebniB3m95sVpJJ63kv9RmZu6Uhv4f4p1",
        input="40280961baf560b7ac75275719fd32347824a36e332d14d9650b3edecc8444fc",
        signature="20e04849e13ab128d7d32e68f6989b95a0c7a2b0f9efac2a0ebb65ef649506af0d5b9fa80555116880348e99b0947c30af612750fe4c09d829c0947ed8eb4ee2fc",
        work="000000026fadb7729a31f60d04bb8a8e83707fd3a108e75d4881c14410f4024b",
    )
    amount: asset = asset(nai="@@000000021", precision=3, amount="3000")
    legacy_chain_properties: legacy_chain_properties_pb2.legacy_chain_properties = (
        legacy_chain_properties_pb2.legacy_chain_properties(
            account_creation_fee=amount,
            maximum_block_size=100000,
            hbd_interest_rate=66,
        )
    )

    pow_proto: pow = pow(
        worker_account="steemit15",
        block_id="0031078448f8b2ceffc5052d9f9dd32951a184a4",
        nonce=17268219029926207870,
        work=pow_work,
        props=legacy_chain_properties,
    )

    pow_operation: operation = operation(pow_operation=pow_proto)

    check_operations(pow_operation)

    transaction_proto: transaction = transaction(operations=[pow_operation])

    check_transaction(transaction_proto)
