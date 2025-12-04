import json
import pytest
from copy import deepcopy

from tests.wax.utils.refs import PROTO_REF_TRANSACTION

from wax import validate_proto_transaction
from wax.exceptions.wax_specialised_errors import DetailedCxxError

def test_wrong_future_extensions():
    proto_tx = deepcopy(PROTO_REF_TRANSACTION)
    proto_tx["extensions"] = [{}]
    tx_str = json.dumps(proto_tx)
    with pytest.raises(DetailedCxxError) as excinfo:
        validate_proto_transaction(tx_str)
    assert excinfo.value.assert_hash == "3191462237188738789"
