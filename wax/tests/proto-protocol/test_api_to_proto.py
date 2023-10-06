import json

from utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import api_to_proto


def test_api_to_proto():
    api_str = json.dumps(API_REF_TRANSACTION)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.ok
    assert proto.exception_message == b''
    assert proto.result.decode() == json.dumps(PROTO_REF_TRANSACTION).replace(" ", "")

    # Negative test
    api_str = json.dumps(PROTO_REF_TRANSACTION)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.fail
    assert proto.exception_message == (
        b'10 assert_exception: Assert Exception\nop.is_object() && '
        b'op.get_object().contains("type") && op.get_object()["type"].is_string() '
        b'&& op.get_object().contains("value") && op.get_object()["value"].is_object()'
        b'\nNot a valid api operation\n    {}\n    cpython_interface.cpp:151 parse_api_operation')
