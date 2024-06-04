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
class transfer_to_vesting(google.protobuf.message.Message):
    """The operation is also called Staking.
    This operation converts Hive into Hive Power (also called Vesting Fund Shares  or VESTS) at the current exchange rate.
    The conversion may be done between the same account or to another account.
    The more HP (Hive Power) the account has, the more:
    a.       Governance voting power (for witnesses and proposals) has
    b.       Social voting power has (indirectly affects Increase curation rewards)
    c.       Resource Credit has

    Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/03_transfer_to_vesting.md?ref_type=heads
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    FROM_ACCOUNT_FIELD_NUMBER: builtins.int
    TO_ACCOUNT_FIELD_NUMBER: builtins.int
    AMOUNT_FIELD_NUMBER: builtins.int
    from_account: builtins.str
    """@param {string} from_account - The account the funds are coming from."""
    to_account: builtins.str
    """@param {string} to_account - The account the funds are going to. If null, then the same as 'from_account'."""
    @property
    def amount(self) -> asset_pb2.asset:
        """@param {asset} amount - Must be HIVE, amount > 0."""
    def __init__(
        self,
        *,
        from_account: builtins.str | None = ...,
        to_account: builtins.str | None = ...,
        amount: asset_pb2.asset | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["amount", b"amount", "from_account", b"from_account", "to_account", b"to_account"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["amount", b"amount", "from_account", b"from_account", "to_account", b"to_account"]) -> None: ...

global___transfer_to_vesting = transfer_to_vesting
