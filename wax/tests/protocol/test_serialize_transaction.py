import json

from utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import serialize_transaction, deserialize_transaction

def test_serialize_transaction():
    tx_str = json.dumps(API_REF_TRANSACTION)
    result = serialize_transaction(tx_str.encode())
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

    result = deserialize_transaction(result.result)
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result.decode() == tx_str.replace(" ", "").replace("\n","")
    
    # Negative test
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    result = serialize_transaction(tx_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\nv_object.contains( "type" )\nType field doesn\'t exist.\n    {}\n    static_variant.hpp:488 from_variant')
