import json

from google.protobuf.json_format import ParseDict

from tests.utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION
from wax import deserialize_proto_transaction, serialize_proto_transaction
from wax.proto.transaction import transaction


def test_serialize_proto_transaction_positive_with_valid_proto_transaction():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act
    result = serialize_proto_transaction(tx_str.encode())

    # Assert
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == (
        b'3c4b51ee947fd5fada5701000a74616f746568313232310a6f7a63686172746172747f757364'
        b'737465656d2d6274632d6461696c792d706f6c6f6e6965782d626974747265782d746563686e'
        b'6963616c2d616e616c797369732d6d61726b65742d7265706f72742d7570646174652d34362d'
        b'676c6173732d68616c662d66756c6c2d6275742d7468652d626f74746c652d732d6c6566742d'
        b'656d7074792d736570741027010001202bd7ff67ba97db6b5fecb389ca279e0c98db9a49fd9f'
        b'49acea63ea523ed35ac602933e9bbb0916b6ee137b5550cbe1ae4594c52a27d1505b1adb53f8'
        b'b37d3fb3'
    )


def test_deserialize_proto_transaction_positive_after_serialization():
    # Arrange
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    serialize_result = serialize_proto_transaction(tx_str.encode())

    # Act
    result = deserialize_proto_transaction(serialize_result.result)

    # Assert
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result.decode() == tx_str

    tx_ref = ParseDict(PROTO_REF_TRANSACTION, transaction())
    tx = ParseDict(json.loads(result.result.decode()), transaction())
    assert tx_ref == tx


def test_serialize_proto_transaction_negative_with_api_format_instead_of_proto():
    # Arrange
    tx_str = json.dumps(API_REF_TRANSACTION)

    # Act
    result = serialize_proto_transaction(tx_str.encode())

    # Assert
    assert result.status == result.status.fail
    assert b"'code': 10" in result.exception_message, "Exception should contain error code 10"
    assert b"'name': 'assert_exception'" in result.exception_message, "Exception should be of type assert_exception"
    assert b"Could not find the supported property in static variant" in result.exception_message, "Exception should describe the property lookup failure"
