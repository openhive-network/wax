import json

from tests.utils.refs import PROTO_REF_VOTE_OP, API_REF_VOTE_OP, PROTO_REF_VOTE_OP_EMPTY

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
        b'10 assert_exception: Assert Exception\nit != to_tag.end()\nCould not find the supported property in static variant: type\n    {"nextkey":"type"}\n    val_protocol.hpp:68 from_jsval')

    # Negative test
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP_EMPTY)
    result = validate_proto_operation(vote_op_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\n!PyErr_Occurred()\nPython function call failed: \'voter\'\n    {"pyerr":"\'voter\'"}\n    python_managed_object.hpp:63 call_python_function'
    )
