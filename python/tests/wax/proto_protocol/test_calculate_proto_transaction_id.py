import json

import pytest

from tests.wax.utils.refs import PROTO_REF_TRANSACTION, PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION, API_REF_TRANSACTION

from wax import calculate_proto_transaction_id, calculate_proto_legacy_transaction_id
from wax.exceptions.wax_specialised_errors import DetailedCxxError


def test_calculate_proto_transaction_id_positive():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act
    result = calculate_proto_transaction_id(tx_str)

    # Assert
    assert result.status == result.status.ok, "Proto transaction ID calculation should succeed"
    assert result.exception_message == '', "No exception expected for valid proto transaction"
    assert result.result == '4491c7a6362e71cca31e256f69af503e0abc5d3d', "Transaction ID should match expected value"


def test_calculate_proto_transaction_id_negative():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION)

    # Act & Assert
    with pytest.raises(DetailedCxxError) as excinfo:
        calculate_proto_transaction_id(tx_str)
    assert excinfo.value.assert_hash == "10056067403021329111"


def test_calculate_proto_serialization_sensitive_transaction_id():
    # Arrange
    tx_str = json.dumps(PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION)

    # Act
    result = calculate_proto_transaction_id(tx_str)

    # Assert
    assert result.status == result.status.ok, "Serialization sensitive transaction ID calculation should succeed"
    assert result.exception_message == '', "No exception expected"
    assert result.result == '3725c81634f152011e2043eb7119911b953d4267', "Transaction ID should match expected value"


def test_calculate_proto_legacy_serialization_sensitive_transaction_id():
    # Arrange
    tx_str = json.dumps(PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION)

    # Act
    result = calculate_proto_legacy_transaction_id(tx_str)

    # Assert
    assert result.status == result.status.ok, "Legacy transaction ID calculation should succeed"
    assert result.exception_message == '', "No exception expected for legacy calculation"
    assert result.result == '7f34699e9eea49d1bcc10c88f96e38897839ece3', "Legacy transaction ID should differ from standard"
