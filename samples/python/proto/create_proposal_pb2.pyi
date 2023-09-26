"""
@generated by mypy-protobuf.  Do not edit manually!
isort:skip_file
"""
import asset_pb2
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
class create_proposal(google.protobuf.message.Message):
    """There is a Decentralized Hive Fund (DHF) on the Hive.
    Users may submit proposals for funding and if the proposal receives enough votes, it will be funded.
    In order to create a proposal user should create a post first and then marked it as
    a proposal with the operation create_proposal_operation.
    User defines when the proposal starts and ends and how many funds need to realize it.
    The creating proposal costs 10 HBD and additionally 1 HBD for each day over 60 days. The fee goes back to DHF.
    Every hour all active proposals are processed and taking into consideration a current number of votes payments are done.
    Accounts can create/remove votes anytime.

    @param {string} creator
    @param {string} receiver
    @param {string} start_date
    @param {string} end_date
    @param {asset} daily_pay
    @param {string} subject
    @param {string} permlink
    @param {future_extensions} extensions
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    CREATOR_FIELD_NUMBER: builtins.int
    RECEIVER_FIELD_NUMBER: builtins.int
    START_DATE_FIELD_NUMBER: builtins.int
    END_DATE_FIELD_NUMBER: builtins.int
    DAILY_PAY_FIELD_NUMBER: builtins.int
    SUBJECT_FIELD_NUMBER: builtins.int
    PERMLINK_FIELD_NUMBER: builtins.int
    EXTENSIONS_FIELD_NUMBER: builtins.int
    creator: builtins.str
    receiver: builtins.str
    start_date: builtins.str
    end_date: builtins.str
    @property
    def daily_pay(self) -> asset_pb2.asset: ...
    subject: builtins.str
    permlink: builtins.str
    @property
    def extensions(self) -> google.protobuf.internal.containers.RepeatedCompositeFieldContainer[future_extensions_pb2.future_extensions]: ...
    def __init__(
        self,
        *,
        creator: builtins.str | None = ...,
        receiver: builtins.str | None = ...,
        start_date: builtins.str | None = ...,
        end_date: builtins.str | None = ...,
        daily_pay: asset_pb2.asset | None = ...,
        subject: builtins.str | None = ...,
        permlink: builtins.str | None = ...,
        extensions: collections.abc.Iterable[future_extensions_pb2.future_extensions] | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["creator", b"creator", "daily_pay", b"daily_pay", "end_date", b"end_date", "permlink", b"permlink", "receiver", b"receiver", "start_date", b"start_date", "subject", b"subject"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["creator", b"creator", "daily_pay", b"daily_pay", "end_date", b"end_date", "extensions", b"extensions", "permlink", b"permlink", "receiver", b"receiver", "start_date", b"start_date", "subject", b"subject"]) -> None: ...

global___create_proposal = create_proposal
