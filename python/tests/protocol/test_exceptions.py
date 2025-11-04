import pytest

import wax
from wax.exceptions.wax_specialised_errors import WaxBaseAssertionError, WaxProtocolAssertionError

PROTO_EXCEPTION_GROUP: list[type[WaxBaseAssertionError]] = [
    WaxBaseAssertionError,
    WaxProtocolAssertionError
]

@pytest.mark.parametrize("exception_cls", PROTO_EXCEPTION_GROUP)
def test_protocol_validation_error(exception_cls: type[WaxBaseAssertionError]) -> None:
    # ARRANGE
    invalid_op = b"""{
        "type": "transfer_operation",
        "value": {
            "from": "in",
            "to": "alpha",
            "amount": {
                "nai": "@@000000021",
                "precision": 3,
                "amount": "10"
            },
            "memo": "test"
        }
    }""" # invalid 'from' account name

    # ACT & ASSERT
    with pytest.raises(exception_cls):
        wax.validate_operation(invalid_op)


@pytest.mark.parametrize("exception_cls", PROTO_EXCEPTION_GROUP)
def test_protocol_operation_error(exception_cls: type[WaxBaseAssertionError]) -> None:
    # ARRANGE
    invalid_op = b"""{
        "type": "transfer_operation",
        "value": {
            "from": "initminer",
            "to": "alpha",
            "amount": {
                "nai": "@@999999999",
                "precision": 3,
                "amount": "10"
            },
            "memo": "test"
        }
    }""" # transfering unknown asset

    # ACT & ASSERT
    with pytest.raises(exception_cls) as ex:
        wax.validate_operation(invalid_op)

    print(ex)
    


@pytest.mark.parametrize("exception_cls", PROTO_EXCEPTION_GROUP)
def test_protocol_asset_error(exception_cls: type[WaxBaseAssertionError]) -> None:
    # ARRANGE
    invalid_op = b"""{
        "type": "transfer_operation",
        "value": {
            "from": "initminer",
            "to": "alpha",
            "amount": {
                "nai": "@@000000021",
                "precision": 6,
                "amount": "10"
            },
            "memo": "test"
        }
    }""" # invalid asset precision

    # ACT & ASSERT
    with pytest.raises(exception_cls):
        wax.validate_operation(invalid_op)
