from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import asdict, dataclass
from enum import StrEnum
from typing import TYPE_CHECKING, Any, Literal

from wax.hive_apps_operations.factory import HiveAppsOperation, HiveAppsOperationBaseData

if TYPE_CHECKING:
    from wax.models.basic import AccountName


class ESupportedLanguages(StrEnum):
    ENGLISH = "en"
    KOREAN = "kr"
    CHINESE = "zh"
    MALAY = "ms"
    POLISH = "pl"
    PORTUGUESE = "pt"
    RUSSIAN = "ru"
    ITALIAN = "it"
    GERMAN = "de"
    SPANISH = "es"
    SWEDISH = "sv"


class ECommunityOperationActions(StrEnum):
    FLAG_POST = "flagPost"
    SET_USER_TITLE = "setUserTitle"
    SET_ROLE = "setRole"
    SUBSCRIBE = "subscribe"
    UNSUBSCRIBE = "unsubscribe"
    PIN_POST = "pinPost"
    UNPIN_POST = "unpinPost"
    UPDATE_PROPS = "updateProps"
    MUTE_POST = "mutePost"
    UNMUTE_POST = "unmutePost"


@dataclass
class BaseCommunityActionData(HiveAppsOperationBaseData, ABC):
    """Base class for community action data."""

    @abstractmethod
    def get_operation_action(self) -> ECommunityOperationActions:
        """
        Returns the operation action.

        Name of the action to be performed in the community.
        Will be used as first element of the list in the custom json operation.
        """

    def to_dict(self) -> dict[str, Any]:
        data = asdict(self)

        # pick the first field whose value is not a bool (payload)
        payload_key = None
        payload_value = None
        for k, v in data.items():
            if not isinstance(v, bool):
                payload_key = k
                payload_value = v
                break

        if payload_key is None:
            # fallback: if all fields are bools (unlikely), include an empty payload
            payload_value = {}

        return {self.get_operation_action().value: payload_value}


@dataclass
class FlagPostData(BaseCommunityActionData):
    @dataclass
    class FlagPostDataItem:
        community: str
        account: AccountName
        permlink: str
        notes: str

    flag_post: FlagPostDataItem

    def get_operation_action(self) -> ECommunityOperationActions:
        return ECommunityOperationActions.FLAG_POST


@dataclass
class SetRoleData(BaseCommunityActionData):
    @dataclass
    class SetRoleDataItem:
        community: str
        account: AccountName
        role: PossibleCommunityRole

    set_role: SetRoleDataItem

    def get_operation_action(self) -> ECommunityOperationActions:
        return ECommunityOperationActions.SET_ROLE


@dataclass
class SetUserTitleData(BaseCommunityActionData):
    @dataclass
    class SetUserTitleDataItem:
        community: str
        account: AccountName
        title: str

    set_user_title: SetUserTitleDataItem

    def get_operation_action(self) -> ECommunityOperationActions:
        return ECommunityOperationActions.SET_USER_TITLE


@dataclass
class ChangeSubscriptionData(BaseCommunityActionData):
    @dataclass
    class ChangeSubscriptionDataItem:
        community: str

    change_subscription: ChangeSubscriptionDataItem
    subscribe: bool = True

    def get_operation_action(self) -> ECommunityOperationActions:
        return ECommunityOperationActions.SUBSCRIBE if self.subscribe else ECommunityOperationActions.UNSUBSCRIBE


@dataclass
class ChangePinPostData(BaseCommunityActionData):
    @dataclass
    class ChangePinPostDataItem:
        community: str
        account: AccountName
        permlink: str

    change_pin_post: ChangePinPostDataItem
    pin: bool = True

    def get_operation_action(self) -> ECommunityOperationActions:
        return ECommunityOperationActions.PIN_POST if self.pin else ECommunityOperationActions.UNPIN_POST


@dataclass
class ChangeMutePostData(BaseCommunityActionData):
    @dataclass
    class ChangeMutePostDataItem:
        community: str
        account: AccountName
        permlink: str
        notes: str

    change_mute_post: ChangeMutePostDataItem
    mute: bool = True

    def get_operation_action(self) -> ECommunityOperationActions:
        return ECommunityOperationActions.MUTE_POST if self.mute else ECommunityOperationActions.UNMUTE_POST


@dataclass
class UpdatePropsData(BaseCommunityActionData):
    @dataclass
    class UpdatePropsDataItem:
        community: str
        props: CommunityProps

    update_props: UpdatePropsDataItem

    def get_operation_action(self) -> ECommunityOperationActions:
        return ECommunityOperationActions.UPDATE_PROPS


PossibleCommunityRole = Literal[
    "muted",  # id -2
    "guest",  # id 0
    "member",  # id 2
    "mod",  # id 4
    "admin",  # id 6
    "owner",  # id 8
]


