import json
import pytest

from google.protobuf.json_format import ParseDict

from tests.utils.refs import (
    API_REF_TRANSACTION,
    PROTO_REF_TRANSACTION,
    API_REF_RELEASE_BLOCK,
    API_REF_HF_BLOCK,
    API_REF_BLOCK_EMPTY_TRANSACTIONS,
    API_REF_BLOCK_NO_TRANSACTIONS,
    PROTO_REF_RELEASE_BLOCK,
    PROTO_REF_HF_BLOCK,
    PROTO_REF_BLOCK_EMPTY_TRANSACTION,
)

from wax import api_to_proto

from wax.proto.transaction import transaction


@pytest.mark.skip(reason="block.proto definition is ignored")
def test_api_to_proto():
    # moved here since code generation for block.proto is skipped
    from wax._private.proto import block_pb2  # type: ignore[attr-defined, unused-ignore]

    api_str = json.dumps(API_REF_TRANSACTION)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.ok, "API to proto conversion should succeed"
    assert proto.exception_message == b"", "No exception expected for valid API transaction"
    assert proto.result.decode() == json.dumps(PROTO_REF_TRANSACTION, separators=(",", ":")), (
        "Converted proto should match reference"
    )
    transaction_proto: transaction = ParseDict(json.loads(proto.result.decode()), transaction())

    # Negative test - proto format input should fail for api_to_proto
    api_str = json.dumps(PROTO_REF_TRANSACTION)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.fail, "Proto format input should fail for api_to_proto"
    assert b"assert_exception" in proto.exception_message, "Error should be assert_exception type"
    assert b"Not a valid api operation" in proto.exception_message, "Error should indicate invalid API operation"
    assert b"vote" in proto.exception_message, "Error should reference vote operation"

    api_str = json.dumps(API_REF_RELEASE_BLOCK)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.ok, "Release block conversion should succeed"
    assert proto.exception_message == b"", "No exception expected for release block"
    assert proto.result.decode() == json.dumps(PROTO_REF_RELEASE_BLOCK, separators=(",", ":")), (
        "Converted release block should match reference"
    )
    block: block_pb2.block = ParseDict(json.loads(proto.result.decode()), block_pb2.block())

    api_str = json.dumps(API_REF_HF_BLOCK)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.ok, "HF block conversion should succeed"
    assert proto.exception_message == b"", "No exception expected for HF block"
    assert proto.result.decode() == json.dumps(PROTO_REF_HF_BLOCK, separators=(",", ":")), (
        "Converted HF block should match reference"
    )
    block = ParseDict(json.loads(proto.result.decode()), block_pb2.block())

    api_str = json.dumps(API_REF_BLOCK_EMPTY_TRANSACTIONS)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.ok, "Block with empty transactions conversion should succeed"
    assert proto.exception_message == b"", "No exception expected for block with empty transactions"
    assert proto.result.decode() == json.dumps(PROTO_REF_BLOCK_EMPTY_TRANSACTION, separators=(",", ":")), (
        "Converted block should match reference"
    )
    block = ParseDict(json.loads(proto.result.decode()), block_pb2.block())

    # Negative test - block without transactions field should fail
    api_str = json.dumps(API_REF_BLOCK_NO_TRANSACTIONS)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.fail, "Block without transactions field should fail"
    assert b"assert_exception" in proto.exception_message, "Error should be assert_exception type"
    assert b"Not a valid api operation" in proto.exception_message, "Error should indicate invalid API operation"
    assert b"block_id" in proto.exception_message, "Error should reference block_id field"
