from __future__ import annotations

import pytest

import wax

from .consts import VALID_TRX_ID_WITH_TRANSACTIONS


@pytest.mark.parametrize("trx_id", list(VALID_TRX_ID_WITH_TRANSACTIONS))
def test_proper_transaction_id(trx_id: str) -> None:
    result = wax.calculate_transaction_id(VALID_TRX_ID_WITH_TRANSACTIONS[trx_id])
    assert result.status == wax.python_error_code.ok
    assert not result.exception_message
    assert result.result == trx_id
