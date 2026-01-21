import json

from tests.utils.refs import (
    API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION,
    PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION,
)
from wax import proto_to_legacy_api


def test_proto_to_legacy_api_positive_with_valid_proto_transaction():
    # Arrange
    proto_str = json.dumps(PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION)

    # Act
    api = proto_to_legacy_api(proto_str.encode())

    # Assert
    assert api.status == api.status.ok
    assert api.exception_message == b''
    assert json.loads(api.result.decode()) == API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION


def test_proto_to_legacy_api_negative_with_legacy_api_format_instead_of_proto():
    # Arrange
    proto_str = json.dumps(API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION)

    # Act
    api = proto_to_legacy_api(proto_str.encode())

    # Assert
    assert api.status == api.status.fail
    assert b"'code': 10" in api.exception_message, "Exception should contain error code 10"
    assert b"'name': 'assert_exception'" in api.exception_message, "Exception should be of type assert_exception"
    assert b"Python function call failed" in api.exception_message, "Exception should indicate Python function call failure"
    assert b"'list' object has no attribute 'keys'" in api.exception_message, "Exception should describe the type error"


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
