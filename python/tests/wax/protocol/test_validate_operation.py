import json
import pytest

from wax.exceptions.wax_specialised_errors import DetailedCxxError, WaxProtocolAssertionError
from tests.wax.utils.refs import API_REF_VOTE_OP, PROTO_REF_VOTE_OP, API_REF_VOTE_OP_EMPTY

from wax import validate_operation


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
    with pytest.raises(DetailedCxxError) as error:
        validate_operation('{}')
    assert error.value.assert_hash == "3191462237188738789"


def test_validate_operation_negative_proto_format():
    # Arrange
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP)

    # Act & Assert
    with pytest.raises(DetailedCxxError) as error:
        validate_operation(vote_op_str)
    assert error.value.assert_hash == "3191462237188738789"


def test_validate_operation_negative_empty_account():
    # Arrange
    vote_op_str = json.dumps(API_REF_VOTE_OP_EMPTY)

    # Act & Assert
    with pytest.raises(WaxProtocolAssertionError) as error:
        validate_operation(vote_op_str)
    assert error.value.assert_hash == "17180696541040293791"