@dataclass
class CommunityProps:
    title: str
    about: str = ""
    is_nsfw: bool = False
    """Is not safe for work flag."""
    lang: ESupportedLanguages = ESupportedLanguages.ENGLISH
    description: str = ""
    flag_text: str = ""
    """Community rules."""


CommunityOperationPossibleTypes = (
    FlagPostData
    | SetRoleData
    | SetUserTitleData
    | ChangeSubscriptionData
    | ChangePinPostData
    | ChangeMutePostData
    | UpdatePropsData
)


class CommunityOperation(HiveAppsOperation[CommunityOperationPossibleTypes]):
    """Handles community-related actions within Hive Apps."""

    @property
    def id(self) -> str:
        """Returns the operation ID."""
        return "community"

    def flag_post(self, community: str, account: AccountName, permlink: str, notes: str) -> CommunityOperation:
        """
        Flags a post in a community.

        Args:
            community: The community name.
            account: The account name of the user flagging the post.
            permlink: The permlink of the post.
            notes: Additional notes for the flag.

        Returns:
            The current instance for chaining.
        """
        self._body.append(FlagPostData(flag_post=FlagPostData.FlagPostDataItem(community, account, permlink, notes)))
        return self

    def set_role(self, community: str, account: AccountName, role: PossibleCommunityRole) -> CommunityOperation:
        """
        Sets a role for an account in a community.

        Args:
            community: The community name.
            account: The account name.
            role: The role to set.

        Returns:
            The current instance for chaining.
        """
        self._body.append(SetRoleData(set_role=SetRoleData.SetRoleDataItem(community, account, role)))
        return self

    def set_user_title(self, community: str, account: AccountName, title: str) -> CommunityOperation:
        """
        Sets a user title in a community.

        Args:
            community: The community name.
            account: The account name.
            title: The title to set.

        Returns:
            The current instance for chaining.
        """
        self._body.append(
            SetUserTitleData(set_user_title=SetUserTitleData.SetUserTitleDataItem(community, account, title))
        )
        return self

    def subscribe(self, community: str) -> CommunityOperation:
        """
        Subscribes to a community.

        Args:
            community: The community name.

        Returns:
            The current instance for chaining.
        """
        self._body.append(
            ChangeSubscriptionData(change_subscription=ChangeSubscriptionData.ChangeSubscriptionDataItem(community))
        )
        return self

    def unsubscribe(self, community: str) -> CommunityOperation:
        """
        Unsubscribes from a community.

        Args:
            community: The community name.

        Returns:
            The current instance for chaining.
        """
        self._body.append(
            ChangeSubscriptionData(
                change_subscription=ChangeSubscriptionData.ChangeSubscriptionDataItem(community), subscribe=False
            )
        )
        return self

    def pin_post(self, community: str, account: AccountName, permlink: str) -> CommunityOperation:
        """
        Pins a post in a community.

        Args:
            community: The community name.
            account: The account name.
            permlink: The permlink of the post.

        Returns:
            The current instance for chaining.
        """
        self._body.append(
            ChangePinPostData(change_pin_post=ChangePinPostData.ChangePinPostDataItem(community, account, permlink))
        )
        return self

    def unpin_post(self, community: str, account: AccountName, permlink: str) -> CommunityOperation:
        """
        Unpins a post in a community.

        Args:
            community: The community name.
            account: The account name.
            permlink: The permlink of the post.

        Returns:
            The current instance for chaining.
        """
        self._body.append(
            ChangePinPostData(
                change_pin_post=ChangePinPostData.ChangePinPostDataItem(community, account, permlink), pin=False
            )
        )
        return self

    def mute_post(self, community: str, account: AccountName, permlink: str, notes: str) -> CommunityOperation:
        """
        Mutes a post in a community.

        Args:
            community: The community name.
            account: The account name.
            permlink: The permlink of the post.
            notes: Additional notes.

        Returns:
            The current instance for chaining.
        """
        self._body.append(
            ChangeMutePostData(
                change_mute_post=ChangeMutePostData.ChangeMutePostDataItem(community, account, permlink, notes)
            )
        )
        return self

    def unmute_post(self, community: str, account: AccountName, permlink: str, notes: str) -> CommunityOperation:
        """
        Unmutes a post in a community.

        Args:
            community: The community name.
            account: The account name.
            permlink: The permlink of the post.
            notes: Additional notes.

        Returns:
            The current instance for chaining.
        """
        self._body.append(
            ChangeMutePostData(
                change_mute_post=ChangeMutePostData.ChangeMutePostDataItem(community, account, permlink, notes),
                mute=False,
            )
        )

        return self

    def update_props(self, community: str, props: CommunityProps) -> CommunityOperation:
        """
        Updates community properties.

        Args:
            community: The community name.
            props: The properties to update.

        Returns:
            The current instance for chaining.
        """
        self._body.append(UpdatePropsData(update_props=UpdatePropsData.UpdatePropsDataItem(community, props)))
        return self
