import json

from utils.refs import PROTO_REF_TRANSACTION, API_REF_TRANSACTION

from wax import calculate_proto_transaction_id

def test_calculate_proto_transaction_id():
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    result = calculate_proto_transaction_id(tx_str.encode())
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == b'4491c7a6362e71cca31e256f69af503e0abc5d3d'

    # Negative test
    tx_str = json.dumps(API_REF_TRANSACTION)
    result = calculate_proto_transaction_id(tx_str.encode())
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\nop.get_object()[key].is_object()'
        b'\nOperation should contain the body\n    {}\n    protobuf_protocol_impl.inl:34 parse_proto_operation')
