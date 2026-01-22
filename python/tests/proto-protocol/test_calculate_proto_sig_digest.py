import json

from tests.utils.refs import PROTO_REF_TRANSACTION, PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION, API_REF_TRANSACTION

from wax import calculate_proto_sig_digest, calculate_proto_legacy_sig_digest


def test_calculate_proto_sig_digest_positive():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act
    result = calculate_proto_sig_digest(tx_str.encode(), b'beeab0de00000000000000000000000000000000000000000000000000000000')

    # Assert
    assert result.status == result.status.ok, "Proto sig digest calculation should succeed"
    assert result.exception_message == b'', "No exception expected for valid proto transaction"
    assert result.result == b'b31ff450905ad705ed0d7fd5e270c3685442203e15e1b1e7d5e94b35dcdc1693', "Sig digest should match expected value"


def test_calculate_proto_sig_digest_negative():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION)

    # Act
    result = calculate_proto_sig_digest(tx_str.encode(), b'beeab0de00000000000000000000000000000000000000000000000000000000')

    # Assert
    assert result.status == result.status.fail, "API format transaction should fail for proto function"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"Could not find the supported property in static variant" in result.exception_message, "Error should indicate format mismatch"
    assert b"'nextkey': 'type'" in result.exception_message, "Error should reference missing type field"


def test_calculate_proto_serialization_sensitive_sig_digest():
    # Arrange
    tx_str = json.dumps(PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION)

    # Act
    result = calculate_proto_sig_digest(tx_str.encode(), b'beeab0de00000000000000000000000000000000000000000000000000000000')

    # Assert
    assert result.status == result.status.ok, "Serialization sensitive sig digest calculation should succeed"
    assert result.exception_message == b'', "No exception expected"
    assert result.result == b'8758db23c6aea40564697620ff61625b45c3b538cda21ded9fd6ec229caa1ee9', "Sig digest should match expected value"


def test_calculate_proto_legacy_serialization_sensitive_sig_digest():
    # Arrange
    tx_str = json.dumps(PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION)

    # Act
    result = calculate_proto_legacy_sig_digest(tx_str.encode(), b'beeab0de00000000000000000000000000000000000000000000000000000000')

    # Assert
    assert result.status == result.status.ok, "Legacy sig digest calculation should succeed"
    assert result.exception_message == b'', "No exception expected for legacy calculation"
    assert result.result == b'7fbd09ff2c3a90acfc59adce5abffdaa3fc95e33160c5ac237f0f4366f90e2fe', "Legacy sig digest should differ from standard"
