from __future__ import annotations

import pytest
import json

from typing import TYPE_CHECKING, Final

from utils.refs import API_REF_TRANSACTION
from wax import get_transaction_required_authorities, python_authority, python_required_authority_collection


def test_get_transaction_required_autorities():
    tx_str = json.dumps(API_REF_TRANSACTION)
    #print(f"tx: {tx_str}")

    #print(f"get_transaction_required_authorities: {get_transaction_required_authorities}")

    auths = get_transaction_required_authorities( transaction = tx_str.encode() )

    other_auth_length = len(auths.other_authorities)

    assert len(auths.posting_accounts) == 1
    assert len(auths.active_accounts) == 0
    assert len(auths.owner_accounts) == 0
    assert other_auth_length == 0

    posting_auths = b','.join(auths.posting_accounts)
    active_auths = b','.join(auths.active_accounts)
    owner_auths = b','.join(auths.owner_accounts)

    assert posting_auths == b'taoteh1221'

    if( len(posting_auths) != 0 ):
      print(f"Required posting authorities: {posting_auths}")

    if( len(active_auths) != 0 ):
      print(f"Required active authorities: {active_auths}")

    if( len(owner_auths) != 0 ):
      print(f"Required owner authorities: {owner_auths}")

    if (other_auth_length != 0):
      print(f"Required other authorities: {other_auth_length}")


def test_verify_testcase_with_bug_is_work_correctly():
    """
    Bug description: https://gitlab.syncad.com/hive/wax/-/issues/37
    """
    trx = {
        "ref_block_num": 36,
        "ref_block_prefix": 2180018243,
        "expiration": "2024-04-24T08:30:15",
        "extensions": [],
        "signatures": [],
        "operations": [
            {
                "type": "recover_account_operation",
                "value": {
                    "account_to_recover": "bob",
                    "new_owner_authority": {
                        "weight_threshold": 1,
                        "account_auths": [],
                        "key_auths": [
                            ["STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW", 1]
                        ],
                    },
                    "recent_owner_authority": {
                        "weight_threshold": 1,
                        "account_auths": [],
                        "key_auths": [
                            ["STM4wJYLcRnALfbpb4ziqiH3oLEgw9PTJZTBBj8goFyjta3mm6D1s", 1]
                        ],
                    },
                    "extensions": [],
                },
            }
        ],
    }

    auths = get_transaction_required_authorities(transaction=json.dumps(trx).encode())

    assert auths.active_accounts == set()
    assert auths.owner_accounts == set()
    assert auths.other_authorities == [
        python_authority(
            weight_threshold=1,
            account_auths={},
            key_auths={b"STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW": 1},
        ),
        python_authority(
            weight_threshold=1,
            account_auths={},
            key_auths={b"STM4wJYLcRnALfbpb4ziqiH3oLEgw9PTJZTBBj8goFyjta3mm6D1s": 1},
        ),
    ]
