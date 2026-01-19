import ast
import json

from tests.utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import proto_to_api


def test_proto_to_api() -> None:
    proto_str = json.dumps(PROTO_REF_TRANSACTION)
    api = proto_to_api(proto_str.encode())
    assert api.status == api.status.ok
    assert api.exception_message == b''
    assert api.result.decode() == json.dumps(API_REF_TRANSACTION)

    # Negative test
    proto_str = json.dumps(API_REF_TRANSACTION)
    api = proto_to_api(proto_str.encode())
    assert api.status == api.status.fail

    # Parse the exception message and verify key fields (line numbers may change)
    exception_data = ast.literal_eval(api.exception_message.decode())

    assert exception_data["code"] == 10
    assert exception_data["name"] == "assert_exception"
    assert exception_data["message"] == "Assert Exception"

    stack_context = exception_data["stack"][0]["context"]
    assert stack_context["file"] == "api_converter.hpp"
    assert stack_context["method"] == "call"

    stack_entry = exception_data["stack"][0]
    assert stack_entry["format"] == "Could not find the supported property in static variant: ${nextkey}"
    assert stack_entry["data"]["nextkey"] == "type"
