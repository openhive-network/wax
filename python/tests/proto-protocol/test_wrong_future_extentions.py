import json
from copy import deepcopy

from tests.utils.refs import PROTO_REF_TRANSACTION

from wax import validate_proto_transaction

def test_wrong_future_extensions():
    proto_tx = deepcopy(PROTO_REF_TRANSACTION)
    proto_tx['extensions'] = [{}]
    tx_str = json.dumps(proto_tx)
    result = validate_proto_transaction(tx_str.encode())
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message
    assert b"'name': 'assert_exception'" in result.exception_message
    assert b"Python function call failed" in result.exception_message
    assert b"list index out of range" in result.exception_message
