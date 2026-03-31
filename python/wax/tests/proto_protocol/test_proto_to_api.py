import json

import pytest

from wax import proto_to_api
from wax.exceptions import WaxError
from wax_local_tools.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION


def test_proto_to_api_positive():
    # Arrange
    proto_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act
    api = proto_to_api(proto_str)

    # Assert
    assert api.status == api.status.ok, "Proto to API conversion should succeed"
    assert api.exception_message == '', "No exception expected for valid proto transaction"
    assert api.result == json.dumps(API_REF_TRANSACTION), "Converted API transaction should match reference"


def test_proto_to_api_negative():
    # Arrange
    proto_str = json.dumps(API_REF_TRANSACTION)

    # Act & Assert
    with pytest.raises(WaxError, match="Could not find the supported property in static variant"):
        proto_to_api(proto_str)
