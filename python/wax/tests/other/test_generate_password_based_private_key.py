from __future__ import annotations

import pytest

import wax


@pytest.mark.parametrize(
    ("account", "role", "password", "wif_private_key", "associated_public_key"),
    [
        (
            "alice",
            "owner",
            "password",
            "5JJKEbLRWLwCEgeQsuogVERZyrwkjHTCG6K9oJMeCMrwmyP3sk1",
            "STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
        ),
        (
            "bob",
            "owner",
            "password",
            "5KCxUkCbpVcrz4m1wb4BTsVLz35L2NWsF8oSrDw8douWSiTNdYv",
            "STM841j3wc14j28CvYEb1ca83xqPPqyx2WcTUAYKgk3ySXmvss2Bz",
        ),
        (
            "alice",
            "active",
            "password",
            "5KBfvpmH4jCWvd2p5vSs8hrwoC3qY1uZLVbLD6mf6iny9kjLask",
            "STM723LH37PwrPx361xFXmfyi2KdQ9MnY9dAheUR4XQMsAAjwVBFU",
        ),
        (
            "alice",
            "posting",
            "password",
            "5JZABPReZZqYBvrFYDAhmN6NQ6r9wDn9B9FnXPNLixhBaAyRbsq",
            "STM86eLQPsLySq5NASzEmkgCJ3LYAc3mqsswneuFCfT6xECn9aPv5",
        ),
        (
            "alice",
            "memo",
            "password",
            "5Juqg51degFZPKHJFangheBiTSWS9JjEv8ayXaiYuwKBxrJbrUH",
            "STM5yEGUiLCCvnqhUfRGUybn1yBuqQ2pwNXe1XbJ9qvcogxzHntpC",
        ),
        (
            "alice",
            "owner",
            "other_password",
            "5KMaDMEddy7GZBAGoHneA22xMsX5rU8QCYgLWG4d6E67hVxost1",
            "STM6Xt44N2ALhrFk7ugWyZFEyXpRBFX7nETcSsx4SYiEwsDARdGzB",
        ),
    ],
)
def test_generate_password_based_private_key(
    account: str,
    role: str,
    password: str,
    wif_private_key: str,
    associated_public_key: str,
) -> None:
    private_key = wax.generate_password_based_private_key(account, role, password)

    assert private_key.wif_private_key == wif_private_key
    assert private_key.associated_public_key == associated_public_key
