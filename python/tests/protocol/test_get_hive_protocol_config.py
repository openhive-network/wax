from __future__ import annotations

from wax import get_hive_protocol_config
from utils.refs import MAINNET_CHAIN_ID, TREASURY_NAME


def test_get_hive_constants() -> None:
    result = get_hive_protocol_config(TREASURY_NAME, MAINNET_CHAIN_ID)
    assert result[b"HBD_SYMBOL"] == b"@@000000013"
    assert result[b"HIVE_100_PERCENT"] == b"10000"
    assert result[b"HIVE_INIT_PUBLIC_KEY"] == b"STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX"
    print(result)
