from __future__ import annotations

import wax

MAIN_ENCRYPTION_KEY = "STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4"
OTHER_ENCRYPTION_KEY = "STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW"
ENCRYPTED_MEMO = "111111118N2MrWbLqudcbQR4EUziLoGAqR7XN"


def test_encode_and_decode_encrypted_memo() -> None:
    encoded_encrypted_memo = wax.encode_encrypted_memo(
        encrypted_content=ENCRYPTED_MEMO,
        main_encryption_key=MAIN_ENCRYPTION_KEY,
        other_encryption_key=OTHER_ENCRYPTION_KEY,
    )

    assert (
        encoded_encrypted_memo
        == "#DRM3RU1zCeGnG1LJinoxGC7XrcDHvSLtTQBZvvDDjduJMgeWZqHW3A7B59Wkp6FwjQcpc8oykzmapJ3KsNVCwb9F3tzJhW2nrZQ7n9JaxL8viBs1SNEbyodcgKeYtD5ex"
    )

    decoded_encrypted_memo = wax.decode_encrypted_memo(encoded_encrypted_memo)

    assert decoded_encrypted_memo.encrypted_content == ENCRYPTED_MEMO
    assert decoded_encrypted_memo.main_encryption_key == MAIN_ENCRYPTION_KEY
    assert decoded_encrypted_memo.other_encryption_key == OTHER_ENCRYPTION_KEY
