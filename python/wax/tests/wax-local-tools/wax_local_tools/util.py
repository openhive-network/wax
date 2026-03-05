from __future__ import annotations

from typing import Any


def get_proto_operation_name(operation: dict[str, Any]) -> str:
    """
    Get the name of the operation from the operation dict.

    Example:
    -------
    operation = {
        "comment_operation": {
            "parent_permlink": "/",
            "author": "alice",
            "permlink": "/",
            "title": "Best comment",
            "body": "<span>comment</span>",
            "json_metadata": "{}"
        }
    }

    get_proto_operation_name(operation) -> "comment_operation"
    """
    return next(iter(operation))
