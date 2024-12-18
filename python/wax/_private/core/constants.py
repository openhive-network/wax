from __future__ import annotations

from datetime import timedelta
from math import floor, log10
from typing import Final

from wax._private.models.basic import ChainId

PUBLIC_KEY_ADDRESS_PREFIX: Final[str] = "STM"

DEFAULT_TRANSACTION_EXPIRATION_TIME: Final[timedelta] = timedelta(minutes=1)
MAINNET_CHAIN_ID: Final[ChainId] = ChainId("beeab0de00000000000000000000000000000000000000000000000000000000")
DEFAULT_CHAIN_ID: Final[ChainId] = MAINNET_CHAIN_ID

HIVE_PERCENT_PRECISION: Final[int] = 100
HIVE_PERCENT_PRECISION_DOT_PLACES: Final[int] = floor(log10(HIVE_PERCENT_PRECISION))
