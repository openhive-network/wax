import json

from tests.utils.refs import API_REF_SERIALIZATION_SENSITIVE_TRANSACTION, API_REF_TRANSACTION, PROTO_REF_TRANSACTION
from wax import calculate_legacy_transaction_id, calculate_transaction_id


def test_calculate_transaction_id_positive_with_valid_api_transaction():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION)

    # Act
    result = calculate_transaction_id(tx_str.encode())

    # Assert
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == b'4491c7a6362e71cca31e256f69af503e0abc5d3d'


def test_calculate_transaction_id_negative_with_proto_format_instead_of_api():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act
    result = calculate_transaction_id(tx_str.encode())

    # Assert
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message, "Exception should contain error code 10"
    assert b"'name': 'assert_exception'" in result.exception_message, "Exception should be of type assert_exception"
    assert b"Python function call failed" in result.exception_message, "Exception should describe the Python call failure"


def test_calculate_serialization_sensitive_transaction_id_succeeds():
    # Arrange
    tx_str = json.dumps(API_REF_SERIALIZATION_SENSITIVE_TRANSACTION)

    # Act
    result = calculate_transaction_id(tx_str.encode())

    # Assert
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == b'3725c81634f152011e2043eb7119911b953d4267'


def test_calculate_legacy_transaction_id_positive_with_serialization_sensitive_transaction():
    # Arrange
    tx_str = json.dumps(API_REF_SERIALIZATION_SENSITIVE_TRANSACTION)

    # Act
    legacy_result = calculate_legacy_transaction_id(tx_str.encode())

    # Assert
    assert legacy_result.status == legacy_result.status.ok
    assert legacy_result.exception_message == b''
    assert legacy_result.result == b'7f34699e9eea49d1bcc10c88f96e38897839ece3'
