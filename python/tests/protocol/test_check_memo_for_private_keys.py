from __future__ import annotations

from typing import TYPE_CHECKING, Final, Literal

import pytest

from wax import check_memo_for_private_keys, python_authority, python_authorities


ACCOUNT: Final[str] = "alice"

PRIVATE_KEYS: Final[dict[str, bytes]] = {
    "owner": b"5Kcb526wim2obMPFQVJcAVbtkWJkFYo746afCLU5cMGttD9cYGw",  # tt.PrivateKey(ACCOUNT, secret="owner").encode(),
    "active": b"5Jj2jixMhsR2R1oriWchsQYimH1XyGo4N9s6iB7J3uHyNeq3Ge5",  # tt.PrivateKey(ACCOUNT, secret="active").encode(),
    "posting": b"5JhEUJADWcRq3rEP7eWxAHmd8yrigfPhi4DXFPr442AavFEgjXX",  # tt.PrivateKey(ACCOUNT, secret="posting").encode(),
    "memo": b"5KZEKVcSF1t2JhbZHNm1PQ3yoxDxRJGK9UWTQdeZw136vXpHTsj",  # tt.PrivateKey(ACCOUNT, secret="memo").encode(),
}

EXTENDED_PRIVATE_KEYS: Final[dict[str, bytes]] = {
    "owner": b"xprv9s21ZrQH143K24Mfq5zL5MhWK9hUhhGbd45hLXo2Pq2oqzMMo63oStZzFAqqaHarGn3o32kid6aKV1U9asYrwoKyb5BgJibMNw56bby5sbp",
    "posting": b"xprv9s21ZrQH143K24Mfq5zL5MhWK9hUhhGbd45hLXo2Pq2oqzMMo63oStZzF9vUyZe84dSpVXbrLFnfUodsyM6qNuvaF2pYMmyKpbxndcxH52P",
    "active": b"xprv9s21ZrQH143K24Mfq5zL5MhWK9hUhhGbd45hLXo2Pq2oqzMMo63oStZzF9xHEzSGFtS1rhBKw7tRBvQybeFefXKvu8U7pZEZpV6B62EyamB",
    "memo": b"xprv9s21ZrQH143K24Mfq5zL5MhWK9hUhhGbd45hLXo2Pq2oqzMMo63oStZzFAnUpm6Lo2u1kNy2Vz2ihuvEeKU57YoBgT7UX1mqhaqJdwxNfzz",
}

PUBLIC_KEYS: Final[dict[str, bytes]] = {
    "owner": b"STM5v3682EzJbJmxUiACzLdtNP3AYYYSATC5AszYpb2Ve3riBnevN",  # tt.PublicKey(ACCOUNT, secret="owner").encode(),
    "active": b"STM7599MhAJN4hkBLp7JHvqMVRMb9X1rnfpbc23LJs7HjQgkAi7ea",  # tt.PublicKey(ACCOUNT, secret="active").encode(),
    "posting": b"STM5h6ivYuxwA6KTQYHBoZihbou8MsjahP4CgtmG5owtpxQYeyyh3",  # tt.PublicKey(ACCOUNT, secret="posting").encode(),
    "memo": b"STM65g4T6xwpy9tE8PeQaBfqgpWXUHshUjSTpnu2MwUiftdbZ8c3x",  # tt.PublicKey(ACCOUNT, secret="memo").encode(),
}

OTHER_ACCOUNT: Final[str] = "bob"

IMPORTED_PRIVATE_KEY: Final[bytes] = b"5JZhZRpYjWYm3jKsz5JEpPDG38Dn9JzhXTFg7gwrpgiLVKuH13B"  # tt.PrivateKey(OTHER_ACCOUNT, secret="active").encode()

IMPORTED_PUBLIC_KEY: Final[bytes] = b"STM8fZEprWbZPauKhypTWsaZunyzhVpauB6xkUJZJXVEvkNzpS2ue"  # tt.PublicKey(OTHER_ACCOUNT, secret="active").encode()

AUTHORITIES: Final[python_authorities] = python_authorities(
    active = python_authority(weight_threshold = 1, account_auths = {}, key_auths = { PUBLIC_KEYS["active"]: 1 }),
    owner = python_authority(weight_threshold = 1, account_auths = {}, key_auths = { PUBLIC_KEYS["owner"]: 1 }),
    posting = python_authority(weight_threshold = 1, account_auths = {}, key_auths = { PUBLIC_KEYS["posting"]: 1 }),
)


def get_memo(
    memo_type: Literal["private_key", "extended_private_key", "imported_key"],
    role: Literal["owner", "active", "posting", "memo"]
) -> bytes:
    match memo_type:
        case "private_key":
            return PRIVATE_KEYS[role]
        case "extended_private_key":
            return EXTENDED_PRIVATE_KEYS[role]
        case "imported_key":
            return IMPORTED_PRIVATE_KEY


def get_error_message(
    memo_type: Literal["private_key", "extended_private_key", "imported_key"],
    role: Literal["owner", "active", "posting", "memo"]
) -> str:
    match memo_type:
        case "private_key":
            return f"Detected private {role} key in memo field."
        case "extended_private_key":
            return f"Detected private {role} key in memo field."
        case "imported_key":
            return "Detected private key in memo field."
    

@pytest.mark.parametrize("memo_type", ["private_key", "extended_private_key", "imported_key"])
@pytest.mark.parametrize("role", ["owner", "active", "posting", "memo"])
def test_check_memo_for_private_keys(memo_type: str, role: str):
    memo = get_memo(memo_type, role)
    error_message = get_error_message(memo_type, role)
    with pytest.raises(RuntimeError) as error:
        check_memo_for_private_keys(memo, ACCOUNT.encode(), AUTHORITIES, PUBLIC_KEYS["memo"], [IMPORTED_PUBLIC_KEY])

    print(error)
    assert error_message in str(error)
