import json
from copy import deepcopy

from tests.utils.refs import PROTO_REF_TRANSACTION

from wax import validate_proto_transaction

def test_wrong_future_extensions():
    proto_tx = deepcopy(PROTO_REF_TRANSACTION)
    proto_tx['extensions'] = [{}]
    tx_str = json.dumps(proto_tx)
    result = validate_proto_transaction(tx_str)
    assert result.status == result.status.fail
    assert result.exception_message == (
        "{'code': 10, 'name': 'assert_exception', 'message': 'Assert Exception', 'stack': [{'context': {'level': 'error', 'file': 'python_managed_object.hpp', 'line': 63, 'method': 'call_python_function', 'hostname': '', 'thread_name': 'th_a'}, 'format': 'Python function call failed: ${pyerr}', 'data': {'pyerr': 'list index out of range'}}], 'extension': {'assertion_expression': '!PyErr_Occurred()'}, 'assert_hash': '3191462237188738789'}"
    )
