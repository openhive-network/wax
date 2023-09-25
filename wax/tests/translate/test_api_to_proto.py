import json

from utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import api_to_proto


def test_api_to_proto():
    api_str = json.dumps(API_REF_TRANSACTION)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.ok
    assert proto.result.decode() == json.dumps(PROTO_REF_TRANSACTION).replace(" ", "")
