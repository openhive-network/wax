import json
import pytest

from wax.exceptions.wax_specialised_errors import DetailedCxxError
from tests.wax.utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import serialize_transaction, deserialize_transaction


def test_serialize_transaction_positive():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION)

    # Act
    result = serialize_transaction(tx_str)

    # Assert
    assert result.status == result.status.ok, "API transaction serialization should succeed"
    assert result.exception_message == '', "No exception expected for valid API transaction"
    assert result.result == (
        '3c4b51ee947fd5fada5701000a74616f746568313232310a6f7a63686172746172747f757364'
        '737465656d2d6274632d6461696c792d706f6c6f6e6965782d626974747265782d746563686e'
        '6963616c2d616e616c797369732d6d61726b65742d7265706f72742d7570646174652d34362d'
        '676c6173732d68616c662d66756c6c2d6275742d7468652d626f74746c652d732d6c6566742d'
        '656d7074792d736570741027010001202bd7ff67ba97db6b5fecb389ca279e0c98db9a49fd9f'
        '49acea63ea523ed35ac602933e9bbb0916b6ee137b5550cbe1ae4594c52a27d1505b1adb53f8'
        'b37d3fb3'
        ), "Serialized transaction should match expected hex value"


def test_deserialize_transaction_positive():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION)
    serialized = (
        '3c4b51ee947fd5fada5701000a74616f746568313232310a6f7a63686172746172747f757364'
        '737465656d2d6274632d6461696c792d706f6c6f6e6965782d626974747265782d746563686e'
        '6963616c2d616e616c797369732d6d61726b65742d7265706f72742d7570646174652d34362d'
        '676c6173732d68616c662d66756c6c2d6275742d7468652d626f74746c652d732d6c6566742d'
        '656d7074792d736570741027010001202bd7ff67ba97db6b5fecb389ca279e0c98db9a49fd9f'
        '49acea63ea523ed35ac602933e9bbb0916b6ee137b5550cbe1ae4594c52a27d1505b1adb53f8'
        'b37d3fb3'
    )

    # Act
    result = deserialize_transaction(serialized)

    # Assert
    assert result.status == result.status.ok, "API transaction deserialization should succeed"
    assert result.exception_message == '', "No exception expected for deserialization"
    assert result.result == tx_str.replace(" ", "").replace("\n",""), "Deserialized transaction should match original (without whitespace)"


def test_serialize_transaction_negative():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act & Assert
    with pytest.raises(DetailedCxxError) as error:
        serialize_transaction(tx_str)
    assert error.value.assert_hash == "3191462237188738789"
