import json

import pytest

from wax import validate_operation
from wax.exceptions import WaxError, WaxInvalidAccountNameException
from wax_local_tools.refs import API_REF_VOTE_OP, API_REF_VOTE_OP_EMPTY, PROTO_REF_VOTE_OP


def test_validate_operation_positive():
    # Arrange
    vote_op_str = json.dumps(API_REF_VOTE_OP)

    # Act
    result = validate_operation(vote_op_str)

    # Assert
    assert result.status == result.status.ok, "Valid API operation should pass validation"
    assert result.exception_message == '', "No exception expected for valid operation"


def test_validate_operation_empty_input():
    # Act & Assert
    with pytest.raises(WaxError):
        validate_operation('{}')


def test_validate_operation_negative_proto_format():
    # Arrange
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP)

    # Act & Assert
    with pytest.raises(WaxError):
        validate_operation(vote_op_str)


def test_validate_operation_negative_empty_account():
    # Arrange
    vote_op_str = json.dumps(API_REF_VOTE_OP_EMPTY)

    # Act & Assert
    with pytest.raises(WaxInvalidAccountNameException, match="Account name.*is too short"):
        validate_operation(vote_op_str)
