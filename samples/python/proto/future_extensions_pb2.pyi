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
class void_t(google.protobuf.message.Message):
    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    def __init__(
        self,
    ) -> None: ...

global___void_t = void_t

@typing_extensions.final
class future_extensions(google.protobuf.message.Message):
    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    VOID_T_FIELD_NUMBER: builtins.int
    @property
    def void_t(self) -> global___void_t: ...
    def __init__(
        self,
        *,
        void_t: global___void_t | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["extension", b"extension", "void_t", b"void_t"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["extension", b"extension", "void_t", b"void_t"]) -> None: ...
    def WhichOneof(self, oneof_group: typing_extensions.Literal["extension", b"extension"]) -> typing_extensions.Literal["void_t"] | None: ...

global___future_extensions = future_extensions