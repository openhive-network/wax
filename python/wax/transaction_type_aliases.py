from __future__ import annotations

from typing import TypeAlias

from wax.proto.transaction import transaction as proto_transaction

ProtoTransaction: TypeAlias = proto_transaction
"""Type alias for a transaction in proto format."""
JsonTransaction: TypeAlias = str
"""Type alias for a transaction in JSON format, which is used in Hive API calls."""

__all__ = [
    "JsonTransaction",
    "proto_transaction",
    "ProtoTransaction",
]
