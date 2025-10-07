from __future__ import annotations

from wax.proto.transaction import transaction as proto_transaction

type ProtoTransaction = proto_transaction
"""Type alias for a transaction in proto format."""
type JsonTransaction = str
"""Type alias for a transaction in JSON format, which is used in Hive API calls."""

__all__ = [
    "JsonTransaction",
    "proto_transaction",
    "ProtoTransaction",
]
