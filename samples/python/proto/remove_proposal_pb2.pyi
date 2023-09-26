"""
@generated by mypy-protobuf.  Do not edit manually!
isort:skip_file
"""
import builtins
import collections.abc
import future_extensions_pb2
import google.protobuf.descriptor
import google.protobuf.internal.containers
import google.protobuf.message
import sys

if sys.version_info >= (3, 8):
    import typing as typing_extensions
else:
    import typing_extensions

DESCRIPTOR: google.protobuf.descriptor.FileDescriptor

@typing_extensions.final
class remove_proposal(google.protobuf.message.Message):
    """Using operation remove_proposal_operation, a user may remove proposals specified by given IDs.

    @param {string} proposal_owner
    @param {number} proposal_ids
    @param {future_extensions} extensions
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    PROPOSAL_OWNER_FIELD_NUMBER: builtins.int
    PROPOSAL_IDS_FIELD_NUMBER: builtins.int
    EXTENSIONS_FIELD_NUMBER: builtins.int
    proposal_owner: builtins.str
    @property
    def proposal_ids(self) -> google.protobuf.internal.containers.RepeatedScalarFieldContainer[builtins.int]: ...
    @property
    def extensions(self) -> google.protobuf.internal.containers.RepeatedCompositeFieldContainer[future_extensions_pb2.future_extensions]: ...
    def __init__(
        self,
        *,
        proposal_owner: builtins.str | None = ...,
        proposal_ids: collections.abc.Iterable[builtins.int] | None = ...,
        extensions: collections.abc.Iterable[future_extensions_pb2.future_extensions] | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["proposal_owner", b"proposal_owner"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["extensions", b"extensions", "proposal_ids", b"proposal_ids", "proposal_owner", b"proposal_owner"]) -> None: ...

global___remove_proposal = remove_proposal
