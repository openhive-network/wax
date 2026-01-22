import json

from tests.utils.refs import API_REF_VOTE_OP, PROTO_REF_VOTE_OP, API_REF_VOTE_OP_EMPTY

from wax import validate_operation

def test_validate_operation():
    vote_op_str = json.dumps(API_REF_VOTE_OP)
    result = validate_operation(vote_op_str.encode())
    assert result.status == result.status.ok
    assert result.exception_message == b''

    # Should not crash
    result = validate_operation(b'{}')
    assert result.status == result.status.fail

    # Negative test
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP)
    result = validate_operation(vote_op_str.encode())
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message
    assert b"'name': 'assert_exception'" in result.exception_message
    assert b"Python function call failed" in result.exception_message
    assert b"'type'" in result.exception_message

    vote_op_str = json.dumps(API_REF_VOTE_OP_EMPTY)
    result = validate_operation(vote_op_str.encode())
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message
    assert b"'name': 'assert_exception'" in result.exception_message
    assert b"Account name" in result.exception_message
    assert b"is too short" in result.exception_message
