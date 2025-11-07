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
    proto = api_to_proto(api_str)
    assert proto.status == proto.status.ok
    assert proto.exception_message == ''
    assert proto.result == json.dumps(PROTO_REF_TRANSACTION, separators=(',', ':'))
    transaction_proto: transaction = ParseDict(json.loads(proto.result), transaction())

    # Negative test
    api_str = json.dumps(PROTO_REF_TRANSACTION)
    proto = api_to_proto(api_str)
    assert proto.status == proto.status.fail
    assert proto.exception_message == (
        '10 assert_exception: Assert Exception\nop.is_object() && op.get_object().'
        'contains("type") && op.get_object()["type"].is_string() && op.get_object().c'
        'ontains("value") && op.get_object()["value"].is_object()\nNot a valid api'
        ' operation (unformatted args: ("op",{"vote":{"voter":"taoteh1221","author":"'
        'ozchartart","permlink":"usdsteem-btc-daily-poloniex-bittrex-technical-analys'
        'is-market-report-update-46-glass-half-full-but-the-bottle-s-left-empty-sept"'
        ',"weight":10000}}))\n    {"op":{"vote":{"voter":"taoteh1221","author":"oz'
        'chartart","permlink":"usdsteem-btc-daily-poloniex-bittrex-technical-analysis'
        '-market-report-update-46-glass-half-full-but-the-bottle-s-left-empty-sept","'
        'weight":10000}}}\n    protobuf_protocol_impl.inl:379 parse_api_operation'
    )

    api_str = json.dumps(API_REF_RELEASE_BLOCK)
    proto = api_to_proto(api_str)
    assert proto.status == proto.status.ok
    assert proto.exception_message == ''
    assert proto.result == json.dumps(PROTO_REF_RELEASE_BLOCK, separators=(',', ':'))
    block: block_pb2.block = ParseDict(json.loads(proto.result), block_pb2.block())

    api_str = json.dumps(API_REF_HF_BLOCK)
    proto = api_to_proto(api_str)
    assert proto.status == proto.status.ok
    assert proto.exception_message == ''
    assert proto.result == json.dumps(PROTO_REF_HF_BLOCK, separators=(',', ':'))
    block: block_pb2.block = ParseDict(json.loads(proto.result), block_pb2.block())

    api_str = json.dumps(API_REF_BLOCK_EMPTY_TRANSACTIONS)
    proto = api_to_proto(api_str)
    assert proto.status == proto.status.ok
    assert proto.exception_message == ''
    assert proto.result == json.dumps(PROTO_REF_BLOCK_EMPTY_TRANSACTION, separators=(',', ':'))
    block: block_pb2.block = ParseDict(json.loads(proto.result), block_pb2.block())

    # Negative test
    api_str = json.dumps(API_REF_BLOCK_NO_TRANSACTIONS)
    proto = api_to_proto(api_str)
    assert proto.status == proto.status.fail
    assert proto.exception_message == (
        '10 assert_exception: Assert Exception\nop.is_object() && op.get_object().'
        'contains("type") && op.get_object()["type"].is_string() && op.get_object().c'
        'ontains("value") && op.get_object()["value"].is_object()\nNot a valid api'
        ' operation (unformatted args: ("op",{"block_id":"000f4240e8f91385f7bff8f5aee'
        'bddc9b14e4281","extensions":[],"previous":"000f423f974857674873d93d1909e0eeb'
        '7e4916e","signing_key":"STM67P2LhV4FCvk2y6sQjNTnp6b1MVTKnftw2mLE2Vxf89Vdn7xY'
        'G","timestamp":"2016-04-29T04:12:00","transaction_ids":[],"transaction_merkl'
        'e_root":"0000000000000000000000000000000000000000","witness":"abit","witness'
        '_signature":"1f72bd3f4b06e7dc6b156729f0fd7873163814972eecea9d77cb29bae11d0fe'
        'a3865c814d11a58e818c2494ce19f4c3d4c3e17eab3b1465ebccb102c52c56472c0"}))\n'
        '    {"op":{"block_id":"000f4240e8f91385f7bff8f5aeebddc9b14e4281","extensions'
        '":[],"previous":"000f423f974857674873d93d1909e0eeb7e4916e","signing_key":"ST'
        'M67P2LhV4FCvk2y6sQjNTnp6b1MVTKnftw2mLE2Vxf89Vdn7xYG","timestamp":"2016-04-29'
        'T04:12:00","transaction_ids":[],"transaction_merkle_root":"00000000000000000'
        '00000000000000000000000","witness":"abit","witness_signature":"1f72bd3f4b06e'
        '7dc6b156729f0fd7873163814972eecea9d77cb29bae11d0fea3865c814d11a58e818c2494ce'
        '19f4c3d4c3e17eab3b1465ebccb102c52c56472c0"}}\n    protobuf_protocol_impl.'
        'inl:382 parse_api_operation'
    )
