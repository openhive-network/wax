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
class transfer_from_savings(google.protobuf.message.Message):
    """Funds withdrawals from the savings to an account take three days.

    Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/33_transfer_from_savings.md?ref_type=heads
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    FROM_ACCOUNT_FIELD_NUMBER: builtins.int
    REQUEST_ID_FIELD_NUMBER: builtins.int
    TO_ACCOUNT_FIELD_NUMBER: builtins.int
    AMOUNT_FIELD_NUMBER: builtins.int
    MEMO_FIELD_NUMBER: builtins.int
    from_account: builtins.str
    """@param {string} from_account - Account name."""
    request_id: builtins.int
    """@param {number} request_id - The number is given by a user. Should be unique for a user."""
    to_account: builtins.str
    """@param {string} to_account - Account name."""
    @property
    def amount(self) -> asset_pb2.asset:
        """@param {asset} amount - The allowed currency: HIVE and HBD, amount > 0."""
    memo: builtins.str
    """@param {string} memo - Have to be UTF8,  must be shorter than 2048."""
    def __init__(
        self,
        *,
        from_account: builtins.str | None = ...,
        request_id: builtins.int | None = ...,
        to_account: builtins.str | None = ...,
        amount: asset_pb2.asset | None = ...,
        memo: builtins.str | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["amount", b"amount", "from_account", b"from_account", "memo", b"memo", "request_id", b"request_id", "to_account", b"to_account"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["amount", b"amount", "from_account", b"from_account", "memo", b"memo", "request_id", b"request_id", "to_account", b"to_account"]) -> None: ...

global___transfer_from_savings = transfer_from_savings
