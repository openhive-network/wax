import json

from tests.utils.refs import API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION, PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION

from wax import proto_to_legacy_api


def test_tx_proto_to_legacy_api_positive():
    proto_str = json.dumps(PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION)
    api = proto_to_legacy_api(proto_str.encode())
    assert api.status == api.status.ok, "Proto to legacy API conversion should succeed"
    assert api.exception_message == b'', "No exception expected for valid proto transaction"
    assert json.loads(api.result.decode()) == API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION, "Converted legacy API should match reference"


def test_tx_proto_to_legacy_api_negative():
    proto_str = json.dumps(API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION)
    api = proto_to_legacy_api(proto_str.encode())
    assert api.status == api.status.fail, "Legacy API format input should fail for proto_to_legacy_api"
    assert b"'code': 10" in api.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in api.exception_message, "Error should be assert_exception type"
    assert b"Python function call failed" in api.exception_message, "Error should indicate Python call failure"
    assert b"'list' object has no attribute 'keys'" in api.exception_message, "Error should indicate list/dict mismatch"


# We do not test conversion for operations (legacy code)

# def test_op_proto_to_legacy_api():
#     proto_op = PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION["operations"][0]
#     proto_str = json.dumps(proto_op)
#     api = proto_to_legacy_api(proto_str.encode())
#     print(api.exception_message)
#     assert api.status == api.status.ok
#     assert api.exception_message == b''
#     assert json.loads(api.result.decode()) == API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION["operations"][0]

#     # Negative test
#     proto_op = API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION["operations"][0]
#     proto_str = json.dumps(proto_op)
#     api = proto_to_legacy_api(proto_str.encode())
#     print(api.exception_message)
#     assert api.status == api.status.fail
#     assert api.exception_message == (
#         b'10 assert_exception: Assert Exception\n'
#         b'var.is_object()\n'
#         b'cpp_proto_to_legacy_api requires JSON object as an argument\n'
#         b'    {}\n'
#         b'    protobuf_protocol_impl.inl:627 operator()'
#     )
