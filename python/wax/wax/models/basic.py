from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, TypeAlias

if TYPE_CHECKING:
    from wax._private.models.hive_date_time import HiveDateTime

AccountName: TypeAlias = str
"""AccountName is a type alias for the name of an account on the Hive blockchain."""
Hex: TypeAlias = str
"""Hex is a type alias for a hexadecimal string."""
ChainId: TypeAlias = Hex
"""ChainId is a type alias for the chain identifier of the Hive blockchain."""
TransactionId: TypeAlias = Hex
"""TransactionId is a type alias for the identifier of a transaction."""
SigDigest: TypeAlias = Hex
"""SigDigest is a type alias for the signature digest of a transaction."""
Signature: TypeAlias = Hex
"""Signature is a type alias for a hexadecimal string representing a signature."""
HeadBlockId: TypeAlias = Hex
"""HeadBlockId is a type alias for the identifier of the head block."""
PublicKey: TypeAlias = str
"""PublicKey is a type alias for a public key in the Hive blockchain."""


@dataclass
class ChainReferenceData:
    """Data that is used to reference the chain."""

    time: HiveDateTime
    head_block_id: HeadBlockId = ""
