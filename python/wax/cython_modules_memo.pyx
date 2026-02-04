# -*- coding: utf-8 -*-
# distutils: language = c++
# Memo-related functions - encode/decode encrypted memos

from cython_modules_common cimport protocol, crypto_memo
from wax.wax_result import python_encrypted_memo


def encode_encrypted_memo(encrypted_content: bytes, main_encryption_key: bytes, other_encryption_key: bytes = b'') -> bytes:
    """Encode an encrypted memo with the given keys."""
    cdef protocol obj
    cdef crypto_memo data_to_encode
    data_to_encode._from = main_encryption_key
    if other_encryption_key == b'':
        other_encryption_key = main_encryption_key

    data_to_encode.to = other_encryption_key
    data_to_encode.content = encrypted_content
    encoded_memo = obj.cpp_crypto_memo_dump_string(data_to_encode)
    return encoded_memo


def decode_encrypted_memo(encoded_memo: bytes) -> python_encrypted_memo:
    """Decode an encrypted memo string."""
    cdef protocol obj
    decoded = obj.cpp_crypto_memo_from_string(encoded_memo)
    return python_encrypted_memo(
        main_encryption_key=decoded._from,
        other_encryption_key=decoded.to,
        encrypted_content=decoded.content
    )
