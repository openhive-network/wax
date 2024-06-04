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
class account_witness_vote(google.protobuf.message.Message):
    """A user may vote for a witness directly using an operation:
    account_witness_vote_operation or indirectly using the proxy - operation:  account_witness_proxy_operation.
    All accounts with a Hive Power (also called Vesting Fund Shares or VESTS) can vote for up to 30 witnesses,
    but you cannot vote twice for the same witnesses. 
    If a proxy is specified then all existing votes are removed.
    Your vote power depends on your HP.
    If the operation account_witness_vote_operation or account_witness_proxy_operation or update_proposal_votes_operation
    is not executed in a HIVE_GOVERNANCE_VOTE_EXPIRATION_PERIOD, the votes are removed and the virtual operation:
    expired_account_notification_operation is generated.

    Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/12_account_witness_vote.md?ref_type=heads
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    ACCOUNT_FIELD_NUMBER: builtins.int
    WITNESS_FIELD_NUMBER: builtins.int
    APPROVE_FIELD_NUMBER: builtins.int
    account: builtins.str
    """@param {string} account"""
    witness: builtins.str
    """@param {string} witness - Witness account."""
    approve: builtins.bool
    """@param {bool} approve - To vote for the witness, the approve = true. To remove the vote, the approve = false."""
    def __init__(
        self,
        *,
        account: builtins.str | None = ...,
        witness: builtins.str | None = ...,
        approve: builtins.bool | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["account", b"account", "approve", b"approve", "witness", b"witness"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["account", b"account", "approve", b"approve", "witness", b"witness"]) -> None: ...

global___account_witness_vote = account_witness_vote
