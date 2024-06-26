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
class legacy_chain_properties(google.protobuf.message.Message):
    """Witnesses must vote on how to set certain chain properties to ensure a smooth
    and well functioning network.  Any time owner is in the active set of witnesses these
    properties will be used to control the blockchain configuration.
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    ACCOUNT_CREATION_FEE_FIELD_NUMBER: builtins.int
    MAXIMUM_BLOCK_SIZE_FIELD_NUMBER: builtins.int
    HBD_INTEREST_RATE_FIELD_NUMBER: builtins.int
    @property
    def account_creation_fee(self) -> asset_pb2.asset:
        """@param {asset} account_creation_fee - This fee, paid in HIVE, is converted into VESTS for the new account.
                                              Accounts without vesting shares cannot earn usage rations and therefore are powerless.
                                              This minimum fee requires all accounts to have some kind of commitment
                                              to the network that includes the ability to vote and make transactions.
        """
    maximum_block_size: builtins.int
    """@param {number} maximum_block_size - This witnesses vote for the maximum_block_size which is used by the network to tune rate limiting and capacity."""
    hbd_interest_rate: builtins.int
    """@param {number} hbd_interest_rate"""
    def __init__(
        self,
        *,
        account_creation_fee: asset_pb2.asset | None = ...,
        maximum_block_size: builtins.int | None = ...,
        hbd_interest_rate: builtins.int | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["account_creation_fee", b"account_creation_fee", "hbd_interest_rate", b"hbd_interest_rate", "maximum_block_size", b"maximum_block_size"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["account_creation_fee", b"account_creation_fee", "hbd_interest_rate", b"hbd_interest_rate", "maximum_block_size", b"maximum_block_size"]) -> None: ...

global___legacy_chain_properties = legacy_chain_properties
