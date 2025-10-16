from __future__ import annotations

from dataclasses import asdict, dataclass
from enum import Enum
from typing import TYPE_CHECKING, Final

from wax.exceptions import ToLongFollowingListError
from wax.hive_apps_operations.factory import HiveAppsOperation, HiveAppsOperationBaseData

if TYPE_CHECKING:
    from wax.models.basic import AccountName


MAX_LIST_LENGTH: Final[int] = 100


@dataclass
class ReblogOperationDataItem:
    """Represents a single reblog operation data structure."""

    account: AccountName
    author: AccountName
    permlink: str


@dataclass
class FollowOperationDataItem:
    """Represents a single follow operation data structure."""

    what: EFollowActions
    follower: AccountName
    following: AccountName | list[AccountName]


@dataclass
class ReblogOperationData(HiveAppsOperationBaseData):
    reblog: ReblogOperationDataItem

    def to_dict(self) -> dict[str, int | str]:
        return asdict(self)


@dataclass
class FollowOperationData(HiveAppsOperationBaseData):
    follow: FollowOperationDataItem

    def to_dict(self) -> dict[str, int | str]:
        to_dict_converted = asdict(self)
        to_dict_converted["follow"]["what"] = [to_dict_converted["follow"]["what"].value]
        return to_dict_converted


class EFollowBlogAction(Enum):
    FOLLOW_BLOG = 0
    MUTE_BLOG = 1
    BOTH = 2


class EFollowOperationActions(Enum):
    FOLLOW = "follow"
    REBLOG = "reblog"


class EFollowActions(Enum):
    FOLLOW = "blog"
    UNFOLLOW = ""
    MUTE = "ignore"
    RESET_BLACKLIST = "reset_blacklist"
    BLACKLIST = "blacklist"
    RESET_FOLLOW_BLACKLIST = "reset_follow_blacklist"
    FOLLOW_BLACKLIST = "follow_blacklist"
    UNBLACKLIST = "unblacklist"
    UNFOLLOW_BLACKLIST = "unfollow_blacklist"
    RESET_FOLLOW_MUTED_LIST = "reset_follow_muted_list"
    FOLLOW_MUTED = "follow_muted"
    UNFOLLOW_MUTED = "unfollow_muted"
    RESET_ALL_LISTS = "reset_all_lists"
    RESET_FOLLOWING_LIST = "reset_following_list"
    RESET_MUTED_LIST = "reset_muted_list"


