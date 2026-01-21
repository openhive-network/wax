import json

from tests.utils.refs import (
    API_REF_TRANSACTION,
    PROTO_REF_TRANSACTION,
    PROTO_REF_TRANSACTION_EMPTY_OPERATIONS,
    PROTO_REF_TRANSACTION_NO_OPERATIONS,
)
from wax import validate_proto_transaction


def test_validate_proto_transaction_positive_with_valid_proto_transaction():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act
    result = validate_proto_transaction(tx_str.encode())

    # Assert
    assert result.status == result.status.ok
    assert result.exception_message == b''


def test_validate_proto_transaction_negative_with_empty_json():
    # Arrange
    empty_json = b'{}'

    # Act
    result = validate_proto_transaction(empty_json)

    # Assert
    assert result.status == result.status.fail


def test_validate_proto_transaction_negative_with_api_format_instead_of_proto():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION)

    # Act
    result = validate_proto_transaction(tx_str.encode())

    # Assert
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message, "Exception should contain error code 10"
    assert b"'name': 'assert_exception'" in result.exception_message, "Exception should be of type assert_exception"
    assert b"Could not find the supported property" in result.exception_message, "Should describe lookup failure"


def test_validate_proto_transaction_negative_with_missing_operations_field():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION_NO_OPERATIONS)

    # Act
    result = validate_proto_transaction(tx_str.encode())

    # Assert
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message, "Exception should contain error code 10"
    assert b"'name': 'assert_exception'" in result.exception_message, "Exception should be of type assert_exception"
    assert b"Python function call failed" in result.exception_message, "Should indicate Python call failure"
    assert b"'operations'" in result.exception_message, "Should reference missing operations field"


def test_validate_proto_transaction_negative_with_empty_operations():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION_EMPTY_OPERATIONS)

    # Act
    result = validate_proto_transaction(tx_str.encode())

    # Assert
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message, "Exception should contain error code 10"
    assert b"'name': 'assert_exception'" in result.exception_message, "Exception should be of type assert_exception"
    assert b"must have at least one operation" in result.exception_message, "Should indicate empty operations"
