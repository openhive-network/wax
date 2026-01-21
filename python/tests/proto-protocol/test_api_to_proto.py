import json

import pytest
from google.protobuf.json_format import ParseDict

from tests.utils.refs import (
    API_REF_BLOCK_EMPTY_TRANSACTIONS,
    API_REF_BLOCK_NO_TRANSACTIONS,
    API_REF_HF_BLOCK,
    API_REF_RELEASE_BLOCK,
    API_REF_TRANSACTION,
    PROTO_REF_BLOCK_EMPTY_TRANSACTION,
    PROTO_REF_HF_BLOCK,
    PROTO_REF_RELEASE_BLOCK,
    PROTO_REF_TRANSACTION,
)
from wax import api_to_proto
from wax.proto.transaction import transaction


@pytest.mark.skip(reason="block.proto definition is ignored")
def test_api_to_proto_positive_with_valid_api_transaction():
    # Arrange
    # moved here since code generation for block.proto is skipped

    api_str = json.dumps(API_REF_TRANSACTION)

    # Act
    proto = api_to_proto(api_str.encode())

    # Assert
    assert proto.status == proto.status.ok
    assert proto.exception_message == b''
    assert proto.result.decode() == json.dumps(PROTO_REF_TRANSACTION, separators=(',', ':'))
    transaction_proto: transaction = ParseDict(json.loads(proto.result.decode()), transaction())


@pytest.mark.skip(reason="block.proto definition is ignored")
def test_api_to_proto_negative_with_proto_format_instead_of_api():
    # Arrange
    api_str = json.dumps(PROTO_REF_TRANSACTION)

    # Act
    proto = api_to_proto(api_str.encode())

    # Assert
    assert proto.status == proto.status.fail
    assert b"10 assert_exception" in proto.exception_message, "Exception should contain error code 10 with assert_exception type"
    assert b"Assert Exception" in proto.exception_message, "Exception should contain 'Assert Exception' message"
    assert b"Not a valid api operation" in proto.exception_message, "Exception should indicate invalid api operation"


@pytest.mark.skip(reason="block.proto definition is ignored")
def test_api_to_proto_positive_with_release_block():
    # Arrange
    # moved here since code generation for block.proto is skipped
    from wax._private.proto import block_pb2

    api_str = json.dumps(API_REF_RELEASE_BLOCK)

    # Act
    proto = api_to_proto(api_str.encode())

    # Assert
    assert proto.status == proto.status.ok
    assert proto.exception_message == b''
    assert proto.result.decode() == json.dumps(PROTO_REF_RELEASE_BLOCK, separators=(',', ':'))
    block: block_pb2.block = ParseDict(json.loads(proto.result.decode()), block_pb2.block())


@pytest.mark.skip(reason="block.proto definition is ignored")
def test_api_to_proto_positive_with_hf_block():
    # Arrange
    # moved here since code generation for block.proto is skipped
    from wax._private.proto import block_pb2

    api_str = json.dumps(API_REF_HF_BLOCK)

    # Act
    proto = api_to_proto(api_str.encode())

    # Assert
    assert proto.status == proto.status.ok
    assert proto.exception_message == b''
    assert proto.result.decode() == json.dumps(PROTO_REF_HF_BLOCK, separators=(',', ':'))
    block: block_pb2.block = ParseDict(json.loads(proto.result.decode()), block_pb2.block())


@pytest.mark.skip(reason="block.proto definition is ignored")
def test_api_to_proto_positive_with_block_empty_transactions():
    # Arrange
    # moved here since code generation for block.proto is skipped
    from wax._private.proto import block_pb2

    api_str = json.dumps(API_REF_BLOCK_EMPTY_TRANSACTIONS)

    # Act
    proto = api_to_proto(api_str.encode())

    # Assert
    assert proto.status == proto.status.ok
    assert proto.exception_message == b''
    assert proto.result.decode() == json.dumps(PROTO_REF_BLOCK_EMPTY_TRANSACTION, separators=(',', ':'))
    block: block_pb2.block = ParseDict(json.loads(proto.result.decode()), block_pb2.block())


@pytest.mark.skip(reason="block.proto definition is ignored")
def test_api_to_proto_negative_with_block_no_transactions():
    # Arrange
    api_str = json.dumps(API_REF_BLOCK_NO_TRANSACTIONS)

    # Act
    proto = api_to_proto(api_str.encode())

    # Assert
    assert proto.status == proto.status.fail
    assert b"10 assert_exception" in proto.exception_message, "Exception should contain error code 10 with assert_exception type"
    assert b"Assert Exception" in proto.exception_message, "Exception should contain 'Assert Exception' message"
    assert b"Not a valid api operation" in proto.exception_message, "Exception should indicate invalid api operation"
