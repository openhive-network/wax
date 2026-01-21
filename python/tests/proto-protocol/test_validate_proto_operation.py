import json

from tests.utils.refs import API_REF_VOTE_OP, PROTO_REF_VOTE_OP, PROTO_REF_VOTE_OP_EMPTY
from wax import validate_proto_operation


def test_validate_proto_operation_positive_with_valid_proto_operation():
    # Arrange
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP)

    # Act
    result = validate_proto_operation(vote_op_str.encode())

    # Assert
    assert result.status == result.status.ok
    assert result.exception_message == b''


def test_validate_proto_operation_negative_with_empty_json():
    # Arrange
    empty_json = b'{}'

    # Act
    result = validate_proto_operation(empty_json)

    # Assert
    assert result.status == result.status.fail


def test_validate_proto_operation_negative_with_api_format_instead_of_proto():
    # Arrange
    vote_op_str = json.dumps(API_REF_VOTE_OP)

    # Act
    result = validate_proto_operation(vote_op_str.encode())

    # Assert
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message, "Exception should contain error code 10"
    assert b"'name': 'assert_exception'" in result.exception_message, "Exception should be of type assert_exception"
    assert b"Could not find the supported property" in result.exception_message, "Should describe lookup failure"


def test_validate_proto_operation_negative_with_empty_proto_operation():
    # Arrange
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP_EMPTY)

    # Act
    result = validate_proto_operation(vote_op_str.encode())

    # Assert
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message, "Exception should contain error code 10"
    assert b"'name': 'assert_exception'" in result.exception_message, "Exception should be of type assert_exception"
    assert b"Python function call failed" in result.exception_message, "Should indicate Python call failure"
    assert b"'voter'" in result.exception_message, "Exception should reference missing voter field"
