"""
@generated by mypy-protobuf.  Do not edit manually!
isort:skip_file
"""
import asset_pb2
import authority_pb2
import builtins
import collections.abc
import future_extensions_pb2
import google.protobuf.descriptor
import google.protobuf.internal.containers
import google.protobuf.message
import sys

if sys.version_info >= (3, 8):
    import typing as typing_extensions
else:
    import typing_extensions

DESCRIPTOR: google.protobuf.descriptor.FileDescriptor

@typing_extensions.final
class account_create_with_delegation(google.protobuf.message.Message):
    """Deprecated.

    Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/41_account_create_with_delegation.md?ref_type=heads
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    FEE_FIELD_NUMBER: builtins.int
    DELEGATION_FIELD_NUMBER: builtins.int
    CREATOR_FIELD_NUMBER: builtins.int
    NEW_ACCOUNT_NAME_FIELD_NUMBER: builtins.int
    OWNER_FIELD_NUMBER: builtins.int
    ACTIVE_FIELD_NUMBER: builtins.int
    POSTING_FIELD_NUMBER: builtins.int
    MEMO_KEY_FIELD_NUMBER: builtins.int
    JSON_METADATA_FIELD_NUMBER: builtins.int
    EXTENSIONS_FIELD_NUMBER: builtins.int
    @property
    def fee(self) -> asset_pb2.asset: ...
    @property
    def delegation(self) -> asset_pb2.asset: ...
    creator: builtins.str
    new_account_name: builtins.str
    @property
    def owner(self) -> authority_pb2.authority: ...
    @property
    def active(self) -> authority_pb2.authority: ...
    @property
    def posting(self) -> authority_pb2.authority: ...
    memo_key: builtins.str
    json_metadata: builtins.str
    @property
    def extensions(self) -> google.protobuf.internal.containers.RepeatedCompositeFieldContainer[future_extensions_pb2.future_extensions]: ...
    def __init__(
        self,
        *,
        fee: asset_pb2.asset | None = ...,
        delegation: asset_pb2.asset | None = ...,
        creator: builtins.str | None = ...,
        new_account_name: builtins.str | None = ...,
        owner: authority_pb2.authority | None = ...,
        active: authority_pb2.authority | None = ...,
        posting: authority_pb2.authority | None = ...,
        memo_key: builtins.str | None = ...,
        json_metadata: builtins.str | None = ...,
        extensions: collections.abc.Iterable[future_extensions_pb2.future_extensions] | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["active", b"active", "creator", b"creator", "delegation", b"delegation", "fee", b"fee", "json_metadata", b"json_metadata", "memo_key", b"memo_key", "new_account_name", b"new_account_name", "owner", b"owner", "posting", b"posting"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["active", b"active", "creator", b"creator", "delegation", b"delegation", "extensions", b"extensions", "fee", b"fee", "json_metadata", b"json_metadata", "memo_key", b"memo_key", "new_account_name", b"new_account_name", "owner", b"owner", "posting", b"posting"]) -> None: ...

global___account_create_with_delegation = account_create_with_delegation
