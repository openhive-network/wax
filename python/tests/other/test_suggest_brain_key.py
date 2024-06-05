from __future__ import annotations


import wax

from .consts import ENCODING, VALID_TRXS


def test_suggest_brain_key() -> None:
    result = wax.suggest_brain_key()
    # END BEFORE DEPLOY
