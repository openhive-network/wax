# -*- coding: utf-8 -*-
# distutils: language = c++
# Common module - exception handling and shared cdef utilities
#
# NOTE: Decorators (call_with_exception_relay, return_python_*, etc.) and
# raise_appropriate_wax_exception are defined in _decorators.pxi and included
# by each module that needs them. This avoids runtime imports between modules
# (which would fail since all modules compile to a single .so file).

import json

from libcpp cimport bool
from libcpp.string cimport string as cppstring
from libcpp.vector cimport vector

from cython_modules_common cimport (
    protocol,
    binary_data_node,
    hive_exception_data,
    exception_ptr,
    wrapped_exception_ptr_from_exception,
)

from wax.exceptions import WaxChainAssertionError, WaxProtocolAssertionError, WaxAssertionError, WaxError
from wax.wax_result import python_binary_data_node

# Include shared decorators and raise_appropriate_wax_exception
include "_decorators.pxi"


# String conversion helpers for Cython 3.1.3
# These functions handle the bytes <-> str conversion at the C++ boundary

def encode_str(value) -> bytes:
    """Python str -> bytes (for passing to C++)."""
    return value.encode("utf-8") if isinstance(value, str) else value


def decode_bytes(value) -> str:
    """C++ bytes -> Python str."""
    return value.decode() if isinstance(value, bytes) else value


def encode_dict_str_int(source: dict) -> dict:
    """Encode string keys in dict[str, int] to bytes for C++."""
    return {encode_str(k): v for k, v in source.items()}


def decode_dict_bytes_int(source: dict) -> dict:
    """Decode bytes keys in dict[bytes, int] from C++ to str."""
    return {decode_bytes(k): v for k, v in source.items()}


def encode_list(source: list) -> list:
    """Encode list of strings to bytes for C++."""
    return [encode_str(item) for item in source]


def decode_list(source: list) -> list:
    """Decode list of bytes from C++ to strings."""
    return [decode_bytes(item) for item in source]


cdef object convert_binary_data_node_to_python(binary_data_node node):
    """Recursively convert C++ binary_data_node to Python python_binary_data_node."""
    cdef list children = []

    # Recursively convert all children
    for child in node.children:
        children.append(convert_binary_data_node_to_python(child))

    # Create and return the Python object
    return python_binary_data_node(
        key=decode_bytes(node.key),
        type=decode_bytes(node.type),
        offset=node.offset,
        size=node.size,
        value=decode_bytes(node.value),
        length=node.length,
        children=children
    )
