"""
@generated by mypy-protobuf.  Do not edit manually!
isort:skip_file
"""
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
class create_claimed_account(google.protobuf.message.Message):
    """The operation create_claimed_account_operation may be used by the user who has the token.
    Pending claimed accounts (see claim_account_operation).
    After executing the operation create_claimed_account_operation, a new account is created.

    Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/23_create_claimed_account.md?ref_type=heads
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    CREATOR_FIELD_NUMBER: builtins.int
    NEW_ACCOUNT_NAME_FIELD_NUMBER: builtins.int
    OWNER_FIELD_NUMBER: builtins.int
    ACTIVE_FIELD_NUMBER: builtins.int
    POSTING_FIELD_NUMBER: builtins.int
    MEMO_KEY_FIELD_NUMBER: builtins.int
    JSON_METADATA_FIELD_NUMBER: builtins.int
    EXTENSIONS_FIELD_NUMBER: builtins.int
    creator: builtins.str
    """@param {string} creator - An account who create a new account."""
    new_account_name: builtins.str
    """@param {string} new_account_name - Account name.
                                       Valid account name may consist of many parts separated by a dot,
                                       total may have up to 16 characters, parts have to start from a letter,
                                       may be followed by numbers, or “-“.
    """
    @property
    def owner(self) -> authority_pb2.authority:
        """@param {authority} owner"""
    @property
    def active(self) -> authority_pb2.authority:
        """@param {authority} active"""
    @property
    def posting(self) -> authority_pb2.authority:
        """@param {authority} posting"""
    memo_key: builtins.str
    """@param {string} memo_key"""
    json_metadata: builtins.str
    """@param {string} json_metadata - Json string."""
    @property
    def extensions(self) -> google.protobuf.internal.containers.RepeatedCompositeFieldContainer[future_extensions_pb2.future_extensions]:
        """@param {future_extensions} extensions - Not currently used."""
    def __init__(
        self,
        *,
        creator: builtins.str | None = ...,
        new_account_name: builtins.str | None = ...,
        owner: authority_pb2.authority | None = ...,
        active: authority_pb2.authority | None = ...,
        posting: authority_pb2.authority | None = ...,
        memo_key: builtins.str | None = ...,
        json_metadata: builtins.str | None = ...,
        extensions: collections.abc.Iterable[future_extensions_pb2.future_extensions] | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["active", b"active", "creator", b"creator", "json_metadata", b"json_metadata", "memo_key", b"memo_key", "new_account_name", b"new_account_name", "owner", b"owner", "posting", b"posting"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["active", b"active", "creator", b"creator", "extensions", b"extensions", "json_metadata", b"json_metadata", "memo_key", b"memo_key", "new_account_name", b"new_account_name", "owner", b"owner", "posting", b"posting"]) -> None: ...

global___create_claimed_account = create_claimed_account
