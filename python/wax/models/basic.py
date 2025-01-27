from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, TypeAlias

if TYPE_CHECKING:
    from wax._private.models.hive_date_time import HiveDateTime

AccountName: TypeAlias = str
Hex: TypeAlias = str
ChainId: TypeAlias = Hex
TransactionId: TypeAlias = Hex
SigDigest: TypeAlias = Hex
Signature: TypeAlias = Hex
HeadBlockId: TypeAlias = Hex
PublicKey: TypeAlias = str


@dataclass
class ChainReferenceData:
    """Data that is used to reference the chain."""

    time: HiveDateTime
    head_block_id: HeadBlockId = ""
