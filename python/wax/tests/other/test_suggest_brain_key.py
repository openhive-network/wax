from __future__ import annotations

import re

import wax

from wax_local_tools.consts import PRIVATE_KEY_PATTERN, PUBLIC_KEY_PATTERN


def test_suggest_brain_key() -> None:
    result = wax.suggest_brain_key()

    brain_priv_key = result.brain_key.split(" ")

    assert len(brain_priv_key) == 16
    assert re.match(PRIVATE_KEY_PATTERN, result.wif_private_key)
    assert re.match(PUBLIC_KEY_PATTERN, result.associated_public_key)
