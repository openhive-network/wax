import json
import pytest

from wax.exceptions.wax_specialised_errors import WaxProtocolAssertionError, DetailedCxxError
from tests.wax.utils.refs import (
    API_REF_TRANSACTION,
    PROTO_REF_TRANSACTION,
    API_REF_TRANSACTION_NO_OPERATIONS,
    API_REF_TRANSACTION_EMPTY_OPERATIONS
)

from wax import validate_transaction


def test_validate_transaction_positive():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION)

    # Act
    result = validate_transaction(tx_str)

    # Assert
    assert result.status == result.status.ok, "Valid API transaction should pass validation"
    assert result.exception_message == '', "No exception expected for valid transaction"


def test_validate_transaction_empty_input():
    # Act & Assert
    with pytest.raises(WaxProtocolAssertionError) as error:
        validate_transaction('{}')
    assert error.value.assert_hash == "6215446810186363223"


def test_validate_transaction_negative_proto_format():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act & Assert
    with pytest.raises(DetailedCxxError) as error:
        validate_transaction(tx_str)
    assert error.value.assert_hash == "3191462237188738789"


def test_validate_transaction_negative_no_operations():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION_NO_OPERATIONS)

    # Act & Assert
    with pytest.raises(WaxProtocolAssertionError) as error:
        validate_transaction(tx_str)
    assert error.value.assert_hash == "6215446810186363223"


def test_validate_transaction_negative_empty_operations():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION_EMPTY_OPERATIONS)

    # Act & Assert
    with pytest.raises(WaxProtocolAssertionError) as error:
        validate_transaction(tx_str)
    assert error.value.assert_hash == "6215446810186363223"
