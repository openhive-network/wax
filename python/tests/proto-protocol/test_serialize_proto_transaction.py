import json

from google.protobuf.json_format import ParseDict

from tests.utils.refs import PROTO_REF_TRANSACTION, API_REF_TRANSACTION

from wax import serialize_proto_transaction, deserialize_proto_transaction

from wax.proto.transaction import transaction


def test_serialize_proto_transaction_positive():
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    result = serialize_proto_transaction(tx_str.encode())
    assert result.status == result.status.ok, "Proto transaction serialization should succeed"
    assert result.exception_message == b'', "No exception expected for valid proto transaction"
    assert result.result == (
        b'3c4b51ee947fd5fada5701000a74616f746568313232310a6f7a63686172746172747f757364'
        b'737465656d2d6274632d6461696c792d706f6c6f6e6965782d626974747265782d746563686e'
        b'6963616c2d616e616c797369732d6d61726b65742d7265706f72742d7570646174652d34362d'
        b'676c6173732d68616c662d66756c6c2d6275742d7468652d626f74746c652d732d6c6566742d'
        b'656d7074792d736570741027010001202bd7ff67ba97db6b5fecb389ca279e0c98db9a49fd9f'
        b'49acea63ea523ed35ac602933e9bbb0916b6ee137b5550cbe1ae4594c52a27d1505b1adb53f8'
        b'b37d3fb3'
        ), "Serialized transaction should match expected hex value"


def test_deserialize_proto_transaction_positive():
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    serialized = (
        b'3c4b51ee947fd5fada5701000a74616f746568313232310a6f7a63686172746172747f757364'
        b'737465656d2d6274632d6461696c792d706f6c6f6e6965782d626974747265782d746563686e'
        b'6963616c2d616e616c797369732d6d61726b65742d7265706f72742d7570646174652d34362d'
        b'676c6173732d68616c662d66756c6c2d6275742d7468652d626f74746c652d732d6c6566742d'
        b'656d7074792d736570741027010001202bd7ff67ba97db6b5fecb389ca279e0c98db9a49fd9f'
        b'49acea63ea523ed35ac602933e9bbb0916b6ee137b5550cbe1ae4594c52a27d1505b1adb53f8'
        b'b37d3fb3'
    )
    result = deserialize_proto_transaction(serialized)
    assert result.status == result.status.ok, "Proto transaction deserialization should succeed"
    assert result.exception_message == b'', "No exception expected for deserialization"
    assert result.result.decode() == tx_str, "Deserialized transaction should match original"

    tx_ref = ParseDict(PROTO_REF_TRANSACTION, transaction())
    tx = ParseDict(json.loads(result.result.decode()), transaction())
    assert tx_ref == tx, "Parsed protobuf transactions should be equal"


def test_serialize_proto_transaction_negative():
    tx_str = json.dumps(API_REF_TRANSACTION)
    result = serialize_proto_transaction(tx_str.encode())
    assert result.status == result.status.fail, "API format transaction should fail proto serialization"
    assert b"'code': 10" in result.exception_message, "Error should contain assert_exception code"
    assert b"'name': 'assert_exception'" in result.exception_message, "Error should be assert_exception type"
    assert b"Could not find the supported property in static variant" in result.exception_message, "Error should indicate format mismatch"
    assert b"'nextkey': 'type'" in result.exception_message, "Error should reference missing type field"
