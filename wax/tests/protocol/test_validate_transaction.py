import json

from utils.refs import (
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
        b'10 assert_exception: Assert Exception\nv_object.contains( "type" )\nType field doesn\'t exist.\n    {}\n    static_variant.hpp:488 from_variant')

    # Negative test
    tx_str = json.dumps(API_REF_TRANSACTION_NO_OPERATIONS)
    result = validate_transaction(tx_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\noperations.size() > 0\nA transaction '
        b'must have at least one operation (unformatted args: ("trx",{"ref_block_num":19260,"ref_block_prefix":2140466769,'
        b'"expiration":"2016-09-15T19:47:33","operations":[],"extensions":[]}))\n    {"trx":{"ref_block_num":19260,'
        b'"ref_block_prefix":2140466769,"expiration":"2016-09-15T19:47:33","operations":[],'
        b'"extensions":[]}}\n    transaction.cpp:42 validate'
    )

    # Negative test
    tx_str = json.dumps(API_REF_TRANSACTION_EMPTY_OPERATIONS)
    result = validate_transaction(tx_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\noperations.size() > 0\nA transaction '
        b'must have at least one operation (unformatted args: ("trx",{"ref_block_num":19260,'
        b'"ref_block_prefix":2140466769,"expiration":"2016-09-15T19:47:33","operations":[],'
        b'"extensions":[]}))\n    {"trx":{"ref_block_num":19260,"ref_block_prefix":2140466769,'
        b'"expiration":"2016-09-15T19:47:33","operations":[],"extensions":[]}}\n    transaction.cpp:42 validate'
    )
