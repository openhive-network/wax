"""
@generated by mypy-protobuf.  Do not edit manually!
isort:skip_file
"""
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
class declined_voting_rights(google.protobuf.message.Message):
    """It's related to `decline_voting_rights_operation` and generated after `HIVE_OWNER_AUTH_RECOVERY_PERIOD` interval.
    Then some actions are done and after that `declined_voting_rights_operation` is created.
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    ACCOUNT_FIELD_NUMBER: builtins.int
    account: builtins.str
    """@param {string} account - user who decided to decline his voting rights"""
    def __init__(
        self,
        *,
        account: builtins.str | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["account", b"account"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["account", b"account"]) -> None: ...

global___declined_voting_rights = declined_voting_rights
