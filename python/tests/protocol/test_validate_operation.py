import json

from tests.utils.refs import API_REF_VOTE_OP, PROTO_REF_VOTE_OP, API_REF_VOTE_OP_EMPTY

from wax import validate_operation

def test_validate_operation():
    vote_op_str = json.dumps(API_REF_VOTE_OP)
    result = validate_operation(vote_op_str)
    assert result.status == result.status.ok
    assert result.exception_message == ''

    # Should not crash
    result = validate_operation('{}')
    assert result.status == result.status.fail

    # Negative test
    vote_op_str = json.dumps(PROTO_REF_VOTE_OP)
    result = validate_operation(vote_op_str)
    assert result.status == result.status.fail
    assert result.exception_message == (
        "{'code': 10, 'name': 'assert_exception', 'message': 'Assert Exception', 'stack': [{'context': {'level': 'error', 'file': 'python_managed_object.hpp', 'line': 63, 'method': 'call_python_function', 'hostname': '', 'thread_name': 'th_a'}, 'format': 'Python function call failed: ${pyerr}', 'data': {'pyerr': \"'type'\"}}], 'extension': {'assertion_expression': '!PyErr_Occurred()'}, 'assert_hash': '3191462237188738789'}")

    vote_op_str = json.dumps(API_REF_VOTE_OP_EMPTY)
    result = validate_operation(vote_op_str)
    assert result.status == result.status.fail
    assert result.exception_message == (
        "{'code': 10, 'name': 'assert_exception', 'message': 'Assert Exception', 'sta"
        "ck': [{'context': {'level': 'error', 'file': 'validation.hpp', 'line': 22, '"
        "method': 'validate_account_name', 'hostname': '', 'thread_name': 'th_a'}, 'f"
        'ormat\': "Account name \'${name}\' is too short. Use at least ${min} charac'
        'ters.", \'data\': {\'name\': \'\', \'min\': 3}}], \'extension\': {\'asserti'
        "on_expression': 'validity_check_result != account_name_validity::too_short'}"
        ", 'assert_hash': '17180696541040293791'}"
    )
