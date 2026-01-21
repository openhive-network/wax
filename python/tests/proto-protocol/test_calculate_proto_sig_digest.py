import json

from tests.utils.refs import API_REF_TRANSACTION, PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION, PROTO_REF_TRANSACTION
from wax import calculate_proto_legacy_sig_digest, calculate_proto_sig_digest


def test_calculate_proto_sig_digest_positive_with_valid_proto_transaction():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    chain_id = b'beeab0de00000000000000000000000000000000000000000000000000000000'

    # Act
    result = calculate_proto_sig_digest(tx_str.encode(), chain_id)

    # Assert
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == b'b31ff450905ad705ed0d7fd5e270c3685442203e15e1b1e7d5e94b35dcdc1693'


def test_calculate_proto_sig_digest_negative_with_api_format_instead_of_proto():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION)
    chain_id = b'beeab0de00000000000000000000000000000000000000000000000000000000'

    # Act
    result = calculate_proto_sig_digest(tx_str.encode(), chain_id)

    # Assert
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message, "Exception should contain error code 10"
    assert b"'name': 'assert_exception'" in result.exception_message, "Exception should be of type assert_exception"
    assert b"Could not find the supported property in static variant" in result.exception_message, "Exception should describe the property lookup failure"


def test_calculate_proto_serialization_sensitive_sig_digest_succeeds():
    # Arrange
    tx_str = json.dumps(PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION)
    chain_id = b'beeab0de00000000000000000000000000000000000000000000000000000000'

    # Act
    result = calculate_proto_sig_digest(tx_str.encode(), chain_id)

    # Assert
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == b'8758db23c6aea40564697620ff61625b45c3b538cda21ded9fd6ec229caa1ee9'


def test_calculate_proto_legacy_sig_digest_positive_with_serialization_sensitive_transaction():
    # Arrange
    tx_str = json.dumps(PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION)
    chain_id = b'beeab0de00000000000000000000000000000000000000000000000000000000'

    # Act
    result = calculate_proto_legacy_sig_digest(tx_str.encode(), chain_id)

    # Assert
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == b'7fbd09ff2c3a90acfc59adce5abffdaa3fc95e33160c5ac237f0f4366f90e2fe'
