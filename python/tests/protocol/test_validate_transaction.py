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
    result = validate_transaction(tx_str)
    assert result.status == result.status.ok
    assert result.exception_message == b''

    # Should not crash
    result = validate_transaction('{}')
    assert result.status == result.status.fail

    # Negative test
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    result = validate_transaction(tx_str)
    assert result.status == result.status.fail
    assert result.exception_message == (
        b"{'code': 10, 'name': 'assert_exception', 'message': 'Assert Exception', 'stack': [{'context': {'level': 'error', 'file': 'python_managed_object.hpp', 'line': 63, 'method': 'call_python_function', 'hostname': '', 'thread_name': 'th_a'}, 'format': 'Python function call failed: ${pyerr}', 'data': {'pyerr': \"'type'\"}}], 'extension': {'assertion_expression': '!PyErr_Occurred()'}, 'assert_hash': '3191462237188738789'}")

    # Negative test
    tx_str = json.dumps(API_REF_TRANSACTION_NO_OPERATIONS)
    result = validate_transaction(tx_str)
    assert result.status == result.status.fail
    assert result.exception_message == (
        b"{'code': 10, 'name': 'assert_exception', 'message': 'Assert Exception', 'stack': [{'context': {'level': 'error', 'file': 'transaction.cpp', 'line': 42, 'method': 'validate', 'hostname': '', 'thread_name': 'th_a'}, 'format': 'A transaction must have at least one operation', 'data': {'trx': {'ref_block_num': 19260, 'ref_block_prefix': 2140466769, 'expiration': '2016-09-15T19:47:33', 'operations': [], 'extensions': []}}}], 'extension': {'assertion_expression': 'operations.size() > 0'}, 'assert_hash': '6215446810186363223'}")

    # Negative test
    tx_str = json.dumps(API_REF_TRANSACTION_EMPTY_OPERATIONS)
    result = validate_transaction(tx_str)
    assert result.status == result.status.fail
    assert result.exception_message == (
        b"{'code': 10, 'name': 'assert_exception', 'message': 'Assert Exception', 'stack': [{'context': {'level': 'error', 'file': 'transaction.cpp', 'line': 42, 'method': 'validate', 'hostname': '', 'thread_name': 'th_a'}, 'format': 'A transaction must have at least one operation', 'data': {'trx': {'ref_block_num': 19260, 'ref_block_prefix': 2140466769, 'expiration': '2016-09-15T19:47:33', 'operations': [], 'extensions': []}}}], 'extension': {'assertion_expression': 'operations.size() > 0'}, 'assert_hash': '6215446810186363223'}"
    )
