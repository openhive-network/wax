from __future__ import annotations

from wax_local_tools.extract_operation_from_custom_json import (
    extract_operation_from_custom_json,
)
from wax.hive_apps_operations.community import (
    CommunityOperation,
    CommunityProps,
    ECommunityOperationActions,
    ESupportedLanguages,
)


def test_flag_post() -> None:
    # Arrange
    community = "test-community"
    account = "user1"
    permlink = "test-post"
    notes = "Inappropriate content"

    expected = [
        [
            ECommunityOperationActions.FLAG_POST.value,
            {
                "community": community,
                "account": account,
                "permlink": permlink,
                "notes": notes,
            },
        ]
    ]

    # Act
    op = (
        CommunityOperation()
        .flag_post(community, account, permlink, notes)
        .authorize("test_auth")
    )

    # Assert
    assert extract_operation_from_custom_json(op) == expected


def test_set_role() -> None:
    # Arrange
    community = "test-community"
    account = "mod-user"

    expected = [
        [
            ECommunityOperationActions.SET_ROLE.value,
            {"community": community, "account": account, "role": "mod"},
        ]
    ]

    # Act
    op = CommunityOperation().set_role(community, account, "mod").authorize("test_auth")

    # Assert
    assert extract_operation_from_custom_json(op) == expected


def test_set_user_title() -> None:
    # Arrange
    community = "test-community"
    account = "user123"
    title = "Expert"

    expected = [
        [
            ECommunityOperationActions.SET_USER_TITLE.value,
            {"community": community, "account": account, "title": title},
        ]
    ]

    # Act
    op = (
        CommunityOperation()
        .set_user_title(community, account, title)
        .authorize("test_auth")
    )

    # Assert
    assert extract_operation_from_custom_json(op) == expected


def test_subscribe() -> None:
    # Arrange
    community = "awesome-community"

    expected = [[ECommunityOperationActions.SUBSCRIBE.value, {"community": community}]]

    # Act
    op = CommunityOperation().subscribe(community).authorize("test_auth")

    # Assert
    assert extract_operation_from_custom_json(op) == expected


def test_unsubscribe() -> None:
    # Arrange
    community = "boring-community"

    expected = [
        [ECommunityOperationActions.UNSUBSCRIBE.value, {"community": community}]
    ]

    # Act
    op = CommunityOperation().unsubscribe(community).authorize("test_auth")

    # Assert
    assert extract_operation_from_custom_json(op) == expected


def test_pin_post() -> None:
    # Arrange
    community = "test-community"
    account = "mod"
    permlink = "top-post"

    expected = [
        [
            ECommunityOperationActions.PIN_POST.value,
            {"community": community, "account": account, "permlink": permlink},
        ]
    ]

    # Act
    op = (
        CommunityOperation()
        .pin_post(community, account, permlink)
        .authorize("test_auth")
    )

    # Assert
    assert extract_operation_from_custom_json(op) == expected


def test_unpin_post() -> None:
    # Arrange
    community = "test-community"
    account = "mod"
    permlink = "top-post"

    expected = [
        [
            ECommunityOperationActions.UNPIN_POST.value,
            {"community": community, "account": account, "permlink": permlink},
        ]
    ]

    # Act
    op = (
        CommunityOperation()
        .unpin_post(community, account, permlink)
        .authorize("test_auth")
    )

    # Assert
    assert extract_operation_from_custom_json(op) == expected


def test_mute_post() -> None:
    # Arrange
    community = "test-community"
    account = "spammer"
    permlink = "spam-post"
    notes = "Spam content"

    expected = [
        [
            ECommunityOperationActions.MUTE_POST.value,
            {
                "community": community,
                "account": account,
                "permlink": permlink,
                "notes": notes,
            },
        ]
    ]

    # Act
    op = (
        CommunityOperation()
        .mute_post(community, account, permlink, notes)
        .authorize("test_auth")
    )

    # Assert
    assert extract_operation_from_custom_json(op) == expected


def test_unmute_post() -> None:
    # Arrange
    community = "test-community"
    account = "user"
    permlink = "mistake-post"
    notes = "Reconsidered"

    expected = [
        [
            ECommunityOperationActions.UNMUTE_POST.value,
            {
                "community": community,
                "account": account,
                "permlink": permlink,
                "notes": notes,
            },
        ]
    ]

    # Act
    op = (
        CommunityOperation()
        .unmute_post(community, account, permlink, notes)
        .authorize("test_auth")
    )

    # Assert
    assert extract_operation_from_custom_json(op) == expected


def test_update_props() -> None:
    # Arrange
    community = "new-community"
    props = CommunityProps(
        title="New Title",
        about="About section",
        is_nsfw=True,
        lang=ESupportedLanguages.POLISH,
        description="Description",
        flag_text="Flag this content",
    )

    expected = [
        [
            ECommunityOperationActions.UPDATE_PROPS.value,
            {
                "community": community,
                "props": {
                    "title": "New Title",
                    "about": "About section",
                    "description": "Description",
                    "flag_text": "Flag this content",
                    "is_nsfw": True,
                    "lang": "pl",
                },
            },
        ]
    ]

    # Act
    op = CommunityOperation().update_props(community, props).authorize("test_auth")

    # Assert
    assert extract_operation_from_custom_json(op) == expected
