from __future__ import annotations

import json
from typing import TYPE_CHECKING, Any

from google.protobuf.json_format import MessageToDict

if TYPE_CHECKING:
    from wax.hive_apps_operations.factory import HiveAppsOperation


def extract_operation_from_custom_json(op: HiveAppsOperation[Any]) -> list[Any]:
    """Get `json` field from the first element of the `ops` list converted to the list."""
    return [json.loads(MessageToDict(op)["json"]) for op in op.ops]
