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
class limit_order_cancel(google.protobuf.message.Message):
    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    ORDER_FIELD_NUMBER: builtins.int
    ORDERID_FIELD_NUMBER: builtins.int
    order: builtins.str
    orderid: builtins.int
    def __init__(
        self,
        *,
        order: builtins.str | None = ...,
        orderid: builtins.int | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["order", b"order", "orderid", b"orderid"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["order", b"order", "orderid", b"orderid"]) -> None: ...

global___limit_order_cancel = limit_order_cancel