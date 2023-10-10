import json

from utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import proto_to_api


def test_api_to_proto():
    proto_str = json.dumps(PROTO_REF_TRANSACTION)
    api = proto_to_api(proto_str.encode())
    assert api.status == api.status.ok
    assert api.exception_message == b''
    assert api.result.decode() == json.dumps(API_REF_TRANSACTION).replace(" ", "")

    # Negative test
    proto_str = json.dumps(API_REF_TRANSACTION)
    api = proto_to_api(proto_str.encode())
    assert api.status == api.status.fail
    print(api.exception_message)
    assert api.exception_message == (
        b'10 assert_exception: Assert Exception\nop.get_object()[key].is_object()'
        b'\nOperation should contain the body\n    {}\n    protobuf_protocol_impl.inl:34 parse_proto_operation')
