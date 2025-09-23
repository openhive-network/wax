import json

from tests.utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import proto_to_api


def test_proto_to_api():
    proto_str = json.dumps(PROTO_REF_TRANSACTION)
    api = proto_to_api(proto_str)
    assert api.status == api.status.ok
    assert api.exception_message == b''
    assert api.result.decode() == json.dumps(API_REF_TRANSACTION)

    # Negative test
    proto_str = json.dumps(API_REF_TRANSACTION)
    api = proto_to_api(proto_str)
    assert api.status == api.status.fail
    print(api.exception_message)
    assert api.exception_message == (
        b"{'code': 10, 'name': 'assert_exception', 'message': 'Assert Exception', 'stack': [{'context': {'level': 'error', 'file': 'api_converter.hpp', 'line': 180, 'method': 'call', 'hostname': '', 'thread_name': 'th_a'}, 'format': 'Could not find the supported property in static variant: ${nextkey}', 'data': {'nextkey': 'type'}}], 'extension': {'assertion_expression': 'it != to_tag.end()'}, 'assert_hash': '10056067403021329111'}")
