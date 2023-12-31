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
class witness_block_approve(google.protobuf.message.Message):
    """This is an operation for witnesses.
    This operation is used in the process of block_validity_vote
    (see https://hive.blog/hive-139531/@blocktrades/one-block-irreversibility-for-delegated-proof-of-stake-dpos).

    @param {string} witness
    @param {string} block_id
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    WITNESS_FIELD_NUMBER: builtins.int
    BLOCK_ID_FIELD_NUMBER: builtins.int
    witness: builtins.str
    block_id: builtins.str
    def __init__(
        self,
        *,
        witness: builtins.str | None = ...,
        block_id: builtins.str | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["block_id", b"block_id", "witness", b"witness"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["block_id", b"block_id", "witness", b"witness"]) -> None: ...

global___witness_block_approve = witness_block_approve
