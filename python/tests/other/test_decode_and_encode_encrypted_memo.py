from __future__ import annotations

import wax

from .consts import ENCODING

MAIN_ENCRYPTION_KEY = "6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4"
OTHER_ENCRYPTION_KEY = "5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW"
ENCRYPTED_MEMO = "111111118N2MrWbLqudcbQR4EUziLoGAqR7XN"


def test_encode_and_decode_encrypted_memo() -> None:
    encoded_encrypted_memo = wax.encode_encrypted_memo(
        encrypted_content=ENCRYPTED_MEMO.encode(ENCODING),
        main_encryption_key=MAIN_ENCRYPTION_KEY.encode(ENCODING),
        other_encryption_key=OTHER_ENCRYPTION_KEY.encode(ENCODING),
    )

    assert (
        encoded_encrypted_memo
        == b"#11111111Df8FT8j6nHi6PtLVffSXtyhuz56j8imYp82xBvikZHtG1aZWAhzbEntrdfwUfECqximeaHNsi1ZwKG1ArVUyg8qMh4G5bVPNMvqVTceJCMvCJx6eUH1YumE"
    )

    decoded_encrypted_memo = wax.decode_encrypted_memo(encoded_encrypted_memo)

    assert decoded_encrypted_memo.encrypted_content == ENCRYPTED_MEMO.encode(ENCODING)
    assert decoded_encrypted_memo.main_encryption_key == MAIN_ENCRYPTION_KEY.encode(
        ENCODING
    )
    assert decoded_encrypted_memo.other_encryption_key == OTHER_ENCRYPTION_KEY.encode(
        ENCODING
    )
