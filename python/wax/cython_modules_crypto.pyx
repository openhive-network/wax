# -*- coding: utf-8 -*-
# distutils: language = c++
# Cryptographic functions - keys, brain key, signatures

from libcpp.string cimport string

from cython_modules_common cimport protocol, hive_exception_data, exception_ptr, wrapped_exception_ptr_from_exception
from wax.wax_result import python_result, python_private_key_data, python_brain_key_data

# Include shared decorators (these are def functions, cannot be cimported)
include "_decorators.pxi"


@return_python_result
def generate_private_key() -> python_result:
    """Generate a new random private key."""
    cdef protocol obj
    response = obj.cpp_generate_private_key()
    return response


def generate_password_based_private_key(account: string, role: string, password: string) -> python_private_key_data:
    """Generate a private key from account, role, and password."""
    cdef protocol obj
    pkd = obj.cpp_generate_private_key(account, role, password)
    return python_private_key_data(pkd.wif_private_key, pkd.associated_public_key)


def suggest_brain_key() -> python_brain_key_data:
    """Generate a suggested brain key with associated private and public keys."""
    cdef protocol obj
    bki = obj.cpp_suggest_brain_key()
    return python_brain_key_data(bki.brain_key, bki.wif_private_key, bki.associated_public_key)


@return_python_result
def calculate_public_key(wif: bytes) -> python_result:
    """Calculate the public key from a WIF private key."""
    cdef protocol obj
    response = obj.cpp_calculate_public_key(wif)
    return response


def convert_wif_public_key_to_raw(wif: bytes) -> str:
    """Convert WIF public key to raw hex format."""
    cdef protocol obj
    response = obj.cpp_convert_wif_public_key_to_raw(wif)
    return response.decode()


@return_python_result
def get_public_key_from_signature(digest: bytes, signature: bytes) -> python_result:
    """Recover the public key from a signature and digest."""
    cdef protocol obj
    response = obj.cpp_get_public_key_from_signature(digest, signature)
    return response
