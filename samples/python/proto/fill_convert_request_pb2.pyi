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
class fill_convert_request(google.protobuf.message.Message):
    """Related to convert_operation.
    Generated during block processing after conversion delay passes and HBD is converted to HIVE.

    @param {string} owner - User that requested conversion (receiver of amount_out).
    @param {number} requestid - id of the request.
    @param {asset} amount_in - (HBD) source of conversion.
    @param {asset} amount_out - (HIVE) effect of conversion.
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    OWNER_FIELD_NUMBER: builtins.int
    REQUESTID_FIELD_NUMBER: builtins.int
    AMOUNT_IN_FIELD_NUMBER: builtins.int
    AMOUNT_OUT_FIELD_NUMBER: builtins.int
    owner: builtins.str
    requestid: builtins.int
    @property
    def amount_in(self) -> asset_pb2.asset: ...
    @property
    def amount_out(self) -> asset_pb2.asset: ...
    def __init__(
        self,
        *,
        owner: builtins.str | None = ...,
        requestid: builtins.int | None = ...,
        amount_in: asset_pb2.asset | None = ...,
        amount_out: asset_pb2.asset | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["amount_in", b"amount_in", "amount_out", b"amount_out", "owner", b"owner", "requestid", b"requestid"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["amount_in", b"amount_in", "amount_out", b"amount_out", "owner", b"owner", "requestid", b"requestid"]) -> None: ...

global___fill_convert_request = fill_convert_request
