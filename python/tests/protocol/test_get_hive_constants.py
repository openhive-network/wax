from __future__ import annotations

from wax import get_hive_constants
from utils.refs import MAINNET_CHAIN_ID, TREASURY_NAME


def test_get_hive_constants() -> None:
    result = get_hive_constants(TREASURY_NAME, MAINNET_CHAIN_ID)
    print(result)
