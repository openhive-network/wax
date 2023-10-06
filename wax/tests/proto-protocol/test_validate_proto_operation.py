import json

from utils.refs import PROTO_REF_VOTE_OP, API_REF_VOTE_OP

from wax import validate_proto_operation

def test_validate_proto_operation():
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP)
    result = validate_proto_operation(vote_op_str.encode())
    assert result.status == result.status.ok
    assert result.exception_message == b''

    # Should not crash
    result = validate_proto_operation(b'{}')
    assert result.status == result.status.fail

    # Negative test
    vote_op_str = json.dumps(API_REF_VOTE_OP)
    result = validate_proto_operation(vote_op_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\nop.get_object()[key].is_object()'
        b'\nOperation should contain the body\n    {}\n    cpython_interface.cpp:92 parse_proto_operation')
