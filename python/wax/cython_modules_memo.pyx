# -*- coding: utf-8 -*-
# distutils: language = c++
# Memo-related functions - encode/decode encrypted memos

from cython_modules_common cimport protocol, crypto_memo
from cython_modules_common import encode_str, decode_bytes
from wax.wax_result import python_encrypted_memo


def encode_encrypted_memo(encrypted_content: str, main_encryption_key: str, other_encryption_key: str = '') -> str:
    """Encode an encrypted memo with the given keys."""
    cdef protocol obj
    cdef crypto_memo data_to_encode
    data_to_encode._from = encode_str(main_encryption_key)
    if other_encryption_key == '':
        other_encryption_key = main_encryption_key

    data_to_encode.to = encode_str(other_encryption_key)
    data_to_encode.content = encode_str(encrypted_content)
    encoded_memo = obj.cpp_crypto_memo_dump_string(data_to_encode)
    return decode_bytes(encoded_memo)


def decode_encrypted_memo(encoded_memo: str) -> python_encrypted_memo:
    """Decode an encrypted memo string."""
    cdef protocol obj
    decoded = obj.cpp_crypto_memo_from_string(encode_str(encoded_memo))
    return python_encrypted_memo(
        main_encryption_key=decode_bytes(decoded._from),
        other_encryption_key=decode_bytes(decoded.to),
        encrypted_content=decode_bytes(decoded.content)
    )
