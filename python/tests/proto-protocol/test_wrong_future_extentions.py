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
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\n!PyErr_Occurred()\nPython function call failed: list index out of range\n    {"pyerr":"list index out of range"}\n    python_managed_object.hpp:63 call_python_function'
    )
