import json

import pytest

from wax import validate_proto_transaction
from wax.exceptions import WaxError
from wax_local_tools.refs import (
    API_REF_TRANSACTION,
    PROTO_REF_TRANSACTION,
    PROTO_REF_TRANSACTION_EMPTY_OPERATIONS,
    PROTO_REF_TRANSACTION_NO_OPERATIONS,
)


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
    with pytest.raises(WaxError):
        validate_proto_transaction('{}')


def test_validate_proto_transaction_negative_api_format():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION)

    # Act & Assert
    with pytest.raises(WaxError, match="Could not find the supported property in static variant"):
        validate_proto_transaction(tx_str)


def test_validate_proto_transaction_negative_no_operations():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION_NO_OPERATIONS)

    # Act & Assert
    with pytest.raises(WaxError):
        validate_proto_transaction(tx_str)


def test_validate_proto_transaction_negative_empty_operations():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION_EMPTY_OPERATIONS)

    # Act & Assert
    with pytest.raises(WaxError, match="A transaction must have at least one operation"):
        validate_proto_transaction(tx_str)
