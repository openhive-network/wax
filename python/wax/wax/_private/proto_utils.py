"""
Protobuf utilities for handling proto2 message serialization.

In protobuf 6.x, the `including_default_value_fields` parameter was removed from
MessageToJson/MessageToDict. The replacement `always_print_fields_with_no_presence`
doesn't work for proto2 messages where all fields have presence semantics.

This module provides functions that serialize proto2 messages with all default values included.
"""

from __future__ import annotations

import json
import warnings
from typing import TYPE_CHECKING

from google.protobuf import descriptor
from google.protobuf.json_format import MessageToDict

# Suppress protobuf's internal deprecation warning about label()
# This warning comes from protobuf library internals, not our code
warnings.filterwarnings("ignore", message="label\\(\\) is deprecated", category=DeprecationWarning)

if TYPE_CHECKING:
    from google.protobuf.message import Message

# Type alias for JSON-serializable values
JsonValue = bool | int | float | str | list[object] | dict[str, object]

# Mapping from protobuf field types to their default values
_FIELD_TYPE_DEFAULTS: dict[int, JsonValue] = {
    descriptor.FieldDescriptor.TYPE_MESSAGE: {},
    descriptor.FieldDescriptor.TYPE_STRING: "",
    descriptor.FieldDescriptor.TYPE_BYTES: "",
    descriptor.FieldDescriptor.TYPE_BOOL: False,
    descriptor.FieldDescriptor.TYPE_DOUBLE: 0.0,
    descriptor.FieldDescriptor.TYPE_FLOAT: 0.0,
}


def _is_map_field(field: descriptor.FieldDescriptor) -> bool:
    """Check if field is a map field (map<K, V> in proto)."""
    if field.type != descriptor.FieldDescriptor.TYPE_MESSAGE:
        return False
    if not field.is_repeated:  # type: ignore[attr-defined]
        return False
    # Map fields have a special message_type with map_entry option set
    msg_type = field.message_type
    if msg_type is None:
        return False
    return bool(msg_type.GetOptions().map_entry)


def _get_default_value(field: descriptor.FieldDescriptor) -> JsonValue:
    """Get the default value for a protobuf field."""
    if _is_map_field(field):
        return {}
    if field.is_repeated:  # type: ignore[attr-defined]
        return []
    # Use the field's actual default value if it has one (proto2 allows explicit defaults)
    if field.has_default_value:
        default = field.default_value
        # Handle bytes -> string conversion for JSON
        if field.type == descriptor.FieldDescriptor.TYPE_BYTES and isinstance(default, bytes):
            return default.decode("utf-8", errors="replace")
        # default_value can be various types (bool, int, float, str, bytes, enum)
        # Cast to JsonValue to satisfy type checker
        if isinstance(default, (bool, int, float, str)):
            return default
        # For enum values, return as int
        return int(default)
    return _FIELD_TYPE_DEFAULTS.get(field.type, 0)


def _get_field_json_name(field: descriptor.FieldDescriptor) -> str:
    """Get the JSON name for a field, falling back to the field name."""
    return str(getattr(field, "json_name", None) or field.name)


def _is_singular_message_field(field: descriptor.FieldDescriptor) -> bool:
    """Check if field is a singular (non-repeated, non-map) message type."""
    if field.type != descriptor.FieldDescriptor.TYPE_MESSAGE:
        return False
    return not field.is_repeated  # type: ignore[attr-defined]


def _is_oneof_field_set(message: Message, field: descriptor.FieldDescriptor) -> bool:
    """Check if a oneof field is the one that's currently set."""
    oneof = field.containing_oneof
    if oneof is None:
        return True  # Not a oneof field, always process
    # Check which field in the oneof is set
    set_field_name = message.WhichOneof(oneof.name)
    return bool(set_field_name == field.name)


def _is_field_set(message: Message, field: descriptor.FieldDescriptor) -> bool:
    """Check if a field is actually set in the proto message."""
    # For repeated fields (including maps), check if not empty
    if field.is_repeated:  # type: ignore[attr-defined]
        return bool(getattr(message, field.name, None))
    # For singular message fields in proto2, use HasField
    if field.type == descriptor.FieldDescriptor.TYPE_MESSAGE:
        try:
            return bool(message.HasField(field.name))
        except ValueError:
            # HasField raises ValueError for fields in a oneof that isn't set
            return False
    # For scalar fields, they're always "set" in terms of serialization
    return True


def _process_missing_field(message: Message, field: descriptor.FieldDescriptor, result: dict[str, object]) -> None:
    """Add default value for a missing field."""
    # Skip oneof fields that are not set - only the set field should be present
    if not _is_oneof_field_set(message, field):
        return

    field_name = _get_field_json_name(field)
    if _is_singular_message_field(field):
        # Only add nested message if it's actually set in the proto
        if _is_field_set(message, field):
            nested_message = getattr(message, field.name, None)
            if nested_message is not None and hasattr(nested_message, "DESCRIPTOR"):
                result[field_name] = _ensure_all_fields_recursive(nested_message, {})
            else:
                result[field_name] = {}
        # Don't add anything for unset message fields
    else:
        result[field_name] = _get_default_value(field)


def _process_existing_message_field(
    message: Message, field: descriptor.FieldDescriptor, result: dict[str, object]
) -> None:
    """Recursively process an existing message field."""
    # Skip map fields - they don't contain nested proto messages that need processing
    if _is_map_field(field):
        return

    field_name = _get_field_json_name(field)
    if field.is_repeated:  # type: ignore[attr-defined]
        nested_messages = getattr(message, field.name, [])
        field_value = result[field_name]
        if isinstance(field_value, list):
            for i, (nested_msg, nested_dict) in enumerate(zip(nested_messages, field_value, strict=False)):
                if hasattr(nested_msg, "DESCRIPTOR") and isinstance(nested_dict, dict):
                    field_value[i] = _ensure_all_fields_recursive(nested_msg, nested_dict)
    else:
        nested_message = getattr(message, field.name, None)
        field_value = result[field_name]
        if nested_message is not None and hasattr(nested_message, "DESCRIPTOR") and isinstance(field_value, dict):
            result[field_name] = _ensure_all_fields_recursive(nested_message, field_value)


def _ensure_all_fields_recursive(message: Message, result: dict[str, object]) -> dict[str, object]:
    """Recursively ensure all fields are present in the dict, adding defaults for missing ones."""
    for field in message.DESCRIPTOR.fields:
        field_name = _get_field_json_name(field)

        if field_name not in result:
            _process_missing_field(message, field, result)
        elif field.type == descriptor.FieldDescriptor.TYPE_MESSAGE:
            _process_existing_message_field(message, field, result)

    return result


def message_to_dict_with_defaults(message: Message) -> dict[str, object]:
    """
    Convert protobuf message to dict with all fields including defaults.

    This is needed for proto2 messages where always_print_fields_with_no_presence
    doesn't include fields with presence semantics (which is all proto2 fields).
    """
    result = MessageToDict(message, always_print_fields_with_no_presence=True)
    return _ensure_all_fields_recursive(message, result)


def message_to_json_with_defaults(message: Message) -> str:
    """
    Convert protobuf message to JSON with all fields including defaults.

    This is needed for proto2 messages where always_print_fields_with_no_presence
    doesn't include fields with presence semantics (which is all proto2 fields).
    """
    return json.dumps(message_to_dict_with_defaults(message))
