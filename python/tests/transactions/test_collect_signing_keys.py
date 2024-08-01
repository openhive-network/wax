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

def retrieve_authorities(account_name: bytes) -> list[bytes]:
    account_name = account_name.decode()
    print(f"python retrieve_authorities:account_name = '{account_name}'")
    auths = ACCOUNT_AUTHS[account_name]
    authorities = []
    active = json.dumps(auths["active"]).encode()
    owner = json.dumps(auths["owner"]).encode()
    posting = json.dumps(auths["posting"]).encode()
    print(f"python retrieve_authorities:active = {active}")
    print(f"python retrieve_authorities:owner = {owner}")
    print(f"python retrieve_authorities:posting = {posting}")
    authorities.append(active)
    authorities.append(owner)
    authorities.append(posting)
    return authorities

def test_collect_signing_keys():
    tx_str = json.dumps(API_TRX_SIG1)
    keys = collect_signing_keys(tx_str.encode(), retrieve_authorities)

    print(f"test_collect_signing_keys len(keys) = {len(keys)}")
    for key in keys:
        print(f"key: {key}")
