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
class changed_recovery_account(google.protobuf.message.Message):
    """Related to change_recovery_account_operation.
    Generated during block processing after wait period for the recovery account change has passed and the change became active.
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    ACCOUNT_FIELD_NUMBER: builtins.int
    OLD_RECOVERY_ACCOUNT_FIELD_NUMBER: builtins.int
    NEW_RECOVERY_ACCOUNT_FIELD_NUMBER: builtins.int
    account: builtins.str
    """@param {string} account - used that requested recovery accout change"""
    old_recovery_account: builtins.str
    """@param {string} old_recovery_account - previous recovery account"""
    new_recovery_account: builtins.str
    """@param {string} new_recovery_account - new recovery account"""
    def __init__(
        self,
        *,
        account: builtins.str | None = ...,
        old_recovery_account: builtins.str | None = ...,
        new_recovery_account: builtins.str | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["account", b"account", "new_recovery_account", b"new_recovery_account", "old_recovery_account", b"old_recovery_account"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["account", b"account", "new_recovery_account", b"new_recovery_account", "old_recovery_account", b"old_recovery_account"]) -> None: ...

global___changed_recovery_account = changed_recovery_account
