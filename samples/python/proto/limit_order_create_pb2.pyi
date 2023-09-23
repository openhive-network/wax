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
class limit_order_create(google.protobuf.message.Message):
    """This operation creates a limit order and matches it against existing open orders.
    It allows to sell Hive and buy HBD or sell HBD and buy Hive.
    It is a way for a user to declare they want to sell {amount_to_sell} Hive/HBD for at least {min_to_receive} HBD/Hive.
    The user may be a taker (if a user creates an order and the order matches some order(s))
    or a maker (if a user creates an order and the order doesn’t match and the order is waiting for a match on the market).
    If there is a partial match, a user may be a taker and maker for the same order. 
    If a taker creates an order for all orders on the market the order(s) that are the best deal for the taker are matched.
    If there are two orders with the same price, the older one is matched.
    The operation is used by the markets see: https://wallet.hive.blog/market

    @param {string} owner
    @param {number} orderid - an ID assigned by owner, must be unique.
    @param {asset} amount_to_sell
    @param {asset} min_to_receive
    @param {bool} fill_or_kill - If fill_or_kill = true, then the operation is executed immediately or it fails
                                 (the operation is not added to the block). 
                                 If fill_or_kill = false, then the order is valid till 'expiration'.
    @param {string} expiration
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    OWNER_FIELD_NUMBER: builtins.int
    ORDERID_FIELD_NUMBER: builtins.int
    AMOUNT_TO_SELL_FIELD_NUMBER: builtins.int
    MIN_TO_RECEIVE_FIELD_NUMBER: builtins.int
    FILL_OR_KILL_FIELD_NUMBER: builtins.int
    EXPIRATION_FIELD_NUMBER: builtins.int
    owner: builtins.str
    orderid: builtins.int
    @property
    def amount_to_sell(self) -> asset_pb2.asset: ...
    @property
    def min_to_receive(self) -> asset_pb2.asset: ...
    fill_or_kill: builtins.bool
    expiration: builtins.str
    def __init__(
        self,
        *,
        owner: builtins.str | None = ...,
        orderid: builtins.int | None = ...,
        amount_to_sell: asset_pb2.asset | None = ...,
        min_to_receive: asset_pb2.asset | None = ...,
        fill_or_kill: builtins.bool | None = ...,
        expiration: builtins.str | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["amount_to_sell", b"amount_to_sell", "expiration", b"expiration", "fill_or_kill", b"fill_or_kill", "min_to_receive", b"min_to_receive", "orderid", b"orderid", "owner", b"owner"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["amount_to_sell", b"amount_to_sell", "expiration", b"expiration", "fill_or_kill", b"fill_or_kill", "min_to_receive", b"min_to_receive", "orderid", b"orderid", "owner", b"owner"]) -> None: ...

global___limit_order_create = limit_order_create
