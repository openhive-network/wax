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
class escrow_release(google.protobuf.message.Message):
    """The operation is used to release the funds of the escrow.
    The escrow may be released by { from }, { to } or { agent } – depending on the following conditions:
    If there is no dispute and escrow has not expired, either party can release funds to the other.
    If escrow expires and there is no dispute, either party can release funds to either party.
    If there is a dispute regardless of expiration, the agent can release funds to either party
    following whichever agreement was in place between the parties.

    Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/29_escrow_release.md?ref_type=heads
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    FROM_ACCOUNT_FIELD_NUMBER: builtins.int
    TO_ACCOUNT_FIELD_NUMBER: builtins.int
    AGENT_FIELD_NUMBER: builtins.int
    WHO_FIELD_NUMBER: builtins.int
    RECEIVER_FIELD_NUMBER: builtins.int
    ESCROW_ID_FIELD_NUMBER: builtins.int
    HBD_AMOUNT_FIELD_NUMBER: builtins.int
    HIVE_AMOUNT_FIELD_NUMBER: builtins.int
    from_account: builtins.str
    """@param {string} from_account - Account name."""
    to_account: builtins.str
    """@param {string} to_account - Account name."""
    agent: builtins.str
    """@param {string} agent - Account name."""
    who: builtins.str
    """@param {string} who - The account that is attempting to release the funds."""
    receiver: builtins.str
    """@param {string} receiver - The account that should receive funds (might be {from}, might be {to})."""
    escrow_id: builtins.int
    """@param {number} escrow_id - Escrow indicator."""
    @property
    def hbd_amount(self) -> asset_pb2.asset:
        """@param {asset} hbd_amount - The amount of HBD to release."""
    @property
    def hive_amount(self) -> asset_pb2.asset:
        """@param {asset} hive_amount - The amount of HIVE to release."""
    def __init__(
        self,
        *,
        from_account: builtins.str | None = ...,
        to_account: builtins.str | None = ...,
        agent: builtins.str | None = ...,
        who: builtins.str | None = ...,
        receiver: builtins.str | None = ...,
        escrow_id: builtins.int | None = ...,
        hbd_amount: asset_pb2.asset | None = ...,
        hive_amount: asset_pb2.asset | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["agent", b"agent", "escrow_id", b"escrow_id", "from_account", b"from_account", "hbd_amount", b"hbd_amount", "hive_amount", b"hive_amount", "receiver", b"receiver", "to_account", b"to_account", "who", b"who"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["agent", b"agent", "escrow_id", b"escrow_id", "from_account", b"from_account", "hbd_amount", b"hbd_amount", "hive_amount", b"hive_amount", "receiver", b"receiver", "to_account", b"to_account", "who", b"who"]) -> None: ...

global___escrow_release = escrow_release
