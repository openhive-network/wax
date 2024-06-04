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
class transfer(google.protobuf.message.Message):
    """@brief Transfers any liquid asset (nonvesting) from one account to another.

    Transfer funds from 'from_account' to 'to_account'. HIVE and HBD can be transferred.
    Memo for the transaction can be encrypted if message is started with '#'.
    Private Memo Key must already be in the wallet for encrypted memo to work.

    Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/02_transfer.md?ref_type=heads
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    FROM_ACCOUNT_FIELD_NUMBER: builtins.int
    TO_ACCOUNT_FIELD_NUMBER: builtins.int
    AMOUNT_FIELD_NUMBER: builtins.int
    MEMO_FIELD_NUMBER: builtins.int
    from_account: builtins.str
    """@param {string} from_account - The account the funds are coming from."""
    to_account: builtins.str
    """@param {string} to_account - The account the funds are going to."""
    @property
    def amount(self) -> asset_pb2.asset:
        """@param {asset} amount - The amount of asset to transfer from @ref from_account to @ref to_account, the allowed currency: HIVE and HBD."""
    memo: builtins.str
    """@param {string} memo - The memo is plain-text, any encryption on the memo is up to a higher level protocol, must be shorter than 2048."""
    def __init__(
        self,
        *,
        from_account: builtins.str | None = ...,
        to_account: builtins.str | None = ...,
        amount: asset_pb2.asset | None = ...,
        memo: builtins.str | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["amount", b"amount", "from_account", b"from_account", "memo", b"memo", "to_account", b"to_account"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["amount", b"amount", "from_account", b"from_account", "memo", b"memo", "to_account", b"to_account"]) -> None: ...

global___transfer = transfer
