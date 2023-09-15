"""
@generated by mypy-protobuf.  Do not edit manually!
isort:skip_file
"""
import builtins
import collections.abc
import comment_pb2
import google.protobuf.descriptor
import google.protobuf.internal.containers
import google.protobuf.message
import limit_order_cancel_pb2
import sys
import vote_pb2

if sys.version_info >= (3, 8):
    import typing as typing_extensions
else:
    import typing_extensions

DESCRIPTOR: google.protobuf.descriptor.FileDescriptor

@typing_extensions.final
class operation(google.protobuf.message.Message):
    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    COMMENT_FIELD_NUMBER: builtins.int
    VOTE_FIELD_NUMBER: builtins.int
    LIMIT_ORDER_CANCEL_FIELD_NUMBER: builtins.int
    @property
    def comment(self) -> comment_pb2.comment: ...
    @property
    def vote(self) -> vote_pb2.vote: ...
    @property
    def limit_order_cancel(self) -> limit_order_cancel_pb2.limit_order_cancel: ...
    def __init__(
        self,
        *,
        comment: comment_pb2.comment | None = ...,
        vote: vote_pb2.vote | None = ...,
        limit_order_cancel: limit_order_cancel_pb2.limit_order_cancel | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["comment", b"comment", "limit_order_cancel", b"limit_order_cancel", "value", b"value", "vote", b"vote"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["comment", b"comment", "limit_order_cancel", b"limit_order_cancel", "value", b"value", "vote", b"vote"]) -> None: ...
    def WhichOneof(self, oneof_group: typing_extensions.Literal["value", b"value"]) -> typing_extensions.Literal["comment", "vote", "limit_order_cancel"] | None: ...

global___operation = operation

@typing_extensions.final
class transaction(google.protobuf.message.Message):
    """*
    Example jsdoc
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    OPERATIONS_FIELD_NUMBER: builtins.int
    @property
    def operations(self) -> google.protobuf.internal.containers.RepeatedCompositeFieldContainer[global___operation]: ...
    def __init__(
        self,
        *,
        operations: collections.abc.Iterable[global___operation] | None = ...,
    ) -> None: ...
    def ClearField(self, field_name: typing_extensions.Literal["operations", b"operations"]) -> None: ...

global___transaction = transaction
