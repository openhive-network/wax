import json

from tests.utils.refs import (
    PROTO_REF_TRANSACTION,
    API_REF_TRANSACTION,
    PROTO_REF_TRANSACTION_NO_OPERATIONS,
    PROTO_REF_TRANSACTION_EMPTY_OPERATIONS
)

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
        b'10 assert_exception: Assert Exception\nit != to_tag.end()\nCould not find the supported property in static variant: type\n    {"nextkey":"type"}\n    val_protocol.hpp:68 from_jsval')

    # Negative test
    tx_str = json.dumps(PROTO_REF_TRANSACTION_NO_OPERATIONS)
    result = validate_proto_transaction(tx_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\n!PyErr_Occurred()\nPython function call failed: \'operations\'\n    {"pyerr":"\'operations\'"}\n    python_managed_object.hpp:63 call_python_function')

    # Negative test
    tx_str = json.dumps(PROTO_REF_TRANSACTION_EMPTY_OPERATIONS)
    result = validate_proto_transaction(tx_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\noperations.size() > 0\nA transaction '
        b'must have at least one operation (unformatted args: ("trx",{"ref_block_num":19260,'
        b'"ref_block_prefix":2140466769,"expiration":"2016-09-15T19:47:33","operations":[],'
        b'"extensions":[]}))\n    {"trx":{"ref_block_num":19260,"ref_block_prefix":2140466769,'
        b'"expiration":"2016-09-15T19:47:33","operations":[],"extensions":[]}}\n    transaction.cpp:42 validate'
    )
