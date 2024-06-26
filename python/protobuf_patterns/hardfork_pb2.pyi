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
class hardfork(google.protobuf.message.Message):
    """Related to block processing.
    Generated during block processing every time new hardfork is activated. Many related vops can follow.
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    HARDFORK_ID_FIELD_NUMBER: builtins.int
    hardfork_id: builtins.int
    """ @param {number} hardfork_id - number of hardfork"""
    def __init__(
        self,
        *,
        hardfork_id: builtins.int | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["hardfork_id", b"hardfork_id"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["hardfork_id", b"hardfork_id"]) -> None: ...

global___hardfork = hardfork
