import json

from wax_local_tools.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import api_to_proto, proto_to_api


def test_api_to_proto_to_api():
    api_str = json.dumps(API_REF_TRANSACTION)
    proto = api_to_proto(api_str)
    assert proto.status == proto.status.ok
    assert proto.exception_message == ''
    assert proto.result == json.dumps(PROTO_REF_TRANSACTION)

    proto_str = proto.result
    api = proto_to_api(proto_str)
    assert api.status == api.status.ok
    assert api.exception_message == ''
    assert api.result == json.dumps(API_REF_TRANSACTION)
