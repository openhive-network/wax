import json

from tests.utils.refs import (
    PROTO_REF_TRANSACTION,
    API_REF_TRANSACTION,
    PROTO_REF_TRANSACTION_NO_OPERATIONS,
    PROTO_REF_TRANSACTION_EMPTY_OPERATIONS,
)

from wax import validate_proto_transaction


def test_validate_proto_transaction_positive():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act
    result = validate_proto_transaction(tx_str.encode())

    # Assert
    assert result.status == result.status.ok, "Valid proto transaction should pass validation"
    assert result.exception_message == b"", "No exception expected for valid transaction"


def test_validate_proto_transaction_empty_input():
    # Act
    result = validate_proto_transaction(b"{}")

    # Assert
    assert result.status == result.status.fail, "Empty input should fail validation"


def test_validate_proto_transaction_negative_api_format():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION)

    # Act
    result = validate_proto_transaction(tx_str.encode())

    # Assert
    assert result.status == result.status.fail, "API format transaction should fail proto validation"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"Could not find the supported property in static variant" in result.exception_message, (
        "Error should indicate format mismatch"
    )
    assert b"'nextkey': 'type'" in result.exception_message, "Error should reference missing type field"


def test_validate_proto_transaction_negative_no_operations():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION_NO_OPERATIONS)

    # Act
    result = validate_proto_transaction(tx_str.encode())

    # Assert
    assert result.status == result.status.fail, "Transaction without operations field should fail"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"Python function call failed" in result.exception_message, "Error should indicate Python call failure"
    assert b"'operations'" in result.exception_message, "Error should reference missing operations field"


def test_validate_proto_transaction_negative_empty_operations():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION_EMPTY_OPERATIONS)

    # Act
    result = validate_proto_transaction(tx_str.encode())

    # Assert
    assert result.status == result.status.fail, "Transaction with empty operations should fail"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"A transaction must have at least one operation" in result.exception_message, (
        "Error should indicate empty operations"
    )
