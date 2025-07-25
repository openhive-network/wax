import json

from tests.utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import proto_to_api


def test_proto_to_api():
    proto_str = json.dumps(PROTO_REF_TRANSACTION)
    api = proto_to_api(proto_str.encode())
    assert api.status == api.status.ok
    assert api.exception_message == b''
    assert api.result.decode() == json.dumps(API_REF_TRANSACTION)

    # Negative test
    proto_str = json.dumps(API_REF_TRANSACTION)
    api = proto_to_api(proto_str.encode())
    assert api.status == api.status.fail
    print(api.exception_message)
    assert api.exception_message == (
        b'10 assert_exception: Assert Exception\nit != to_tag.end()\nCould not find the supported property in static variant: type\n    {"nextkey":"type"}\n    api_converter.hpp:180 call')