class FollowOperation(HiveAppsOperation[FollowOperationData | ReblogOperationData]):
    """Represents a Hive follow-related operation."""

    @property
    def id(self) -> str:
        """
        Returns the operation ID.

        Returns:
            The operation identifier string.
        """
        return "follow"

    def follow_blog(
        self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName
    ) -> FollowOperation:
        """
        Creates an operation to follow the specified blogs.

        Args:
            working_account: The account performing the follow action.
            blog: The main blog account to follow.
            other_blogs: Additional blog accounts to follow.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self._follow_body_builder(EFollowActions.FOLLOW, working_account, blog, *other_blogs)

    def unfollow_blog(
        self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName
    ) -> FollowOperation:
        """
        Creates an operation to unfollow the specified blogs.

        Args:
            working_account: The account performing the unfollow action.
            blog: The main blog account to unfollow.
            other_blogs: Additional blog accounts to unfollow.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self._follow_body_builder(EFollowActions.UNFOLLOW, working_account, blog, *other_blogs)

    def mute_blog(self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName) -> FollowOperation:
        """
        Creates an operation to mute the specified blogs.

        Args:
            working_account: The account performing the mute action.
            blog: The main blog account to mute.
            other_blogs: Additional blog accounts to mute.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self._follow_body_builder(EFollowActions.MUTE, working_account, blog, *other_blogs)

    def unmute_blog(
        self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName
    ) -> FollowOperation:
        """
        Creates an operation to unmute the specified blogs.

        Args:
            working_account: The account performing the unmute action.
            blog: The main blog account to unmute.
            other_blogs: Additional blog accounts to unmute.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self.unfollow_blog(working_account, blog, *other_blogs)

    def reset_blacklist_blog(
        self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName
    ) -> FollowOperation:
        """
        Creates an operation to reset the blacklist for the specified blogs.

        Args:
            working_account: The account performing the reset action.
            blog: The main blog account to reset the blacklist for.
            other_blogs: Additional blog accounts to reset the blacklist for.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self._follow_body_builder(EFollowActions.RESET_BLACKLIST, working_account, blog, *other_blogs)

    def blacklist_blog(
        self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName
    ) -> FollowOperation:
        """
        Creates an operation to add the specified blogs to the blacklist.

        Args:
            working_account: The account performing the blacklist action.
            blog: The main blog account to blacklist.
            other_blogs: Additional blog accounts to blacklist.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self._follow_body_builder(EFollowActions.BLACKLIST, working_account, blog, *other_blogs)

    def reset_follow_blacklist_blog(
        self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName
    ) -> FollowOperation:
        """
        Creates an operation to reset the follow blacklist list.

        Args:
            working_account: The account performing the reset action.
            blog: The main blog account to reset the follow blacklist for.
            other_blogs: Additional blog accounts to reset the follow blacklist for.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self._follow_body_builder(EFollowActions.RESET_FOLLOW_BLACKLIST, working_account, blog, *other_blogs)

    def follow_blacklist_blog(
        self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName
    ) -> FollowOperation:
        """
        Creates an operation to follow blacklisted blogs.

        Args:
            working_account: The account performing the follow action.
            blog: The main blog account to follow from the blacklist.
            other_blogs: Additional blog accounts to follow from the blacklist.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self._follow_body_builder(EFollowActions.FOLLOW_BLACKLIST, working_account, blog, *other_blogs)

    def unblacklist_blog(
        self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName
    ) -> FollowOperation:
        """
        Creates an operation to remove blogs from the blacklist.

        Args:
            working_account: The account performing the unblacklist action.
            blog: The main blog account to unblacklist.
            other_blogs: Additional blog accounts to unblacklist.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self._follow_body_builder(EFollowActions.UNBLACKLIST, working_account, blog, *other_blogs)

    def unfollow_blacklist_blog(
        self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName
    ) -> FollowOperation:
        """
        Creates an operation to unfollow blacklisted blogs.

        Args:
            working_account: The account performing the unfollow action.
            blog: The main blog account to unfollow from the blacklist.
            other_blogs: Additional blog accounts to unfollow from the blacklist.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self._follow_body_builder(EFollowActions.UNFOLLOW_BLACKLIST, working_account, blog, *other_blogs)

    def reset_follow_muted_blog(
        self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName
    ) -> FollowOperation:
        """
        Creates an operation to reset the follow muted list.

        Args:
            working_account: The account performing the reset action.
            blog: The main blog account to reset the follow muted list for.
            other_blogs: Additional blog accounts to reset the follow muted list for.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self._follow_body_builder(EFollowActions.RESET_FOLLOW_MUTED_LIST, working_account, blog, *other_blogs)

    def follow_muted_blog(
        self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName
    ) -> FollowOperation:
        """
        Creates an operation to follow muted blogs.

        Args:
            working_account: The account performing the reset action.
            blog: The main blog account to reset the follow muted list for.
            other_blogs: Additional blog accounts to reset the follow muted list for.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self._follow_body_builder(EFollowActions.FOLLOW_MUTED, working_account, blog, *other_blogs)

    def unfollow_muted_blog(
        self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName
    ) -> FollowOperation:
        """
        Creates an operation to unfollow muted blogs.

        Args:
            working_account: The account performing the reset action.
            blog: The main blog account to reset the follow muted list for.
            other_blogs: Additional blog accounts to reset the follow muted list for.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self._follow_body_builder(EFollowActions.UNFOLLOW_MUTED, working_account, blog, *other_blogs)

    def reset_all_blog(
        self, working_account: AccountName, blog: AccountName, *other_blogs: AccountName
    ) -> FollowOperation:
        """
        Creates an operation to reset all lists related to the specified blogs.

        Args:
            working_account: The account performing the reset action.
            blog: The main blog account to reset the follow muted list for.
            other_blogs: Additional blog accounts to reset the follow muted list for.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        return self._follow_body_builder(EFollowActions.RESET_ALL_LISTS, working_account, blog, *other_blogs)

    def reset_blog_list(
        self,
        action: EFollowBlogAction,
        working_account: AccountName,
        blog: AccountName,
        *other_blogs: AccountName,
    ) -> FollowOperation:
        """
        Clears specific or all follow/mute lists for the given blogs.

        Args:
            action: The type of list to reset (follow, mute, or both).
            working_account: The account performing the reset action.
            blog: The main blog account to reset the list for.
            other_blogs: Additional blog accounts to reset the list for.

        Returns:
            The FollowOperation instance.

        Raises:
            ToLongFollowingListError: If the number of blogs provided exceeds 100.
        """
        if action == EFollowBlogAction.FOLLOW_BLOG:
            return self._follow_body_builder(EFollowActions.RESET_FOLLOWING_LIST, working_account, blog, *other_blogs)
        if action == EFollowBlogAction.BOTH:
            self._follow_body_builder(EFollowActions.RESET_FOLLOWING_LIST, working_account, blog, *other_blogs)
            return self._follow_body_builder(EFollowActions.RESET_MUTED_LIST, working_account, blog, *other_blogs)
        if action == EFollowBlogAction.MUTE_BLOG:
            return self._follow_body_builder(EFollowActions.RESET_MUTED_LIST, working_account, blog, *other_blogs)
        return self

    def reblog(self, working_account: AccountName, author: AccountName, permlink: str) -> FollowOperation:
        """
        Creates an operation to reblog a specific post.

        Args:
            working_account: The account performing the reblog action.
            author: The author of the post to be reblogged.
            permlink: The permlink of the post to be reblogged.

        Returns:
            The FollowOperation instance.
        """
        self._body.append(ReblogOperationData(ReblogOperationDataItem(working_account, author, permlink)))

        return self

    def _follow_body_builder(
        self,
        what: EFollowActions,
        working_account: AccountName,
        blog: AccountName,
        *other_blogs: AccountName,
    ) -> FollowOperation:
        """
        Builds the body of the follow operation.

        Args:
            what: The follow action to be performed.
            working_account: The account performing the action.
            blog: The main blog account to target.
            other_blogs: Additional blog accounts to include.

        Returns:
            The FollowOperation instance.
        """
        following: list[AccountName] | AccountName = [blog, *other_blogs] if other_blogs else blog

        if isinstance(following, list) and len(following) > MAX_LIST_LENGTH:
            raise ToLongFollowingListError(MAX_LIST_LENGTH)

        self._body.append(FollowOperationData(FollowOperationDataItem(what, working_account, following)))
        return self
