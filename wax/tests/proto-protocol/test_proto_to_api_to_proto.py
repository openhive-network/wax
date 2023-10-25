import json
from google.protobuf.json_format import MessageToJson

from utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import api_to_proto, proto_to_api
from wax.proto import (
    operation_pb2,
    transaction_pb2,
    asset_pb2,
    legacy_chain_properties_pb2,
    pow2_pb2,
    recover_account_pb2,
    future_extensions_pb2,
    authority_pb2,
    witness_set_properties_pb2
)


def test_proto_to_api_to_proto():
    proto_str = json.dumps(PROTO_REF_TRANSACTION)
    api = proto_to_api(proto_str.encode())
    assert api.status == api.status.ok
    assert api.exception_message == b''
    assert api.result.decode() == json.dumps(API_REF_TRANSACTION).replace(" ", "")

    api_str = api.result.decode()
    proto = api_to_proto(api_str.encode())
    print(proto)
    assert proto.status == proto.status.ok
    assert proto.exception_message == b''
    assert proto.result.decode() == json.dumps(PROTO_REF_TRANSACTION).replace(" ", "")

    # Test special case: pow2 operation
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

    proto_json = MessageToJson(pow2_operation)
    print(proto_json)
    print(proto_json.replace(" ", "").replace("\n", ""))
    api_result = proto_to_api(proto_json.encode())
    assert api_result.status == api_result.status.ok
    assert api_result.exception_message == b''

    api_json = api_result.result.decode()
    print(api_json)
    proto_result = api_to_proto(api_json.encode())
    print(proto_result.result.decode())
    assert proto_result.status == proto_result.status.ok
    assert proto_result.exception_message == b''
    assert proto_result.result.decode() == proto_json.replace(" ", "").replace("\n", "")

    # Test special case: recover_account operation
    extension: future_extensions_pb2.future_extensions = future_extensions_pb2.future_extensions()
    authority1: authority_pb2.authority = authority_pb2.authority(
        weight_threshold=1,
        account_auths={"account": 1, "account1": 2},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1}
    )
    authority2: authority_pb2.authority = authority_pb2.authority(
        weight_threshold=1,
        account_auths={"account1": 1, "account2": 2},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1}
    )
    recover_account: recover_account_pb2.recover_account = recover_account_pb2.recover_account(
        account_to_recover="account",
        new_owner_authority=authority1,
        recent_owner_authority=authority2,
        extensions=[]
    )

    recover_account_operation: operation_pb2.operation = operation_pb2.operation(
        recover_account=recover_account
    )

    proto_json = MessageToJson(recover_account_operation)
    print(proto_json)
    print(proto_json.replace(" ", "").replace("\n", ""))
    api_result = proto_to_api(proto_json.encode())
    assert api_result.status == api_result.status.ok
    assert api_result.exception_message == b''

    api_json = api_result.result.decode()
    print(api_json)
    proto_result = api_to_proto(api_json.encode())
    print(proto_result.result.decode())
    assert proto_result.status == proto_result.status.ok
    assert proto_result.exception_message == b''
    assert proto_result.result.decode() == proto_json.replace(" ", "").replace("\n", "")

    # Test special case: witness_set_properties operation
    witness_set_properties: witness_set_properties_pb2.witness_set_properties = witness_set_properties_pb2.witness_set_properties(
        owner="alloyxuast",
        props=[
            [
                "hbd_exchange_rate",
                "67010000000000000353424400000000e80300000000000003535445454d0000",
            ],
            [
                "key",
                "03d8cb826edbc3222ac59f30ce5d419d95903b94d0adfb197e25c60bca3b1ab5ae",
            ],
        ],
        extensions=[],
    )

    witness_set_properties_operation: operation_pb2.operation = (
        operation_pb2.operation(witness_set_properties=witness_set_properties)
    )

    proto_json = MessageToJson(witness_set_properties_operation)
    print(proto_json)
    print(proto_json.replace(" ", "").replace("\n", ""))
    api_result = proto_to_api(proto_json.encode())
    assert api_result.status == api_result.status.ok
    assert api_result.exception_message == b''

    api_json = api_result.result.decode()
    print(api_json)
    proto_result = api_to_proto(api_json.encode())
    print(proto_result.result.decode())
    assert proto_result.status == proto_result.status.ok
    assert proto_result.exception_message == b''
    assert proto_result.result.decode() == proto_json.replace(" ", "").replace("\n", "")
