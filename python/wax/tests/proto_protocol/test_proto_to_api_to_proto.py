import json
from google.protobuf.json_format import MessageToJson

from tests.wax.utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import api_to_proto, proto_to_api
from wax.proto.operations import operation, pow2, recover_account, witness_set_properties
from wax.proto.asset import asset
from wax.proto.authority import authority
from wax._private.proto.pow2_pb2 import pow2_input, pow2_pow, pow2_work
from wax._private.proto.legacy_chain_properties_pb2 import legacy_chain_properties
from wax._private.proto.future_extensions_pb2 import future_extensions


def test_proto_to_api_to_proto():
    proto_str = json.dumps(PROTO_REF_TRANSACTION)
    api = proto_to_api(proto_str)
    assert api.status == api.status.ok
    assert api.exception_message == ''
    assert api.result == json.dumps(API_REF_TRANSACTION)

    api_str = api.result
    proto = api_to_proto(api_str)
    print(proto)
    assert proto.status == proto.status.ok
    assert proto.exception_message == ''
    assert proto.result == json.dumps(PROTO_REF_TRANSACTION)

    # We do not test conversion for operations (legacy code)

    # # Test special case: pow2 operation
    # pow2_input_proto: pow2_input = pow2_input(
    #     worker_account="aizen06",
    #     prev_block="003ea604345523c344fbadab605073ea712dd76f",
    #     nonce=1052853013628665497
    # )
    # pow2_pow_proto: pow2_pow = pow2_pow(
    #     input=pow2_input_proto,
    #     pow_summary=3817904373
    # )
    # pow2_work_proto: pow2_work = pow2_work(
    #     pow2=pow2_pow_proto
    # )
    # amount: asset = asset(
    #     nai="@@000000021", precision=3, amount="1"
    # )
    # legacy_chain_properties_proto: legacy_chain_properties = legacy_chain_properties(
    #     account_creation_fee=amount,
    #     maximum_block_size=131072,
    #     hbd_interest_rate=1000
    # )

    # pow2_proto: pow2 = pow2(
    #     work=pow2_work_proto,
    #     props=legacy_chain_properties_proto
    # )

    # pow2_operation: operation = operation(
    #     pow2_operation=pow2_proto
    # )

    # proto_json = MessageToJson(pow2_operation)
    # print(proto_json)
    # print(proto_json.replace(" ", "").replace("\n", ""))
    # api_result = proto_to_api(proto_json.encode())
    # assert api_result.status == api_result.status.ok
    # assert api_result.exception_message == ''

    # api_json = api_result.result
    # print(api_json)
    # proto_result = api_to_proto(api_json.encode())
    # print(proto_result.result)
    # assert proto_result.status == proto_result.status.ok
    # assert proto_result.exception_message == ''
    # assert proto_result.result == proto_json.replace(" ", "").replace("\n", "")

    # # Test special case: recover_account operation
    # extension: future_extensions = future_extensions()
    # authority1: authority = authority(
    #     weight_threshold=1,
    #     account_auths={"account": 1, "account1": 2},
    #     key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1}
    # )
    # authority2: authority = authority(
    #     weight_threshold=1,
    #     account_auths={"account1": 1, "account2": 2},
    #     key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1}
    # )
    # recover_account_proto: recover_account = recover_account(
    #     account_to_recover="account",
    #     new_owner_authority=authority1,
    #     recent_owner_authority=authority2,
    #     extensions=[]
    # )

    # recover_account_operation: operation = operation(
    #     recover_account_operation=recover_account_proto
    # )

    # proto_json = MessageToJson(recover_account_operation)
    # print(proto_json)
    # print(proto_json.replace(" ", "").replace("\n", ""))
    # api_result = proto_to_api(proto_json.encode())
    # assert api_result.status == api_result.status.ok
    # assert api_result.exception_message == ''

    # api_json = api_result.result
    # print(api_json)
    # proto_result = api_to_proto(api_json.encode())
    # print(proto_result.result)
    # assert proto_result.status == proto_result.status.ok
    # assert proto_result.exception_message == ''
    # assert proto_result.result == proto_json.replace(" ", "").replace("\n", "")

    # # Test special case: witness_set_properties operation
    # witness_set_properties_proto: witness_set_properties = witness_set_properties(
    #     owner="alloyxuast",
    #     props=[
    #         [
    #             "hbd_exchange_rate",
    #             "67010000000000000353424400000000e80300000000000003535445454d0000",
    #         ],
    #         [
    #             "key",
    #             "03d8cb826edbc3222ac59f30ce5d419d95903b94d0adfb197e25c60bca3b1ab5ae",
    #         ],
    #     ],
    #     extensions=[],
    # )

    # witness_set_properties_operation: operation = (
    #     operation(witness_set_properties_operation=witness_set_properties_proto)
    # )

    # proto_json = MessageToJson(witness_set_properties_operation)
    # print(proto_json)
    # print(proto_json.replace(" ", "").replace("\n", ""))
    # api_result = proto_to_api(proto_json.encode())
    # assert api_result.status == api_result.status.ok
    # assert api_result.exception_message == ''

    # api_json = api_result.result
    # print(api_json)
    # proto_result = api_to_proto(api_json.encode())
    # print(proto_result.result)
    # assert proto_result.status == proto_result.status.ok
    # assert proto_result.exception_message == ''
    # assert proto_result.result == proto_json.replace(" ", "").replace("\n", "")
