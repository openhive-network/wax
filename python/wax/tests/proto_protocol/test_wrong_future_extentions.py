import json
from copy import deepcopy

from tests.wax.utils.refs import PROTO_REF_TRANSACTION

from wax import validate_proto_transaction


def test_wrong_future_extensions():
    proto_tx = deepcopy(PROTO_REF_TRANSACTION)
    proto_tx["extensions"] = [{}]
    tx_str = json.dumps(proto_tx)
    result = validate_proto_transaction(tx_str)
    assert result.status == result.status.fail
    assert "'code': 10" in result.exception_message
    assert "'name': 'assert_exception'" in result.exception_message
    assert "Python function call failed" in result.exception_message
    assert "list index out of range" in result.exception_message
