from __future__ import annotations

import pytest

import wax

from .consts import ENCODING


@pytest.mark.parametrize(
    ("account", "role", "password", "wif_private_key", "associated_public_key"),
    [
        (
            "alice",
            "owner",
            "password",
            b"5JJKEbLRWLwCEgeQsuogVERZyrwkjHTCG6K9oJMeCMrwmyP3sk1",
            b"57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
        ),
        (
            "bob",
            "owner",
            "password",
            b"5KCxUkCbpVcrz4m1wb4BTsVLz35L2NWsF8oSrDw8douWSiTNdYv",
            b"841j3wc14j28CvYEb1ca83xqPPqyx2WcTUAYKgk3ySXmvss2Bz",
        ),
        (
            "alice",
            "active",
            "password",
            b"5KBfvpmH4jCWvd2p5vSs8hrwoC3qY1uZLVbLD6mf6iny9kjLask",
            b"723LH37PwrPx361xFXmfyi2KdQ9MnY9dAheUR4XQMsAAjwVBFU",
        ),
        (
            "alice",
            "posting",
            "password",
            b"5JZABPReZZqYBvrFYDAhmN6NQ6r9wDn9B9FnXPNLixhBaAyRbsq",
            b"86eLQPsLySq5NASzEmkgCJ3LYAc3mqsswneuFCfT6xECn9aPv5",
        ),
        (
            "alice",
            "memo",
            "password",
            b"5Juqg51degFZPKHJFangheBiTSWS9JjEv8ayXaiYuwKBxrJbrUH",
            b"5yEGUiLCCvnqhUfRGUybn1yBuqQ2pwNXe1XbJ9qvcogxzHntpC",
        ),
        (
            "alice",
            "owner",
            "other_password",
            b"5KMaDMEddy7GZBAGoHneA22xMsX5rU8QCYgLWG4d6E67hVxost1",
            b"6Xt44N2ALhrFk7ugWyZFEyXpRBFX7nETcSsx4SYiEwsDARdGzB",
        ),
    ],
)
def test_generate_password_based_private_key(
    account: str,
    role: str,
    password: str,
    wif_private_key: bytes,
    associated_public_key: bytes,
) -> None:
    private_key = wax.generate_password_based_private_key(
        account.encode(ENCODING), role.encode(ENCODING), password.encode(ENCODING)
    )

    assert private_key.wif_private_key == wif_private_key
    assert private_key.associated_public_key == associated_public_key
