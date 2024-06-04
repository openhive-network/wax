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
class author_reward(google.protobuf.message.Message):
    """Related to comment_operation.
    Generated during block processing after cashout time passes and comment is eligible for rewards (nonzero reward).
    Note: the reward is the author portion of comment reward lowered by the rewards distributed towards beneficiaries
    (therefore it can be zero).
    @see comment_benefactor_reward_operation
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    AUTHOR_FIELD_NUMBER: builtins.int
    PERMLINK_FIELD_NUMBER: builtins.int
    HBD_PAYOUT_FIELD_NUMBER: builtins.int
    HIVE_PAYOUT_FIELD_NUMBER: builtins.int
    VESTING_PAYOUT_FIELD_NUMBER: builtins.int
    CURATORS_VESTING_PAYOUT_FIELD_NUMBER: builtins.int
    PAYOUT_MUST_BE_CLAIMED_FIELD_NUMBER: builtins.int
    author: builtins.str
    """@param {string} author - author of the comment (receiver of hbd_payout, hive_payout, vesting_payout)"""
    permlink: builtins.str
    """@param {string} permlink - permlink of the comment"""
    @property
    def hbd_payout(self) -> asset_pb2.asset:
        """@param {asset} hbd_payout - (HBD) part of reward"""
    @property
    def hive_payout(self) -> asset_pb2.asset:
        """@param {asset} hive_payout - (HIVE) part of reward"""
    @property
    def vesting_payout(self) -> asset_pb2.asset:
        """@param {asset} vesting_payout - (VESTS) part of reward"""
    @property
    def curators_vesting_payout(self) -> asset_pb2.asset:
        """@param {asset} curators_vesting_payout - (VESTS) curators' portion of comment reward (@see curation_reward_operation)"""
    payout_must_be_claimed: builtins.bool
    """@param {bool} payout_must_be_claimed - true if payouts require use of claim_reward_balance_operation"""
    def __init__(
        self,
        *,
        author: builtins.str | None = ...,
        permlink: builtins.str | None = ...,
        hbd_payout: asset_pb2.asset | None = ...,
        hive_payout: asset_pb2.asset | None = ...,
        vesting_payout: asset_pb2.asset | None = ...,
        curators_vesting_payout: asset_pb2.asset | None = ...,
        payout_must_be_claimed: builtins.bool | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["author", b"author", "curators_vesting_payout", b"curators_vesting_payout", "hbd_payout", b"hbd_payout", "hive_payout", b"hive_payout", "payout_must_be_claimed", b"payout_must_be_claimed", "permlink", b"permlink", "vesting_payout", b"vesting_payout"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["author", b"author", "curators_vesting_payout", b"curators_vesting_payout", "hbd_payout", b"hbd_payout", "hive_payout", b"hive_payout", "payout_must_be_claimed", b"payout_must_be_claimed", "permlink", b"permlink", "vesting_payout", b"vesting_payout"]) -> None: ...

global___author_reward = author_reward
