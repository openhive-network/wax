import json

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
    # Act
    result = validate_transaction('{}')

    # Assert
    assert result.status == result.status.fail, "Empty input should fail validation"


def test_validate_transaction_negative_proto_format():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act
    result = validate_transaction(tx_str)

    # Assert
    assert result.status == result.status.fail, "Proto format transaction should fail API validation"
    assert "'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert "'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert "Python function call failed" in result.exception_message, "Error should indicate Python call failure"
    assert "'type'" in result.exception_message, "Error should reference type field"


def test_validate_transaction_negative_no_operations():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION_NO_OPERATIONS)

    # Act
    result = validate_transaction(tx_str)

    # Assert
    assert result.status == result.status.fail, "Transaction without operations field should fail"
    assert "'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert "'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert "A transaction must have at least one operation" in result.exception_message, "Error should indicate missing operations"


def test_validate_transaction_negative_empty_operations():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION_EMPTY_OPERATIONS)

    # Act
    result = validate_transaction(tx_str)

    # Assert
    assert result.status == result.status.fail, "Transaction with empty operations should fail"
    assert "'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert "'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert "A transaction must have at least one operation" in result.exception_message, "Error should indicate empty operations"
