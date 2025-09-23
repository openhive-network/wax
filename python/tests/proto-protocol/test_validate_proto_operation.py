import json

from tests.utils.refs import PROTO_REF_VOTE_OP, API_REF_VOTE_OP, PROTO_REF_VOTE_OP_EMPTY

from wax import validate_proto_operation

def test_validate_proto_operation():
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP)
    result = validate_proto_operation(vote_op_str)
    assert result.status == result.status.ok
    assert result.exception_message == b''

    # Should not crash
    result = validate_proto_operation('{}')
    assert result.status == result.status.fail

    # Negative test
    vote_op_str = json.dumps(API_REF_VOTE_OP)
    result = validate_proto_operation(vote_op_str)
    assert result.status == result.status.fail
    assert result.exception_message == (
        b"{'code': 10, 'name': 'assert_exception', 'message': 'Assert Exception', 'stack': [{'context': {'level': 'error', 'file': 'val_protocol.hpp', 'line': 68, 'method': 'from_jsval', 'hostname': '', 'thread_name': 'th_a'}, 'format': 'Could not find the supported property in static variant: ${nextkey}', 'data': {'nextkey': 'type'}}], 'extension': {'assertion_expression': 'it != to_tag.end()'}, 'assert_hash': '10056067403021329111'}")

    # Negative test
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP_EMPTY)
    result = validate_proto_operation(vote_op_str)
    assert result.status == result.status.fail
    assert result.exception_message == (
        b"{'code': 10, 'name': 'assert_exception', 'message': 'Assert Exception', 'stack': [{'context': {'level': 'error', 'file': 'python_managed_object.hpp', 'line': 63, 'method': 'call_python_function', 'hostname': '', 'thread_name': 'th_a'}, 'format': 'Python function call failed: ${pyerr}', 'data': {'pyerr': \"'voter'\"}}], 'extension': {'assertion_expression': '!PyErr_Occurred()'}, 'assert_hash': '3191462237188738789'}"
    )
