import json

from tests.utils.refs import API_REF_TRANSACTION, API_REF_SERIALIZATION_SENSITIVE_TRANSACTION, PROTO_REF_TRANSACTION

from wax import calculate_transaction_id, calculate_legacy_transaction_id

def test_calculate_transaction_id():
    tx_str = json.dumps(API_REF_TRANSACTION)
    result = calculate_transaction_id(tx_str)
    assert result.status == result.status.ok
    assert result.exception_message == ''
    assert result.result == '4491c7a6362e71cca31e256f69af503e0abc5d3d'

    # Negative test
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    result = calculate_transaction_id(tx_str)
    assert result.status == result.status.fail
    assert result.exception_message == (
        "{'code': 10, 'name': 'assert_exception', 'message': 'Assert Exception', 'stack': [{'context': {'level': 'error', 'file': 'python_managed_object.hpp', 'line': 63, 'method': 'call_python_function', 'hostname': '', 'thread_name': 'th_a'}, 'format': 'Python function call failed: ${pyerr}', 'data': {'pyerr': \"'type'\"}}], 'extension': {'assertion_expression': '!PyErr_Occurred()'}, 'assert_hash': '3191462237188738789'}")

def test_calculate_serialization_sensitive_transaction_id():
    tx_str = json.dumps(API_REF_SERIALIZATION_SENSITIVE_TRANSACTION)
    result = calculate_transaction_id(tx_str)
    assert result.status == result.status.ok
    assert result.exception_message == ''
    assert result.result == '3725c81634f152011e2043eb7119911b953d4267'

    legacy_result = calculate_legacy_transaction_id(tx_str)
    assert legacy_result.status == result.status.ok
    assert legacy_result.exception_message == ''
    assert legacy_result.result == '7f34699e9eea49d1bcc10c88f96e38897839ece3'
