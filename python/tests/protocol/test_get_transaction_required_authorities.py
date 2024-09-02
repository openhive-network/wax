from __future__ import annotations

import pytest
import json

from typing import TYPE_CHECKING, Final

from utils.refs import API_REF_TRANSACTION
from wax import get_transaction_required_authorities, python_required_authority_collection


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



