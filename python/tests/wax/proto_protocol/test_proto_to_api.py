import json

from tests.wax.utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import proto_to_api


def test_proto_to_api_positive():
    # Arrange
    proto_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act
    api = proto_to_api(proto_str.encode())

    # Assert
    assert api.status == api.status.ok, "Proto to API conversion should succeed"
    assert api.exception_message == b"", "No exception expected for valid proto transaction"
    assert api.result.decode() == json.dumps(API_REF_TRANSACTION), "Converted API transaction should match reference"


def test_proto_to_api_negative():
    # Arrange
    proto_str = json.dumps(API_REF_TRANSACTION)

    # Act
    api = proto_to_api(proto_str.encode())

    # Assert
    assert api.status == api.status.fail, "API format input should fail for proto_to_api conversion"
    print(api.exception_message)
    # Check key parts of the error message without depending on exact line numbers which can change
    assert b"'code': 10" in api.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in api.exception_message, "Error should be assert_exception type"
    assert b"'file': 'api_converter.hpp'" in api.exception_message, "Error should reference api_converter source"
    assert b"Could not find the supported property in static variant" in api.exception_message, (
        "Error should indicate format mismatch"
    )
    assert b"'nextkey': 'type'" in api.exception_message, "Error should reference missing type field"
