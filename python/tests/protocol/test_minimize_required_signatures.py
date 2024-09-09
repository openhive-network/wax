from __future__ import annotations

from typing import Any

import json

import pytest

from wax import minimize_required_signatures, python_authority, python_authorities, python_minimize_required_signatures_data
from utils.refs import (
    ACCOUNT_AUTHS,
    API_TRX_SIG1,
    API_TRX_SIG5_v0,
    API_TRX_SIG5_v1,
    API_TRX_SIG5_v2,
)


AVAILABLE_KEYS: Final[list[bytes]] = [
    b"STM5zw6KDtQiiJMhkdkFm8CXxPUEa2QyitHBhkCE1iMJEGmEfd5aE",
    b"STM574A9CiTg3EkcsZ7VfXin8tVtFVWqGq5x2wrfoqv5yMfxvx96d",
    b"STM57hDwzvNYEYfL4wLj9REhaRgiNxdFt232SxVzPwZYPqiH2ZfNW",
    b"STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
    b"STM5khoFYgEg8Mvh989JmXLhgEgwAF78nPRr2xppQgafzWCXe2krQ",
    b"STM62fkRnTJSeJoWMLS5r61cgQbxSo3JJ7BoxCgZrkfRuNN71hA1A",
    b"STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
    b"STM64peLPcuSsUk591okRGUwv5rsTadSnnqi9ddMZhrVkxkDaSUzo",
    b"STM6v5nwZYvAmyZZUoSdjJvgJ3FwiDHdKuWsAaB4zx3qhuhdyy76s",
    b"STM7KDcjUNMqUdohFu9iYjCAqYEyXfM7pjNLx96GhRNpdYscB3aQc",
    b"STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
    b"STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43",
    b"STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
]

SIGNING_KEYS: Final[dict[str, list[bytes]]] = {
    "API_TRX_SIG1": [b"STM5zw6KDtQiiJMhkdkFm8CXxPUEa2QyitHBhkCE1iMJEGmEfd5aE"],
    "API_TRX_SIG5_v0": [
        b'STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR',
        b'STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK',
        b'STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP',
        b'STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43',
        b'STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd',
    ],
    "API_TRX_SIG5_v1": [
        b'STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR',
        b'STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK',
        b'STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP',
        b'STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43',
        b'STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd',
    ],
    "API_TRX_SIG5_v2": [
        b'STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR',
        b'STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK',
        b'STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP',
        b'STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43',
        b'STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd',
    ],
}

def get_witness_key(account_name: bytes) -> bytes:
    print(f"get_witness_key: {account_name}")
    return b""

MINIMIZE_REQUIRED_SIGNATURES_DATA = python_minimize_required_signatures_data(
    chain_id=b"beeab0de00000000000000000000000000000000000000000000000000000000",
    available_keys=AVAILABLE_KEYS,
    authorities_map=ACCOUNT_AUTHS,
    get_witness_key=get_witness_key,
)


@pytest.mark.parametrize(
    "transaction, signing_keys",
    [
        (API_TRX_SIG1, SIGNING_KEYS["API_TRX_SIG1"]),
        (API_TRX_SIG5_v0, SIGNING_KEYS["API_TRX_SIG5_v0"]),
        (API_TRX_SIG5_v1, SIGNING_KEYS["API_TRX_SIG5_v1"]),
        (API_TRX_SIG5_v2, SIGNING_KEYS["API_TRX_SIG5_v2"]),
    ],
)
def test_minimize_required_signatures(transaction: dict, signing_keys: list) -> None:
    tx_str = json.dumps(transaction)
    keys = minimize_required_signatures(tx_str.encode(), MINIMIZE_REQUIRED_SIGNATURES_DATA)

    for key in keys:
        print(f"key: {key}")

    assert keys == signing_keys, "Signing keys are incorrect"
