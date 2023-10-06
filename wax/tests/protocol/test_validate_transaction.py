import json

from utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import validate_transaction

def test_validate_transaction():
    tx_str = json.dumps(API_REF_TRANSACTION)
    result = validate_transaction(tx_str.encode())
    assert result.status == result.status.ok
    assert result.exception_message == b''

    # Should not crash
    result = validate_transaction(b'{}')
    assert result.status == result.status.fail

    # Negative test
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    result = validate_transaction(tx_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\nv_object.contains( "type" )\nType field doesn\'t exist.\n    {}\n    static_variant.hpp:465 from_variant')
