import json
import pytest

from tests.wax.utils.refs import (
    PROTO_REF_TRANSACTION,
    API_REF_TRANSACTION,
    PROTO_REF_TRANSACTION_NO_OPERATIONS,
    PROTO_REF_TRANSACTION_EMPTY_OPERATIONS
)

from wax import validate_proto_transaction
from wax.exceptions.wax_specialised_errors import DetailedCxxError, WaxProtocolAssertionError


def test_validate_proto_transaction_positive():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act
    result = validate_proto_transaction(tx_str)

    # Assert
    assert result.status == result.status.ok, "Valid proto transaction should pass validation"
    assert result.exception_message == '', "No exception expected for valid transaction"


def test_validate_proto_transaction_empty_input():
    # Act & Assert
    with pytest.raises(DetailedCxxError) as excinfo:
        validate_proto_transaction('{}')
    assert excinfo.value.assert_hash == "3191462237188738789"


def test_validate_proto_transaction_negative_api_format():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION)

    # Act & Assert
    with pytest.raises(DetailedCxxError) as excinfo:
        validate_proto_transaction(tx_str)
    assert excinfo.value.assert_hash == "10056067403021329111"


def test_validate_proto_transaction_negative_no_operations():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION_NO_OPERATIONS)

    # Act & Assert
    with pytest.raises(DetailedCxxError) as excinfo:
        validate_proto_transaction(tx_str)
    assert excinfo.value.assert_hash == "3191462237188738789"


def test_validate_proto_transaction_negative_empty_operations():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION_EMPTY_OPERATIONS)

    # Act & Assert
    with pytest.raises(WaxProtocolAssertionError) as excinfo:
        validate_proto_transaction(tx_str)
    assert excinfo.value.assert_hash == "6215446810186363223"
