import json

from tests.wax.utils.refs import API_REF_VOTE_OP, PROTO_REF_VOTE_OP, API_REF_VOTE_OP_EMPTY

from wax import validate_operation


def test_validate_operation_positive():
    # Arrange
    vote_op_str = json.dumps(API_REF_VOTE_OP)

    # Act
    result = validate_operation(vote_op_str.encode())

    # Assert
    assert result.status == result.status.ok, "Valid API operation should pass validation"
    assert result.exception_message == b"", "No exception expected for valid operation"


def test_validate_operation_empty_input():
    # Act
    result = validate_operation(b"{}")

    # Assert
    assert result.status == result.status.fail, "Empty input should fail validation"


def test_validate_operation_negative_proto_format():
    # Arrange
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP)

    # Act
    result = validate_operation(vote_op_str.encode())

    # Assert
    assert result.status == result.status.fail, "Proto format operation should fail API validation"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"Python function call failed" in result.exception_message, "Error should indicate Python call failure"
    assert b"'type'" in result.exception_message, "Error should reference type field"


def test_validate_operation_negative_empty_account():
    # Arrange
    vote_op_str = json.dumps(API_REF_VOTE_OP_EMPTY)

    # Act
    result = validate_operation(vote_op_str.encode())

    # Assert
    assert result.status == result.status.fail, "Operation with empty account should fail validation"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"Account name" in result.exception_message, "Error should reference account name"
    assert b"is too short" in result.exception_message, "Error should indicate name too short"
