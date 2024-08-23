import json

from utils.refs import API_REF_TRANSACTION, API_REF_SERIALIZATION_SENSITIVE_TRANSACTION, PROTO_REF_TRANSACTION

from wax import calculate_transaction_id, calculate_legacy_transaction_id

def test_calculate_transaction_id():
    tx_str = json.dumps(API_REF_TRANSACTION)
    result = calculate_transaction_id(tx_str.encode())
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == b'4491c7a6362e71cca31e256f69af503e0abc5d3d'

    # Negative test
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    result = calculate_transaction_id(tx_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\nv_object.contains( "type" )\nType field doesn\'t exist.\n    {}\n    static_variant.hpp:484 from_variant')

def test_calculate_serialization_sensitive_transaction_id():
    tx_str = json.dumps(API_REF_SERIALIZATION_SENSITIVE_TRANSACTION)
    result = calculate_transaction_id(tx_str.encode())
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == b'3725c81634f152011e2043eb7119911b953d4267'

    legacy_result = calculate_legacy_transaction_id(tx_str.encode())
    assert legacy_result.status == result.status.ok
    assert legacy_result.exception_message == b''
    assert legacy_result.result == b'7f34699e9eea49d1bcc10c88f96e38897839ece3'
