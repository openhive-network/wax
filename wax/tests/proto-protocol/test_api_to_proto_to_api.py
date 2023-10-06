import json

from utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import api_to_proto, proto_to_api


def test_api_to_proto_to_api():
    api_str = json.dumps(API_REF_TRANSACTION)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.ok
    assert proto.exception_message == b''
    assert proto.result.decode() == json.dumps(PROTO_REF_TRANSACTION).replace(" ", "")

    proto_str = proto.result.decode()
    api = proto_to_api(proto_str.encode())
    assert api.status == api.status.ok
    assert api.exception_message == b''
    assert api.result.decode() == json.dumps(API_REF_TRANSACTION).replace(" ", "")
