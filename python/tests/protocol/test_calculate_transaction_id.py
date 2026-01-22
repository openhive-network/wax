import json

from tests.utils.refs import API_REF_TRANSACTION, API_REF_SERIALIZATION_SENSITIVE_TRANSACTION, PROTO_REF_TRANSACTION

from wax import calculate_transaction_id, calculate_legacy_transaction_id

def test_calculate_transaction_id():
    tx_str = json.dumps(API_REF_TRANSACTION)
    result = calculate_transaction_id(tx_str.encode())
    assert result.status == result.status.ok, "API transaction ID calculation should succeed"
    assert result.exception_message == b'', "No exception expected for valid API transaction"
    assert result.result == b'4491c7a6362e71cca31e256f69af503e0abc5d3d', "Transaction ID should match expected value"

    # Negative test - proto format should fail for API function
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    result = calculate_transaction_id(tx_str.encode())
    assert result.status == result.status.fail, "Proto format transaction should fail for API function"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"Python function call failed" in result.exception_message, "Error should indicate Python call failure"
    assert b"'type'" in result.exception_message, "Error should reference type field"

def test_calculate_serialization_sensitive_transaction_id():
    tx_str = json.dumps(API_REF_SERIALIZATION_SENSITIVE_TRANSACTION)
    result = calculate_transaction_id(tx_str.encode())
    assert result.status == result.status.ok, "Serialization sensitive transaction ID calculation should succeed"
    assert result.exception_message == b'', "No exception expected"
    assert result.result == b'3725c81634f152011e2043eb7119911b953d4267', "Transaction ID should match expected value"

    legacy_result = calculate_legacy_transaction_id(tx_str.encode())
    assert legacy_result.status == result.status.ok, "Legacy transaction ID calculation should succeed"
    assert legacy_result.exception_message == b'', "No exception expected for legacy calculation"
    assert legacy_result.result == b'7f34699e9eea49d1bcc10c88f96e38897839ece3', "Legacy transaction ID should differ from standard"
