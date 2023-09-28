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
class delayed_voting(google.protobuf.message.Message):
    """Related to transfer_to_vesting_operation.
    Generated during block processing every time part of fairly fresh VESTS becomes active part of governance vote for the account.
    Note: after account receives new VESTS there is a grace period before those VESTS are accounted for when
    it comes to governance vote power. This vop is generated at the end of that period.

    @param {string} voter - account with fairly fresh VESTS
    @param {number} votes - (VESTS satoshi) new governance vote power that just activated for voter
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    VOTER_FIELD_NUMBER: builtins.int
    VOTES_FIELD_NUMBER: builtins.int
    voter: builtins.str
    votes: builtins.int
    def __init__(
        self,
        *,
        voter: builtins.str | None = ...,
        votes: builtins.int | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["voter", b"voter", "votes", b"votes"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["voter", b"voter", "votes", b"votes"]) -> None: ...

global___delayed_voting = delayed_voting
