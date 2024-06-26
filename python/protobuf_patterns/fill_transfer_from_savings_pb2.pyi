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
class fill_transfer_from_savings(google.protobuf.message.Message):
    """Related to transfer_from_savings_operation.
    Generated during block processing after savings withdraw time has passed and requested amount
    was transfered from savings to liquid balance.
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    FROM_ACCOUNT_FIELD_NUMBER: builtins.int
    TO_ACCOUNT_FIELD_NUMBER: builtins.int
    AMOUNT_FIELD_NUMBER: builtins.int
    REQUEST_ID_FIELD_NUMBER: builtins.int
    MEMO_FIELD_NUMBER: builtins.int
    from_account: builtins.str
    """@param {string} from_account - user that initiated transfer from savings"""
    to_account: builtins.str
    """@param {string} to_account - user that was specified to receive funds (receiver of amount)"""
    @property
    def amount(self) -> asset_pb2.asset:
        """@param {asset} amount - (HIVE or HBD) funds transfered from savings"""
    request_id: builtins.int
    """@param {number} request_id - id of transfer request"""
    memo: builtins.str
    """@param {string} memo - memo attached to transfer request"""
    def __init__(
        self,
        *,
        from_account: builtins.str | None = ...,
        to_account: builtins.str | None = ...,
        amount: asset_pb2.asset | None = ...,
        request_id: builtins.int | None = ...,
        memo: builtins.str | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["amount", b"amount", "from_account", b"from_account", "memo", b"memo", "request_id", b"request_id", "to_account", b"to_account"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["amount", b"amount", "from_account", b"from_account", "memo", b"memo", "request_id", b"request_id", "to_account", b"to_account"]) -> None: ...

global___fill_transfer_from_savings = fill_transfer_from_savings
