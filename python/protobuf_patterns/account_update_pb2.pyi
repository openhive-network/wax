"""
@generated by mypy-protobuf.  Do not edit manually!
isort:skip_file
"""
import authority_pb2
import builtins
import google.protobuf.descriptor
import google.protobuf.message
import sys

if sys.version_info >= (3, 8):
    import typing as typing_extensions
else:
    import typing_extensions

DESCRIPTOR: google.protobuf.descriptor.FileDescriptor

@typing_extensions.final
class account_update(google.protobuf.message.Message):
    """Operations account_update_operation and account_update2_operation share a limit of allowed updates of the owner authority:
    two executions per 60 minutes (HIVE_OWNER_UPDATE_LIMIT) (meaning each of them can be executed twice or both can be executed once during that time period).
    After 30 days (HIVE_OWNER_AUTH_RECOVERY_PERIOD) using the account recovery process to change the owner authority is no longer possible.
    The operation account_update_operation allows changing authorities, it doesn’t allow changing the posting_json_metadata.

    Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/10_account_update.md?ref_type=heads
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    ACCOUNT_FIELD_NUMBER: builtins.int
    OWNER_FIELD_NUMBER: builtins.int
    ACTIVE_FIELD_NUMBER: builtins.int
    POSTING_FIELD_NUMBER: builtins.int
    MEMO_KEY_FIELD_NUMBER: builtins.int
    JSON_METADATA_FIELD_NUMBER: builtins.int
    account: builtins.str
    """@param {string} account - Account name, it cannot be updated."""
    @property
    def owner(self) -> authority_pb2.authority:
        """@param {authority} owner - In order to update the {owner}, the owner authority is required.
                                   It may be changed 2 times per hour.
                                   If a user provides a new authority, the old one will be deleted,
                                   but the deleted authority may be used up to 30 days in the process of the recovery account.
        """
    @property
    def active(self) -> authority_pb2.authority:
        """@param {authority} active - In order to update the {active}, the active authority is required.
                                    If a user provides a new authority, the old one will be deleted.
        """
    @property
    def posting(self) -> authority_pb2.authority:
        """@param {authority} posting - In order to update the {posting}, the active authority is required.
                                     If a user provides a new authority, the old one will be deleted.
        """
    memo_key: builtins.str
    """@param {string} memo_key - In order to update the {memo_key}, active authority is required.
                               If a user provides a new key, the old one will be deleted.
    """
    json_metadata: builtins.str
    """@param {string} json_metadata - json_string; in order to update the {json_metadata}, the active authority is required."""
    def __init__(
        self,
        *,
        account: builtins.str | None = ...,
        owner: authority_pb2.authority | None = ...,
        active: authority_pb2.authority | None = ...,
        posting: authority_pb2.authority | None = ...,
        memo_key: builtins.str | None = ...,
        json_metadata: builtins.str | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["account", b"account", "active", b"active", "json_metadata", b"json_metadata", "memo_key", b"memo_key", "owner", b"owner", "posting", b"posting"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["account", b"account", "active", b"active", "json_metadata", b"json_metadata", "memo_key", b"memo_key", "owner", b"owner", "posting", b"posting"]) -> None: ...

global___account_update = account_update
