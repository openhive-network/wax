from __future__ import annotations

from typing import Any

import json

import pytest

from wax import collect_signing_keys, python_authority, python_authorities
from utils.refs import (
    API_TRX_SIG1,
    API_TRX_SIG5_v0,
    API_TRX_SIG5_v1,
    API_TRX_SIG5_v2,
    API_TRX_SIG1_AUTHORITIES,
    API_TRX_SIG5_AUTHORITIES_0,
    API_TRX_SIG5_AUTHORITIES_1,
    API_TRX_SIG5_AUTHORITIES_2,
    API_TRX_SIG5_AUTHORITIES_3,
    API_TRX_SIG5_AUTHORITIES_4,
    API_TRX_SIG5_AUTHORITIES_5,
    API_TRX_SIG5_AUTHORITIES_6,
    API_TRX_SIG5_AUTHORITIES_7,
    API_TRX_SIG5_AUTHORITIES_8,
    API_TRX_SIG5_AUTHORITIES_9,
    API_TRX_SIG5_AUTHORITIES_10,
    API_TRX_SIG5_AUTHORITIES_11,
)


ACCOUNT_AUTHS = [
    API_TRX_SIG1_AUTHORITIES,
    API_TRX_SIG5_AUTHORITIES_0,
    API_TRX_SIG5_AUTHORITIES_1,
    API_TRX_SIG5_AUTHORITIES_2,
    API_TRX_SIG5_AUTHORITIES_3,
    API_TRX_SIG5_AUTHORITIES_4,
    API_TRX_SIG5_AUTHORITIES_5,
    API_TRX_SIG5_AUTHORITIES_6,
    API_TRX_SIG5_AUTHORITIES_7,
    API_TRX_SIG5_AUTHORITIES_8,
    API_TRX_SIG5_AUTHORITIES_9,
    API_TRX_SIG5_AUTHORITIES_10,
    API_TRX_SIG5_AUTHORITIES_11,
]


def list_to_dict(l: list[Any]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for ll in l:
        result[ll[0]] = ll[1]
    return result


def to_python_authority(account_authority: dict[str, Any]) -> python_authority:
    result = python_authority(weight_threshold=account_authority["weight_threshold"],
                              account_auths=list_to_dict(account_authority["account_auths"]),
                              key_auths=list_to_dict(account_authority["key_auths"]),
                             )
    return result


def to_python_authorities(account_authorities: dict[str, Any]) -> python_authorities:
    result = python_authorities(active=to_python_authority(account_authorities["active"]),
                                owner=to_python_authority(account_authorities["owner"]),
                                posting=to_python_authority(account_authorities["posting"]),
                               )
    return result


ACCOUNT_AUTHS: dict[str, python_authorities] = {
    account_auth["account_name"]: to_python_authorities(account_auth["authorities"])
    for account_auth in ACCOUNT_AUTHS
}


SIGNING_KEYS = {
    "API_TRX_SIG1": [b"STM5zw6KDtQiiJMhkdkFm8CXxPUEa2QyitHBhkCE1iMJEGmEfd5aE"],
    "API_TRX_SIG5_v0": [
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
    ],
    "API_TRX_SIG5_v1": [
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
    ],
    "API_TRX_SIG5_v2": [
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
    ],
}


def get_account_authorities(account_name: bytes) -> python_authorities:
    print(f"python get_account_authorities:account_name = '{account_name.decode()}'")
    auths = ACCOUNT_AUTHS[account_name.decode()]
    print(f"python get_account_authorities:auths = {auths}")
    return auths


@pytest.mark.parametrize(
    "transaction, signing_keys",
    [
        (API_TRX_SIG1, SIGNING_KEYS["API_TRX_SIG1"]),
        (API_TRX_SIG5_v0, SIGNING_KEYS["API_TRX_SIG5_v0"]),
        (API_TRX_SIG5_v1, SIGNING_KEYS["API_TRX_SIG5_v1"]),
        (API_TRX_SIG5_v2, SIGNING_KEYS["API_TRX_SIG5_v2"]),
    ],
)
def test_collect_signing_keys(transaction: dict, signing_keys: list) -> None:
    tx_str = json.dumps(transaction)
    keys = collect_signing_keys(tx_str.encode(), get_account_authorities)

    for key in keys:
        print(f"key: {key}")

    assert keys == signing_keys, "Signing keys are incorrect"
