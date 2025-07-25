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
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\n!PyErr_Occurred()\nPython function call failed: \'type\'\n    {"pyerr":"\'type\'"}\n    python_managed_object.hpp:63 call_python_function')

    # Negative test
    tx_str = json.dumps(API_REF_TRANSACTION_NO_OPERATIONS)
    result = validate_transaction(tx_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (b'10 assert_exception: Assert Exception\n!PyErr_Occurred()\nPython function '
        b'call failed: \'operations\'\n    {"pyerr":"\'operations\'"}\n    python_managed_object.hpp:63 call_python_function')

    # Negative test
    tx_str = json.dumps(API_REF_TRANSACTION_EMPTY_OPERATIONS)
    result = validate_transaction(tx_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\n!PyErr_Occurred()\nPython function '
        b'call failed: \'extensions\'\n    {"pyerr":"\'extensions\'"}\n    python_ma'
        b'naged_object.hpp:63 call_python_function'
    )
