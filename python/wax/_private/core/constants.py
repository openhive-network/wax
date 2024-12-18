from __future__ import annotations

from datetime import timedelta
from typing import Final

from wax._private.models.basic import ChainId

PUBLIC_KEY_ADDRESS_PREFIX: Final = "STM"

DEFAULT_TRANSACTION_EXPIRATION_TIME: Final = timedelta(minutes=1)
MAINNET_CHAIN_ID: Final = ChainId("beeab0de00000000000000000000000000000000000000000000000000000000")
DEFAULT_CHAIN_ID: Final = MAINNET_CHAIN_ID
