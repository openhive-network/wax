import json
from copy import deepcopy

import pytest

from wax import validate_proto_transaction
from wax.exceptions import WaxError
from wax_local_tools.refs import PROTO_REF_TRANSACTION


def test_wrong_future_extensions():
    proto_tx = deepcopy(PROTO_REF_TRANSACTION)
    proto_tx["extensions"] = [{}]
    tx_str = json.dumps(proto_tx)
    with pytest.raises(WaxError):
        validate_proto_transaction(tx_str)
