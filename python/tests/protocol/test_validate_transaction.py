import json

from tests.utils.refs import (
    API_REF_TRANSACTION,
    PROTO_REF_TRANSACTION,
    API_REF_TRANSACTION_NO_OPERATIONS,
    API_REF_TRANSACTION_EMPTY_OPERATIONS
)

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
    assert b"'code': 10" in result.exception_message
    assert b"'name': 'assert_exception'" in result.exception_message
    assert b"Python function call failed" in result.exception_message
    assert b"'type'" in result.exception_message

    # Negative test
    tx_str = json.dumps(API_REF_TRANSACTION_NO_OPERATIONS)
    result = validate_transaction(tx_str.encode())
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message
    assert b"'name': 'assert_exception'" in result.exception_message
    assert b"A transaction must have at least one operation" in result.exception_message

    # Negative test
    tx_str = json.dumps(API_REF_TRANSACTION_EMPTY_OPERATIONS)
    result = validate_transaction(tx_str.encode())
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message
    assert b"'name': 'assert_exception'" in result.exception_message
    assert b"A transaction must have at least one operation" in result.exception_message
