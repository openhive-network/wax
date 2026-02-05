from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

if TYPE_CHECKING:
    from wax.interfaces import IWaxBaseInterface


@pytest.mark.parametrize(
    "valid_account_name",
    [
        "aaa",
        "a0a",
        "a-a",
        "aa0",
        "a00",
        "a-0",
        "aaa-bbb-ccc",
        "aaa-bbb.ccc",
        "aaa.bbb-ccc",
        "aaa.bbb.ccc",
        "aaa--bbb--ccc",
        "xn--san-p8a.dex",
        "xn-san-p8a.dex",
        "this-label-has",
    ],
)
@pytest.mark.describe("Should be able to validate valid account names")
def test_is_valid_account_name_0(
    wax: IWaxBaseInterface, valid_account_name: str
) -> None:
    assert wax.is_valid_account_name(account_name=valid_account_name)


@pytest.mark.parametrize(
    "invalid_account_name",
    [
        "a",
        "A",
        "0",
        ".",
        "-",
        "aa",
        "aA",
        "a0",
        "a.",
        "a-",
        "aAa",
        "a.a",
        "aA0",
        "a.0",
        "aaa,bbb-ccc",
        "aaa_bbb-ccc",
        "aaa-BBB-ccc",
        "1aaa-bbb",
        "-aaa-bbb-ccc",
        ".aaa-bbb-ccc",
        "/aaa-bbb-ccc",
        "aaa-bbb-ccc-",
        "aaa-bbb-ccc.",
        "aaa-bbb-ccc..",
        "aaa-bbb-ccc/",
        "aaa..bbb-ccc",
        "xn--san-p8a.de",
        "xn-san-p8a.de",
        "this-label-has-more-than-63-char.act.ers-64-to-be-really-precise",
        "none.of.these.labels.has.more.than-63.chars--but.still.not.valid",
    ],
)
@pytest.mark.describe("Should be able to validate invalid account names")
def test_is_valid_account_name_1(
    wax: IWaxBaseInterface, invalid_account_name: str
) -> None:
    assert not wax.is_valid_account_name(account_name=invalid_account_name)
