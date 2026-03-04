from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

if TYPE_CHECKING:
    from wax.interfaces import IWaxBaseInterface


@pytest.mark.describe("Should be able to suggest brain key")
def test_suggest_brain_key(wax: IWaxBaseInterface) -> None:
    brain_key_data = wax.suggest_brain_key()

    assert len(brain_key_data.associated_public_key) == 53
    assert isinstance(brain_key_data.associated_public_key, str)

    assert len(brain_key_data.brain_key.split(" ")) == 16
    assert isinstance(brain_key_data.brain_key, str)

    assert len(brain_key_data.wif_private_key) == 51
    assert isinstance(brain_key_data.wif_private_key, str)
