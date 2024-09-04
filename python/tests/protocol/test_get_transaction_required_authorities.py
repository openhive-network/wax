from __future__ import annotations

import pytest
import json


from utils.refs import (
    API_REF_TRANSACTION,
    API_REF_WITNESS_SET_PROPERTIES_OP,
    API_REF_RECOVER_ACCOUNT_OP,
    API_REF_POW2_OP,
    API_REF_CUSTOM_BINARY_OP,
    API_REF_POW2_OP_OTHER_AUTHORITIES,
    API_REF_CUSTOM_BINARY_OP_OTHER_AUTHORITIES,
    API_REF_RECOVER_ACCOUNT_OP_OTHER_AUTHORITIES,
    API_REF_WITNESS_SET_PROPERTIES_OP_OTHER_AUTHORITIES,
)
from wax import get_transaction_required_authorities


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

@pytest.mark.parametrize(
    "operation, other_authorities",
    [
        (API_REF_POW2_OP, API_REF_POW2_OP_OTHER_AUTHORITIES),
        (API_REF_RECOVER_ACCOUNT_OP, API_REF_RECOVER_ACCOUNT_OP_OTHER_AUTHORITIES),
        (
            API_REF_WITNESS_SET_PROPERTIES_OP,
            API_REF_WITNESS_SET_PROPERTIES_OP_OTHER_AUTHORITIES,
        ),
        (API_REF_CUSTOM_BINARY_OP, API_REF_CUSTOM_BINARY_OP_OTHER_AUTHORITIES),
    ],
)
def test_other_authorities_field(operation, other_authorities):
    API_REF_TRANSACTION["operations"].append(operation)
    tx_str = json.dumps(API_REF_TRANSACTION)

    auths = get_transaction_required_authorities(transaction=tx_str.encode())

    assert auths.other_authorities == other_authorities
