import json
from copy import deepcopy

from tests.utils.refs import PROTO_REF_TRANSACTION
from wax import validate_proto_transaction


def test_wrong_future_extensions():
    # Arrange - create transaction with invalid empty extension
    proto_tx = deepcopy(PROTO_REF_TRANSACTION)
    proto_tx["extensions"] = [{}]
    tx_str = json.dumps(proto_tx)

    # Act
    result = validate_proto_transaction(tx_str.encode())

    # Assert - verify validation fails with expected error details
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message, "Exception should contain error code 10"
    assert b"'name': 'assert_exception'" in result.exception_message, "Exception should be of type assert_exception"
    assert b"Python function call failed" in result.exception_message, "Exception should indicate Python function call failure"
    assert b"list index out of range" in result.exception_message, "Exception should describe the index error"
