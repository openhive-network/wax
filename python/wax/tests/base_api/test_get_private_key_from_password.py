from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

if TYPE_CHECKING:
    from wax.interfaces import IWaxBaseInterface


@pytest.mark.describe("Should be able to generate random private key using password")
def test_get_private_key_from_password(wax: IWaxBaseInterface) -> None:
    private_key = wax.get_private_key_from_password(
        account="gtg",
        role="active",
        password="verysecurepassword",  # noqa: S106
    )

    assert private_key.associated_public_key == "STM6JswFatSixhR9AMUP38rtpMVAagTvxGYu7d8i2JUK1QZDkPbH3"
    assert private_key.wif_private_key == "5J89tdX8b1wQJHcqDMDVn1UwvtiYFK53PQEgG5gL5oCEk83Us12"
