import json

from tests.utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION
from wax import proto_to_api


def test_proto_to_api_positive_with_valid_proto_transaction():
    # Arrange
    proto_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act
    api = proto_to_api(proto_str.encode())

    # Assert
    assert api.status == api.status.ok
    assert api.exception_message == b''
    assert api.result.decode() == json.dumps(API_REF_TRANSACTION)


def test_proto_to_api_negative_with_api_format_instead_of_proto():
    # Arrange
    proto_str = json.dumps(API_REF_TRANSACTION)

    # Act
    api = proto_to_api(proto_str.encode())

    # Assert
    assert api.status == api.status.fail
    assert b"'code': 10" in api.exception_message, "Exception should contain error code 10"
    assert b"'name': 'assert_exception'" in api.exception_message, "Exception should be of type assert_exception"
    assert b"Could not find the supported property in static variant" in api.exception_message, "Exception should describe the property lookup failure"
    assert b"'nextkey': 'type'" in api.exception_message, "Exception should indicate the missing 'type' key"
