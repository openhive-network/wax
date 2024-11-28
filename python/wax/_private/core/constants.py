from __future__ import annotations

from math import floor, log10
from typing import Final

PUBLIC_KEY_ADDRESS_PREFIX: Final[str] = "STM"

HIVE_PERCENT_PRECISION: Final[int] = 100
HIVE_PERCENT_PRECISION_DOT_PLACES: Final[int] = floor(log10(HIVE_PERCENT_PRECISION))
