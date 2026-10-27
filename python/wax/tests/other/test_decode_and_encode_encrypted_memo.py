from __future__ import annotations

import pytest

import wax
from wax.exceptions import WaxError

MAIN_ENCRYPTION_KEY = "STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4"
OTHER_ENCRYPTION_KEY = "STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW"
ENCRYPTED_MEMO = "111111118N2MrWbLqudcbQR4EUziLoGAqR7XN"
ENCODED_ENCRYPTED_MEMO = "#DRM3RU1zCeGnG1LJinoxGC7XrcDHvSLtTQBZvvDDjduJMgeWZqHW3A7B59Wkp6FwjQcpc8oykzmapJ3KsNVCwb9F3tzJhW2nrZQ7n9JaxL8viBs1SNEbyodcgKeYtD5ex"
# The same memo in the legacy field order (nonce, check, encrypted, from, to) written by wax 1.27.5 - 1.28.6
LEGACY_ORDER_ENCODED_ENCRYPTED_MEMO = "#11111111Df8FT8j6nHi6PtLVffSXtyhuz56j8imYp82xBvikZHtG1aZWAhzbEntrdfwUfECqximeaHNsi1ZwKG1ArVUyg8qMh4G5bVPNMvqVTceJCMvCJx6eUH1YumE"


def test_encode_and_decode_encrypted_memo() -> None:
    encoded_encrypted_memo = wax.encode_encrypted_memo(
        encrypted_content=ENCRYPTED_MEMO,
        main_encryption_key=MAIN_ENCRYPTION_KEY,
        other_encryption_key=OTHER_ENCRYPTION_KEY,
    )

    assert encoded_encrypted_memo == ENCODED_ENCRYPTED_MEMO

    decoded_encrypted_memo = wax.decode_encrypted_memo(encoded_encrypted_memo)

    assert decoded_encrypted_memo.encrypted_content == ENCRYPTED_MEMO
    assert decoded_encrypted_memo.main_encryption_key == MAIN_ENCRYPTION_KEY
    assert decoded_encrypted_memo.other_encryption_key == OTHER_ENCRYPTION_KEY


def test_decode_legacy_order_encrypted_memo() -> None:
    decoded_encrypted_memo = wax.decode_encrypted_memo(LEGACY_ORDER_ENCODED_ENCRYPTED_MEMO)

    assert decoded_encrypted_memo.encrypted_content == ENCRYPTED_MEMO
    assert decoded_encrypted_memo.main_encryption_key == MAIN_ENCRYPTION_KEY
    assert decoded_encrypted_memo.other_encryption_key == OTHER_ENCRYPTION_KEY


def test_decode_invalid_encrypted_memo() -> None:
    with pytest.raises(WaxError):
        wax.decode_encrypted_memo("#" + ENCRYPTED_MEMO)
