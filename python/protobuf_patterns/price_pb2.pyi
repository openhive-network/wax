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
class price(google.protobuf.message.Message):
    """Represents quotation of the relative value of asset against another asset.
    Similar to 'currency pair' used to determine value of currencies.

    For example:
    1 EUR / 1.25 USD where:
    1 EUR is an asset specified as a base
    1.25 USD us an asset specified as a qute

    can determine value of EUR against USD.
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    BASE_FIELD_NUMBER: builtins.int
    QUOTE_FIELD_NUMBER: builtins.int
    @property
    def base(self) -> asset_pb2.asset:
        """@param {asset} base - Represents a value of the price object to be expressed relatively to quote asset.
                              Cannot have amount == 0 if you want to build valid price.
        """
    @property
    def quote(self) -> asset_pb2.asset:
        """@param {asset} quote - represents an relative asset. Cannot have amount == 0, otherwise asertion fail."""
    def __init__(
        self,
        *,
        base: asset_pb2.asset | None = ...,
        quote: asset_pb2.asset | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["base", b"base", "quote", b"quote"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["base", b"base", "quote", b"quote"]) -> None: ...

global___price = price
