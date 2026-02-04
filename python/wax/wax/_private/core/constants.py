from __future__ import annotations

from datetime import timedelta
from math import floor, log10
from typing import TYPE_CHECKING, Final

from beekeepy.interfaces import HttpUrl

if TYPE_CHECKING:
    from wax.models.basic import ChainId


PUBLIC_KEY_ADDRESS_PREFIX: Final[str] = "STM"

DEFAULT_ENDPOINT_URL: Final[HttpUrl] = HttpUrl("api.hive.blog", protocol="https")
DEFAULT_TRANSACTION_EXPIRATION_TIME: Final[timedelta] = timedelta(minutes=1)
MAINNET_CHAIN_ID: Final[ChainId] = "beeab0de00000000000000000000000000000000000000000000000000000000"
DEFAULT_CHAIN_ID: Final[ChainId] = MAINNET_CHAIN_ID

HIVE_PERCENT_PRECISION: Final[int] = 100
HIVE_PERCENT_PRECISION_DOT_PLACES: Final[int] = floor(log10(HIVE_PERCENT_PRECISION))

HIVE_TIME_FORMAT: Final[str] = "%Y-%m-%dT%H:%M:%S"
