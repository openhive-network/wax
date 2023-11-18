import json

from google.protobuf.json_format import ParseDict

from utils.refs import (
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

from wax.proto import transaction_pb2, block_pb2


def test_api_to_proto():
    api_str = json.dumps(API_REF_TRANSACTION)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.ok
    assert proto.exception_message == b''
    assert proto.result.decode() == json.dumps(PROTO_REF_TRANSACTION, separators=(',', ':'))
    transaction: transaction_pb2.transaction = ParseDict(json.loads(proto.result.decode()), transaction_pb2.transaction())

    # Negative test
    api_str = json.dumps(PROTO_REF_TRANSACTION)
    proto = api_to_proto(api_str.encode())
    assert proto.status == proto.status.fail
    assert proto.exception_message == (
        b'10 assert_exception: Assert Exception\nop.is_object() && '
        b'op.get_object().contains("type") && op.get_object()["type"].is_string() '
        b'&& op.get_object().contains("value") && op.get_object()["value"].is_object()'
        b'\nNot a valid api operation\n    {}\n    protobuf_protocol_impl.inl:382 parse_api_operation')

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
    assert proto.exception_message == (
        b'10 assert_exception: Assert Exception\n'
        b'op.is_object() && op.get_object().contains("type") && '
        b'op.get_object()["type"].is_string() && '
        b'op.get_object().contains("value") && '
        b'op.get_object()["value"].is_object()\n'
        b'Not a valid api operation\n    {}\n    protobuf_protocol_impl.inl:382 parse_api_operation'
    )
