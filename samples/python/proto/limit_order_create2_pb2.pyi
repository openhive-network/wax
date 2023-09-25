"""
@generated by mypy-protobuf.  Do not edit manually!
isort:skip_file
"""
import asset_pb2
import builtins
import google.protobuf.descriptor
import google.protobuf.message
import price_pb2
import sys

if sys.version_info >= (3, 8):
    import typing as typing_extensions
else:
    import typing_extensions

DESCRIPTOR: google.protobuf.descriptor.FileDescriptor

@typing_extensions.final
class limit_order_create2(google.protobuf.message.Message):
    """This operation creates a limit order and matches it against existing open orders.
    It is similar to limit_order_create except it serializes the price rather than calculating it from other fields.
    It allows to sell Hive and buy HBD or sell HBD and buy Hive.
    It is a way for a user to declare they wants to sell {amount_to_sell} Hive/HBD for at least {exchange_rate}  per HBD/Hive.

    @param {string} owner
    @param {number} orderid - an ID assigned by owner, must be unique.
    @param {asset} amount_to_sell
    @param {bool} fill_or_kill - If fill_or_kill = true, then the operation is executed immediately
                                 or it fails (the operation is not added to the block). 
                                 If fill_or_kill = false, then the order is valid till {expiration}.
    @param {price} exchange_rate
    @param {string} expiration
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    OWNER_FIELD_NUMBER: builtins.int
    ORDERID_FIELD_NUMBER: builtins.int
    AMOUNT_TO_SELL_FIELD_NUMBER: builtins.int
    FILL_OR_KILL_FIELD_NUMBER: builtins.int
    EXCHANGE_RATE_FIELD_NUMBER: builtins.int
    EXPIRATION_FIELD_NUMBER: builtins.int
    owner: builtins.str
    orderid: builtins.int
    @property
    def amount_to_sell(self) -> asset_pb2.asset: ...
    fill_or_kill: builtins.bool
    @property
    def exchange_rate(self) -> price_pb2.price: ...
    expiration: builtins.str
    def __init__(
        self,
        *,
        owner: builtins.str | None = ...,
        orderid: builtins.int | None = ...,
        amount_to_sell: asset_pb2.asset | None = ...,
        fill_or_kill: builtins.bool | None = ...,
        exchange_rate: price_pb2.price | None = ...,
        expiration: builtins.str | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["amount_to_sell", b"amount_to_sell", "exchange_rate", b"exchange_rate", "expiration", b"expiration", "fill_or_kill", b"fill_or_kill", "orderid", b"orderid", "owner", b"owner"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["amount_to_sell", b"amount_to_sell", "exchange_rate", b"exchange_rate", "expiration", b"expiration", "fill_or_kill", b"fill_or_kill", "orderid", b"orderid", "owner", b"owner"]) -> None: ...

global___limit_order_create2 = limit_order_create2
