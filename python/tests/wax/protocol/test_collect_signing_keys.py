from __future__ import annotations

from typing import Any

import json

import pytest

from wax import collect_signing_keys, python_authority, python_authorities
from tests.wax.utils.refs import (
    ACCOUNT_AUTHS,
    SIGNING_KEYS,
    API_TRX_SIG1,
    API_TRX_SIG5_v0,
    API_TRX_SIG5_v1,
    API_TRX_SIG5_v2,
)


def retrieve_authorities(account_names: list[str]) -> dict[str, python_authorities]:
    authorities_map: dict[str, python_authorities] = {}
    for account_name in account_names:
        print(f"python retrieve_authorities:account_name = '{account_name}'")
        auths = ACCOUNT_AUTHS[account_name]
        authorities_map[account_name] = auths
    print(f"python retrieve_authorities:authorities_map = {authorities_map}")
    return authorities_map


@pytest.mark.parametrize(
    "transaction, signing_keys",
    [
        (API_TRX_SIG1, SIGNING_KEYS["API_TRX_SIG1"]),
        (API_TRX_SIG5_v0, SIGNING_KEYS["API_TRX_SIG5_v0"]),
        (API_TRX_SIG5_v1, SIGNING_KEYS["API_TRX_SIG5_v1"]),
        (API_TRX_SIG5_v2, SIGNING_KEYS["API_TRX_SIG5_v2"]),
    ],
)
def test_collect_signing_keys(transaction: dict[str, Any], signing_keys: list[str]) -> None:
    tx_str = json.dumps(transaction)
    keys = collect_signing_keys(tx_str, retrieve_authorities)

    for key in keys:
        print(f"key: {key}")

    assert keys == signing_keys, "Signing keys are incorrect"
