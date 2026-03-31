import json

import pytest

from wax import validate_proto_operation
from wax.exceptions import WaxError
from wax_local_tools.refs import API_REF_VOTE_OP, PROTO_REF_VOTE_OP, PROTO_REF_VOTE_OP_EMPTY


def test_validate_proto_operation_positive():
    # Arrange
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP)

    # Act
    result = validate_proto_operation(vote_op_str)

    # Assert
    assert result.status == result.status.ok, "Valid proto operation should pass validation"
    assert result.exception_message == '', "No exception expected for valid operation"


def test_validate_proto_operation_empty_input():
    # Act & Assert
    with pytest.raises(WaxError):
        validate_proto_operation('{}')


def test_validate_proto_operation_negative_api_format():
    # Arrange
    vote_op_str = json.dumps(API_REF_VOTE_OP)

    # Act & Assert
    with pytest.raises(WaxError, match="Could not find the supported property in static variant"):
        validate_proto_operation(vote_op_str)


def test_validate_proto_operation_negative_empty_voter():
    # Arrange
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP_EMPTY)

    # Act & Assert
    with pytest.raises(WaxError):
        validate_proto_operation(vote_op_str)
