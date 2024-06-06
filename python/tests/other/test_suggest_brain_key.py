from __future__ import annotations

import wax

from .consts import PRIVATE_KEY_PATTERN, PUBLIC_KEY_PATTERN

import re


def test_suggest_brain_key() -> None:
    result = wax.suggest_brain_key()

    brain_priv_key = result.brain_key.decode().split(" ")

    assert len(brain_priv_key) == 16
    assert re.match(PRIVATE_KEY_PATTERN, result.wif_private_key.decode())
    assert re.match(PUBLIC_KEY_PATTERN, result.associated_public_key.decode())
