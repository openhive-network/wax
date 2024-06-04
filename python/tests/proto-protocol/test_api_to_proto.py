import json
import pytest

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

from wax.proto import transaction_pb2

@pytest.mark.skip(reason="block.proto definition is ignored")
def test_api_to_proto():
    # moved here since code generation for block.proto is skipped
    from wax.proto import block_pb2

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
        b'10 assert_exception: Assert Exception\nop.is_object() && op.get_object().'
        b'contains("type") && op.get_object()["type"].is_string() && op.get_object().c'
        b'ontains("value") && op.get_object()["value"].is_object()\nNot a valid api'
        b' operation (unformatted args: ("op",{"vote":{"voter":"taoteh1221","author":"'
        b'ozchartart","permlink":"usdsteem-btc-daily-poloniex-bittrex-technical-analys'
        b'is-market-report-update-46-glass-half-full-but-the-bottle-s-left-empty-sept"'
        b',"weight":10000}}))\n    {"op":{"vote":{"voter":"taoteh1221","author":"oz'
        b'chartart","permlink":"usdsteem-btc-daily-poloniex-bittrex-technical-analysis'
        b'-market-report-update-46-glass-half-full-but-the-bottle-s-left-empty-sept","'
        b'weight":10000}}}\n    protobuf_protocol_impl.inl:382 parse_api_operation'
    )

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
        b'10 assert_exception: Assert Exception\nop.is_object() && op.get_object().'
        b'contains("type") && op.get_object()["type"].is_string() && op.get_object().c'
        b'ontains("value") && op.get_object()["value"].is_object()\nNot a valid api'
        b' operation (unformatted args: ("op",{"block_id":"000f4240e8f91385f7bff8f5aee'
        b'bddc9b14e4281","extensions":[],"previous":"000f423f974857674873d93d1909e0eeb'
        b'7e4916e","signing_key":"STM67P2LhV4FCvk2y6sQjNTnp6b1MVTKnftw2mLE2Vxf89Vdn7xY'
        b'G","timestamp":"2016-04-29T04:12:00","transaction_ids":[],"transaction_merkl'
        b'e_root":"0000000000000000000000000000000000000000","witness":"abit","witness'
        b'_signature":"1f72bd3f4b06e7dc6b156729f0fd7873163814972eecea9d77cb29bae11d0fe'
        b'a3865c814d11a58e818c2494ce19f4c3d4c3e17eab3b1465ebccb102c52c56472c0"}))\n'
        b'    {"op":{"block_id":"000f4240e8f91385f7bff8f5aeebddc9b14e4281","extensions'
        b'":[],"previous":"000f423f974857674873d93d1909e0eeb7e4916e","signing_key":"ST'
        b'M67P2LhV4FCvk2y6sQjNTnp6b1MVTKnftw2mLE2Vxf89Vdn7xYG","timestamp":"2016-04-29'
        b'T04:12:00","transaction_ids":[],"transaction_merkle_root":"00000000000000000'
        b'00000000000000000000000","witness":"abit","witness_signature":"1f72bd3f4b06e'
        b'7dc6b156729f0fd7873163814972eecea9d77cb29bae11d0fea3865c814d11a58e818c2494ce'
        b'19f4c3d4c3e17eab3b1465ebccb102c52c56472c0"}}\n    protobuf_protocol_impl.'
        b'inl:382 parse_api_operation'
    )
