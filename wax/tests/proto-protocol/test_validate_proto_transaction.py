import json

from utils.refs import PROTO_REF_TRANSACTION, API_REF_TRANSACTION

from wax import validate_proto_transaction

def test_validate_proto_transaction():
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    result = validate_proto_transaction(tx_str.encode())
    assert result.status == result.status.ok
    assert result.exception_message == b''

    # Should not crash
    result = validate_proto_transaction(b'{}')
    assert result.status == result.status.fail

    # Negative test
    tx_str = json.dumps(API_REF_TRANSACTION)
    result = validate_proto_transaction(tx_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\nop.get_object()[key].is_object()'
        b'\nOperation should contain the body\n    {}\n    cpython_interface.cpp:92 parse_proto_operation')