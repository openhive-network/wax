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
class expired_account_notification(google.protobuf.message.Message):
    """Related to governance voting: account_witness_vote_operation, account_witness_proxy_operation and update_proposal_votes_operation.
    Generated during block processing when user did not cast any governance vote for very long time. Such user is considered not
    interested in governance and therefore his previous votes are nullified.
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    ACCOUNT_FIELD_NUMBER: builtins.int
    account: builtins.str
    """@param {string} account - user whose governance votes were nullified"""
    def __init__(
        self,
        *,
        account: builtins.str | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["account", b"account"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["account", b"account"]) -> None: ...

global___expired_account_notification = expired_account_notification
