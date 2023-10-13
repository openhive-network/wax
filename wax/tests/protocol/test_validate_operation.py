import json

from utils.refs import API_REF_VOTE_OP, PROTO_REF_VOTE_OP, API_REF_VOTE_OP_EMPTY

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
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\nv_object.contains( "type" )\nType field doesn\'t exist.\n    {}\n    static_variant.hpp:465 from_variant')

    vote_op_str = json.dumps(API_REF_VOTE_OP_EMPTY)
    result = validate_operation(vote_op_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b"10 assert_exception: Assert Exception\nfalse\nAccount name '' is too short"
        b'. Use at least 3 characters.\n    {"name":"","min":3}\n    validation.hpp:'
        b'27 validate_account_name'
    )
