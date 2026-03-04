from __future__ import annotations

import pytest

from tests.wax.apps_operations.extract_operation_from_custom_json import (
    extract_operation_from_custom_json,
)
from wax.exceptions import WaxError
from wax.hive_apps_operations.follow import (
    EFollowActions,
    EFollowBlogAction,
    EFollowOperationActions,
    FollowOperation,
)


@pytest.mark.describe("FollowOperation.follow_blog should append correct structure")
def test_follow_blog() -> None:
    # Arrange
    working_account = "alice"
    blog = "bob"
    what = EFollowActions.FOLLOW
    expected = [
        [
            EFollowOperationActions.FOLLOW.value,
            {
                "follower": working_account,
                "following": blog,
                "what": [what.value],
            },
        ]
    ]

    # Act
    op = FollowOperation()
    op.follow_blog(working_account, blog).authorize("test_auth")

    # Assert
    assert extract_operation_from_custom_json(op) == expected


@pytest.mark.describe(
    "FollowOperation.follow_blog should raise WaxError on too many following"
)
def test_follow_blog_raises_too_many_followings() -> None:
    # Arrange
    working_account = "alice"

    too_many_blogs_count = 101  # max number is 100
    too_many_blogs = [f"user{i}" for i in range(too_many_blogs_count)]

    # Act & Assert
    with pytest.raises(WaxError, match="Too long following list"):
        FollowOperation().follow_blog(
            working_account, too_many_blogs[0], *too_many_blogs[1:]
        )


@pytest.mark.describe("FollowOperation.unfollow_blog should add unfollow action")
def test_unfollow_blog() -> None:
    # Arrange
    working_account = "alice"
    blog = "bob"
    expected = [
        [
            EFollowOperationActions.FOLLOW.value,
            {
                "follower": working_account,
                "following": blog,
                "what": [EFollowActions.UNFOLLOW.value],
            },
        ]
    ]

    # Act
    op = FollowOperation().unfollow_blog(working_account, blog).authorize("test_auth")

    # Assert
    assert extract_operation_from_custom_json(op) == expected


@pytest.mark.describe("FollowOperation.mute_blog should add mute action")
def test_mute_blog() -> None:
    # Arrange
    working_account = "alice"
    blog = "spammy_user"
    expected = [
        [
            EFollowOperationActions.FOLLOW.value,
            {
                "follower": working_account,
                "following": blog,
                "what": [EFollowActions.MUTE.value],
            },
        ]
    ]

    # Act
    op = FollowOperation().mute_blog(working_account, blog).authorize("test_auth")

    # Assert
    assert extract_operation_from_custom_json(op) == expected


@pytest.mark.describe("FollowOperation.unmute_blog should reuse unfollow_blog")
def test_unmute_blog() -> None:
    # Arrange
    working_account = "alice"
    blog = "spammy_user"
    expected = [
        [
            EFollowOperationActions.FOLLOW.value,
            {
                "follower": working_account,
                "following": blog,
                "what": [EFollowActions.UNFOLLOW.value],
            },
        ]
    ]

    # Act
    op = FollowOperation().unmute_blog(working_account, blog).authorize("test_auth")

    # Assert
    assert extract_operation_from_custom_json(op) == expected


@pytest.mark.describe(
    "FollowOperation.reset_blacklist_blog should add reset_blacklist action"
)
def test_reset_blacklist_blog() -> None:
    # Arrange
    working_account = "alice"
    blog = "bob"
    expected = [
        [
            EFollowOperationActions.FOLLOW.value,
            {
                "follower": working_account,
                "following": blog,
                "what": [EFollowActions.RESET_BLACKLIST.value],
            },
        ]
    ]

    # Act
    op = (
        FollowOperation()
        .reset_blacklist_blog(working_account, blog)
        .authorize("test_auth")
    )

    # Assert
    assert extract_operation_from_custom_json(op) == expected


@pytest.mark.describe("FollowOperation.reblog should append reblog data")
def test_reblog() -> None:
    # Arrange
    working_account = "alice"
    author = "bob"
    permlink = "my-first-post"

    expected = [
        [
            EFollowOperationActions.REBLOG.value,
            {
                "account": working_account,
                "author": author,
                "permlink": permlink,
            },
        ]
    ]

    # Act
    op = (
        FollowOperation()
        .reblog(working_account, author, permlink)
        .authorize("test_auth")
    )

    # Assert
    assert extract_operation_from_custom_json(op) == expected


@pytest.mark.describe(
    "FollowOperation.reset_blog_list should handle different EFollowBlogAction values"
)
@pytest.mark.parametrize(
    "action, expected_what_values",  # NOQA: PT006
    [
        (EFollowBlogAction.FOLLOW_BLOG, [EFollowActions.RESET_FOLLOWING_LIST.value]),
        (EFollowBlogAction.MUTE_BLOG, [EFollowActions.RESET_MUTED_LIST.value]),
        (
            EFollowBlogAction.BOTH,
            [
                EFollowActions.RESET_FOLLOWING_LIST.value,
                EFollowActions.RESET_MUTED_LIST.value,
            ],
        ),
    ],
)
def test_reset_blog_list(
    action: EFollowBlogAction, expected_what_values: list[EFollowActions]
) -> None:
    # Arrange
    working_account = "alice"
    blog = "bob"

    # Act
    op = (
        FollowOperation()
        .reset_blog_list(action, working_account, blog)
        .authorize("test_auth")
    )

    # Assert
    operations = extract_operation_from_custom_json(op)
    for idx, expected_what in enumerate(expected_what_values):
        assert operations[idx][1]["what"] == [expected_what]
