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
    assert result.status == result.status.ok, "Valid API transaction should pass validation"
    assert result.exception_message == b'', "No exception expected for valid transaction"

    # Should not crash on empty input
    result = validate_transaction(b'{}')
    assert result.status == result.status.fail, "Empty input should fail validation"

    # Negative test - proto format should fail for API validation
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    result = validate_transaction(tx_str.encode())
    assert result.status == result.status.fail, "Proto format transaction should fail API validation"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"Python function call failed" in result.exception_message, "Error should indicate Python call failure"
    assert b"'type'" in result.exception_message, "Error should reference type field"

    # Negative test - transaction without operations field should fail
    tx_str = json.dumps(API_REF_TRANSACTION_NO_OPERATIONS)
    result = validate_transaction(tx_str.encode())
    assert result.status == result.status.fail, "Transaction without operations field should fail"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"A transaction must have at least one operation" in result.exception_message, "Error should indicate missing operations"

    # Negative test - transaction with empty operations should fail
    tx_str = json.dumps(API_REF_TRANSACTION_EMPTY_OPERATIONS)
    result = validate_transaction(tx_str.encode())
    assert result.status == result.status.fail, "Transaction with empty operations should fail"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"A transaction must have at least one operation" in result.exception_message, "Error should indicate empty operations"
