import json

from tests.utils.refs import PROTO_REF_TRANSACTION, PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION, API_REF_TRANSACTION

from wax import calculate_proto_transaction_id, calculate_proto_legacy_transaction_id

def test_calculate_proto_transaction_id():
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    result = calculate_proto_transaction_id(tx_str.encode())
    assert result.status == result.status.ok, "Proto transaction ID calculation should succeed"
    assert result.exception_message == b'', "No exception expected for valid proto transaction"
    assert result.result == b'4491c7a6362e71cca31e256f69af503e0abc5d3d', "Transaction ID should match expected value"

    # Negative test - API format should fail for proto function
    tx_str = json.dumps(API_REF_TRANSACTION)
    result = calculate_proto_transaction_id(tx_str.encode())
    assert result.status == result.status.fail, "API format transaction should fail for proto function"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"Could not find the supported property in static variant" in result.exception_message, "Error should indicate format mismatch"
    assert b"'nextkey': 'type'" in result.exception_message, "Error should reference missing type field"

def test_calculate_proto_serialization_sensitive_transaction_id():
    tx_str = json.dumps(PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION)
    result = calculate_proto_transaction_id(tx_str.encode())
    assert result.status == result.status.ok, "Serialization sensitive transaction ID calculation should succeed"
    assert result.exception_message == b'', "No exception expected"
    assert result.result == b'3725c81634f152011e2043eb7119911b953d4267', "Transaction ID should match expected value"

    tx_str = json.dumps(PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION)
    result = calculate_proto_legacy_transaction_id(tx_str.encode())
    assert result.status == result.status.ok, "Legacy transaction ID calculation should succeed"
    assert result.exception_message == b'', "No exception expected for legacy calculation"
    assert result.result == b'7f34699e9eea49d1bcc10c88f96e38897839ece3', "Legacy transaction ID should differ from standard"
