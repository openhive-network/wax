import json

from utils.refs import PROTO_REF_TRANSACTION, API_REF_TRANSACTION

from wax import serialize_proto_transaction

def test_serialize_proto_transaction():
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    result = serialize_proto_transaction(tx_str.encode())
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == (
        b'3c4b51ee947fd5fada5701000a74616f746568313232310a6f7a63686172746172747f757364'
        b'737465656d2d6274632d6461696c792d706f6c6f6e6965782d626974747265782d746563686e'
        b'6963616c2d616e616c797369732d6d61726b65742d7265706f72742d7570646174652d34362d'
        b'676c6173732d68616c662d66756c6c2d6275742d7468652d626f74746c652d732d6c6566742d'
        b'656d7074792d7365707410270100'
        ) 

    # Negative test
    tx_str = json.dumps(API_REF_TRANSACTION)
    result = serialize_proto_transaction(tx_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\nop.get_object()[key].is_object()'
        b'\nOperation should contain the body\n    {}\n    protobuf_protocol_impl.inl:49 parse_proto_operation')
