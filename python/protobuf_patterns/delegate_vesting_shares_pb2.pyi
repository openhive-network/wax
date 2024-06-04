"""
@generated by mypy-protobuf.  Do not edit manually!
isort:skip_file
"""
import asset_pb2
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
class delegate_vesting_shares(google.protobuf.message.Message):
    """The operation delegate_vesting_shares_operation allows to delegate an amount
    of { vesting_shares } to an { delegatee } account. The { vesting_shares } are still owned by { delegator },
    but the voting rights and resource credit are transferred.
    A user may not delegate:
    - the vesting shares that are already delegated
    - the delegated vesting shares to him (a user does not own them)
    - the vesting shares in the Power down process
    - the already used voting shares for voting or downvoting
    In order to remove the vesting shares delegation, the operation delegate_vesting_shares_operation
    should be created with {vesting_shares = 0}. When a delegation is removed, the delegated vesting shares
    are frozen for five days (HIVE_DELEGATION_RETURN_PERIOD_HF20) to prevent voting twice.

    Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/40_delegate_vesting_shares.md?ref_type=heads
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    DELEGATOR_FIELD_NUMBER: builtins.int
    DELEGATEE_FIELD_NUMBER: builtins.int
    VESTING_SHARES_FIELD_NUMBER: builtins.int
    delegator: builtins.str
    """@param {string} delegator - The account delegating vesting shares."""
    delegatee: builtins.str
    """@param {string} delegatee - The account receiving vesting shares."""
    @property
    def vesting_shares(self) -> asset_pb2.asset:
        """@param {asset} vesting_shares - The amount of vesting shares to be delegated.
                                        Minimal amount = 1/3 of the fee for creating a new account.
        """
    def __init__(
        self,
        *,
        delegator: builtins.str | None = ...,
        delegatee: builtins.str | None = ...,
        vesting_shares: asset_pb2.asset | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["delegatee", b"delegatee", "delegator", b"delegator", "vesting_shares", b"vesting_shares"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["delegatee", b"delegatee", "delegator", b"delegator", "vesting_shares", b"vesting_shares"]) -> None: ...

global___delegate_vesting_shares = delegate_vesting_shares
