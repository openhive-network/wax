"""
@generated by mypy-protobuf.  Do not edit manually!
isort:skip_file
"""
import builtins
import collections.abc
import future_extensions_pb2
import google.protobuf.descriptor
import google.protobuf.internal.containers
import google.protobuf.message
import operation_pb2
import sys

if sys.version_info >= (3, 8):
    import typing as typing_extensions
else:
    import typing_extensions

DESCRIPTOR: google.protobuf.descriptor.FileDescriptor

@typing_extensions.final
class transaction(google.protobuf.message.Message):
    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    REF_BLOCK_NUM_FIELD_NUMBER: builtins.int
    REF_BLOCK_PREFIX_FIELD_NUMBER: builtins.int
    EXPIRATION_FIELD_NUMBER: builtins.int
    OPERATIONS_FIELD_NUMBER: builtins.int
    EXTENSIONS_FIELD_NUMBER: builtins.int
    SIGNATURES_FIELD_NUMBER: builtins.int
    ref_block_num: builtins.int
    ref_block_prefix: builtins.int
    expiration: builtins.str
    @property
    def operations(self) -> google.protobuf.internal.containers.RepeatedCompositeFieldContainer[operation_pb2.operation]: ...
    @property
    def extensions(self) -> google.protobuf.internal.containers.RepeatedCompositeFieldContainer[future_extensions_pb2.future_extensions]: ...
    @property
    def signatures(self) -> google.protobuf.internal.containers.RepeatedScalarFieldContainer[builtins.str]:
        """for signed_transaction"""
    def __init__(
        self,
        *,
        ref_block_num: builtins.int | None = ...,
        ref_block_prefix: builtins.int | None = ...,
        expiration: builtins.str | None = ...,
        operations: collections.abc.Iterable[operation_pb2.operation] | None = ...,
        extensions: collections.abc.Iterable[future_extensions_pb2.future_extensions] | None = ...,
        signatures: collections.abc.Iterable[builtins.str] | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["expiration", b"expiration", "ref_block_num", b"ref_block_num", "ref_block_prefix", b"ref_block_prefix"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["expiration", b"expiration", "extensions", b"extensions", "operations", b"operations", "ref_block_num", b"ref_block_num", "ref_block_prefix", b"ref_block_prefix", "signatures", b"signatures"]) -> None: ...

global___transaction = transaction
