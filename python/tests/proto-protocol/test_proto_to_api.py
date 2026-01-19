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
    # Check key parts of the error message without depending on exact line numbers which can change
    assert b"'code': 10" in api.exception_message
    assert b"'name': 'assert_exception'" in api.exception_message
    assert b"'file': 'api_converter.hpp'" in api.exception_message
    assert b"Could not find the supported property in static variant" in api.exception_message
    assert b"'nextkey': 'type'" in api.exception_message
