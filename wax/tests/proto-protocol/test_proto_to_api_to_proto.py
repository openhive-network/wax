import json

from utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import api_to_proto, proto_to_api


def test_proto_to_api_to_proto():
    proto_str = json.dumps(PROTO_REF_TRANSACTION)
    api = proto_to_api(proto_str.encode())
    assert api.status == api.status.ok
    assert api.exception_message == b''
    assert api.result.decode() == json.dumps(API_REF_TRANSACTION).replace(" ", "")

    api_str = api.result.decode()
    proto = api_to_proto(api_str.encode())
    print(proto)
    assert proto.status == proto.status.ok
    assert proto.exception_message == b''
    assert proto.result.decode() == json.dumps(PROTO_REF_TRANSACTION).replace(" ", "")
