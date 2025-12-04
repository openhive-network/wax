import json
import pytest

from tests.wax.utils.refs import PROTO_REF_VOTE_OP, API_REF_VOTE_OP, PROTO_REF_VOTE_OP_EMPTY

from wax import validate_proto_operation
from wax.exceptions.wax_specialised_errors import DetailedCxxError


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
    with pytest.raises(DetailedCxxError) as excinfo:
        validate_proto_operation('{}')
    assert excinfo.value.assert_hash == "3191462237188738789"


def test_validate_proto_operation_negative_api_format():
    # Arrange
    vote_op_str = json.dumps(API_REF_VOTE_OP)

    # Act & Assert
    with pytest.raises(DetailedCxxError) as excinfo:
        validate_proto_operation(vote_op_str)
    assert excinfo.value.assert_hash == "10056067403021329111"


def test_validate_proto_operation_negative_empty_voter():
    # Arrange
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP_EMPTY)

    # Act & Assert
    with pytest.raises(DetailedCxxError) as excinfo:
        validate_proto_operation(vote_op_str)
    assert excinfo.value.assert_hash == "3191462237188738789"
