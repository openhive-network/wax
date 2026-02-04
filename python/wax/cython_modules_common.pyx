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


cdef object convert_binary_data_node_to_python(binary_data_node node):
    """Recursively convert C++ binary_data_node to Python python_binary_data_node."""
    cdef list children = []

    # Recursively convert all children
    for child in node.children:
        children.append(convert_binary_data_node_to_python(child))

    # Create and return the Python object
    return python_binary_data_node(
        key=node.key,
        type=node.type,
        offset=node.offset,
        size=node.size,
        value=node.value,
        length=node.length,
        children=children
    )
