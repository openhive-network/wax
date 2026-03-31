# -*- coding: utf-8 -*-
# distutils: language = c++
# Cryptographic functions - keys, brain key, signatures

from libcpp.string cimport string

from cython_modules_common cimport protocol, hive_exception_data, exception_ptr, wrapped_exception_ptr_from_exception
from cython_modules_common import encode_str, decode_bytes
from wax.wax_result import python_result, python_private_key_data, python_brain_key_data

# Include shared decorators (these are def functions, cannot be cimported)
include "_decorators.pxi"


@wax_error_boundary
def generate_private_key() -> python_result:
    """Generate a new random private key."""
    cdef protocol obj
    response = obj.cpp_generate_private_key()
    return response


@wax_error_boundary
def generate_password_based_private_key(account: str, role: str, password: str) -> python_private_key_data:
    """Generate a private key from account, role, and password."""
    cdef protocol obj
    pkd = obj.cpp_generate_private_key(encode_str(account), encode_str(role), encode_str(password))
    return python_private_key_data(
        decode_bytes(pkd.wif_private_key),
        decode_bytes(pkd.associated_public_key)
    )


@wax_error_boundary
def suggest_brain_key() -> python_brain_key_data:
    """Generate a suggested brain key with associated private and public keys."""
    cdef protocol obj
    bki = obj.cpp_suggest_brain_key()
    return python_brain_key_data(
        decode_bytes(bki.brain_key),
        decode_bytes(bki.wif_private_key),
        decode_bytes(bki.associated_public_key)
    )


@wax_error_boundary
def calculate_public_key(wif: str) -> python_result:
    """Calculate the public key from a WIF private key."""
    cdef protocol obj
    response = obj.cpp_calculate_public_key(encode_str(wif))
    return response


@wax_error_boundary
def convert_wif_public_key_to_raw(wif: str) -> str:
    """Convert WIF public key to raw hex format."""
    cdef protocol obj
    response = obj.cpp_convert_wif_public_key_to_raw(encode_str(wif))
    return decode_bytes(response)


@wax_error_boundary
def get_public_key_from_signature(digest: str, signature: str) -> python_result:
    """Recover the public key from a signature and digest."""
    cdef protocol obj
    response = obj.cpp_get_public_key_from_signature(encode_str(digest), encode_str(signature))
    return response
