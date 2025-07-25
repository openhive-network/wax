import json

from tests.utils.refs import API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION, PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION

from wax import proto_to_legacy_api


def test_tx_proto_to_legacy_api():
    proto_str = json.dumps(PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION)
    api = proto_to_legacy_api(proto_str.encode())
    assert api.status == api.status.ok
    assert api.exception_message == b''
    assert json.loads(api.result.decode()) == API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION

    # Negative test
    proto_str = json.dumps(API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION)
    api = proto_to_legacy_api(proto_str.encode())
    assert api.status == api.status.fail
    assert api.exception_message == (
        b'10 assert_exception: Assert Exception\n!PyErr_Occurred()\nPython function call failed: \'list\' object has no attribute \'keys\'\n    {"pyerr":"\'list\' object has no attribute \'keys\'"}\n    python_managed_object.hpp:63 call_python_function'
    )

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
