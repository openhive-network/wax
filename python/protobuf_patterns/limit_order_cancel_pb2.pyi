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
    """Cancels an order (limit_order_create_operation or limit_order_create2_operation)
    and returns the balance to the owner.

    Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/06_limit_order_cancel.md?ref_type=heads
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    OWNER_FIELD_NUMBER: builtins.int
    ORDERID_FIELD_NUMBER: builtins.int
    owner: builtins.str
    """@param {string} owner"""
    orderid: builtins.int
    """@param {number} orderid - The request_id provided by a user during creating a limit_order_create_operation
                              or limit_order_create2_operation.
    """
    def __init__(
        self,
        *,
        owner: builtins.str | None = ...,
        orderid: builtins.int | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["orderid", b"orderid", "owner", b"owner"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["orderid", b"orderid", "owner", b"owner"]) -> None: ...

global___limit_order_cancel = limit_order_cancel
