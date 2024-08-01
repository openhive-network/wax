from __future__ import annotations

import json

from utils.checkers import check_transaction

from wax import collect_signing_keys
from utils.refs import API_TRX_SIG1, API_TRX_SIG1_AUTHORITIES

ACCOUNT_AUTHS = {
    API_TRX_SIG1_AUTHORITIES["account_name"]: {
        "active": API_TRX_SIG1_AUTHORITIES["authorities"]["active"],
        "owner": API_TRX_SIG1_AUTHORITIES["authorities"]["owner"],
        "posting": API_TRX_SIG1_AUTHORITIES["authorities"]["posting"],
    }
}

def retrieve_authorities(account_names: list[bytes]) -> map[bytes, list[bytes]]:
    authorities = {}
    for account_name in account_names:
        print(f"python retrieve_authorities:account_name = '{account_name.decode()}'")
        auths = ACCOUNT_AUTHS[account_name.decode()]
        authsb = []
        active = json.dumps(auths["active"]).encode()
        owner = json.dumps(auths["owner"]).encode()
        posting = json.dumps(auths["posting"]).encode()
        authsb.append(active)
        authsb.append(owner)
        authsb.append(posting)
        authorities[account_name] = authsb
    return authorities

def test_collect_signing_keys():
    tx_str = json.dumps(API_TRX_SIG1)
    keys = collect_signing_keys(tx_str.encode(), retrieve_authorities)

    for key in keys:
        print(f"key: {key}")
