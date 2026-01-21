import json

from tests.utils.refs import API_REF_VOTE_OP, API_REF_VOTE_OP_EMPTY, PROTO_REF_VOTE_OP
from wax import validate_operation


def test_validate_operation_positive_with_valid_api_operation():
    # Arrange
    vote_op_str = json.dumps(API_REF_VOTE_OP)

    # Act
    result = validate_operation(vote_op_str.encode())

    # Assert
    assert result.status == result.status.ok
    assert result.exception_message == b''


def test_validate_operation_negative_with_empty_json():
    # Arrange
    empty_json = b'{}'

    # Act
    result = validate_operation(empty_json)

    # Assert
    assert result.status == result.status.fail


def test_validate_operation_negative_with_proto_format_instead_of_api():
    # Arrange
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP)

    # Act
    result = validate_operation(vote_op_str.encode())

    # Assert
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message, "Exception should contain error code 10"
    assert b"'name': 'assert_exception'" in result.exception_message, "Exception should be of type assert_exception"
    assert b"Python function call failed" in result.exception_message, "Should indicate Python call failure"


def test_validate_operation_negative_with_empty_voter_field():
    # Arrange
    vote_op_str = json.dumps(API_REF_VOTE_OP_EMPTY)

    # Act
    result = validate_operation(vote_op_str.encode())

    # Assert
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message, "Exception should contain error code 10"
    assert b"'name': 'assert_exception'" in result.exception_message, "Exception should be of type assert_exception"
    assert b"is too short" in result.exception_message, "Should describe account name validation failure"
    assert b"account_name_validity::too_short" in result.exception_message, "Should contain assertion expression"
