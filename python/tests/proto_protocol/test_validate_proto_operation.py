import json

from tests.utils.refs import PROTO_REF_VOTE_OP, API_REF_VOTE_OP, PROTO_REF_VOTE_OP_EMPTY

from wax import validate_proto_operation


def test_validate_proto_operation_positive():
    # Arrange
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP)

    # Act
    result = validate_proto_operation(vote_op_str.encode())

    # Assert
    assert result.status == result.status.ok, "Valid proto operation should pass validation"
    assert result.exception_message == b'', "No exception expected for valid operation"


def test_validate_proto_operation_empty_input():
    # Act
    result = validate_proto_operation(b'{}')

    # Assert
    assert result.status == result.status.fail, "Empty input should fail validation"


def test_validate_proto_operation_negative_api_format():
    # Arrange
    vote_op_str = json.dumps(API_REF_VOTE_OP)

    # Act
    result = validate_proto_operation(vote_op_str.encode())

    # Assert
    assert result.status == result.status.fail, "API format operation should fail proto validation"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"Could not find the supported property in static variant" in result.exception_message, "Error should indicate format mismatch"
    assert b"'nextkey': 'type'" in result.exception_message, "Error should reference missing type field"


def test_validate_proto_operation_negative_empty_voter():
    # Arrange
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP_EMPTY)

    # Act
    result = validate_proto_operation(vote_op_str.encode())

    # Assert
    assert result.status == result.status.fail, "Operation with empty voter should fail validation"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"Python function call failed" in result.exception_message, "Error should indicate Python call failure"
    assert b"'voter'" in result.exception_message, "Error should reference voter field"
