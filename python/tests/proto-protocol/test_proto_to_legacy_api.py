import json

from tests.utils.refs import API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION, PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION

from wax import proto_to_legacy_api


def test_tx_proto_to_legacy_api():
    proto_str = json.dumps(PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION)
    api = proto_to_legacy_api(proto_str)
    assert api.status == api.status.ok
    assert api.exception_message == ''
    assert json.loads(api.result) == API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION

    # Negative test
    proto_str = json.dumps(API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION)
    api = proto_to_legacy_api(proto_str)
    assert api.status == api.status.fail
    assert api.exception_message == (
        "{'code': 10, 'name': 'assert_exception', 'message': 'Assert Exception', 'stack': [{'context': {'level': 'error', 'file': 'python_managed_object.hpp', 'line': 63, 'method': 'call_python_function', 'hostname': '', 'thread_name': 'th_a'}, 'format': 'Python function call failed: ${pyerr}', 'data': {'pyerr': \"'list' object has no attribute 'keys'\"}}], 'extension': {'assertion_expression': '!PyErr_Occurred()'}, 'assert_hash': '3191462237188738789'}"
    )

# We do not test conversion for operations (legacy code)

# def test_op_proto_to_legacy_api():
#     proto_op = PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION["operations"][0]
#     proto_str = json.dumps(proto_op)
#     api = proto_to_legacy_api(proto_str)
#     print(api.exception_message)
#     assert api.status == api.status.ok
#     assert api.exception_message == ''
#     assert json.loads(api.result) == API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION["operations"][0]

#     # Negative test
#     proto_op = API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION["operations"][0]
#     proto_str = json.dumps(proto_op)
#     api = proto_to_legacy_api(proto_str)
#     print(api.exception_message)
#     assert api.status == api.status.fail
#     assert api.exception_message == (
#         '10 assert_exception: Assert Exception\n'
#         'var.is_object()\n'
#         'cpp_proto_to_legacy_api requires JSON object as an argument\n'
#         '    {}\n'
#         '    protobuf_protocol_impl.inl:627 operator()'
#     )
