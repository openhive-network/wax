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
    PROTO_REF_BLOCK_EMPTY_TRANSACTION
)

from wax import api_to_proto

from wax.proto.transaction import transaction

@pytest.mark.skip(reason="block.proto definition is ignored")
def test_api_to_proto():
    # moved here since code generation for block.proto is skipped
    from wax._private.proto import block_pb2

    api_str = json.dumps(API_REF_TRANSACTION)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.ok
    assert proto.exception_message == b''
    assert proto.result.decode() == json.dumps(PROTO_REF_TRANSACTION, separators=(',', ':'))
    transaction_proto: transaction = ParseDict(json.loads(proto.result.decode()), transaction())

    # Negative test
    api_str = json.dumps(PROTO_REF_TRANSACTION)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.fail
    assert b"assert_exception" in proto.exception_message
    assert b"Not a valid api operation" in proto.exception_message
    assert b"vote" in proto.exception_message

    api_str = json.dumps(API_REF_RELEASE_BLOCK)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.ok
    assert proto.exception_message == b''
    assert proto.result.decode() == json.dumps(PROTO_REF_RELEASE_BLOCK, separators=(',', ':'))
    block: block_pb2.block = ParseDict(json.loads(proto.result.decode()), block_pb2.block())

    api_str = json.dumps(API_REF_HF_BLOCK)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.ok
    assert proto.exception_message == b''
    assert proto.result.decode() == json.dumps(PROTO_REF_HF_BLOCK, separators=(',', ':'))
    block: block_pb2.block = ParseDict(json.loads(proto.result.decode()), block_pb2.block())

    api_str = json.dumps(API_REF_BLOCK_EMPTY_TRANSACTIONS)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.ok
    assert proto.exception_message == b''
    assert proto.result.decode() == json.dumps(PROTO_REF_BLOCK_EMPTY_TRANSACTION, separators=(',', ':'))
    block: block_pb2.block = ParseDict(json.loads(proto.result.decode()), block_pb2.block())

    # Negative test
    api_str = json.dumps(API_REF_BLOCK_NO_TRANSACTIONS)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.fail
    assert b"assert_exception" in proto.exception_message
    assert b"Not a valid api operation" in proto.exception_message
    assert b"block_id" in proto.exception_message
