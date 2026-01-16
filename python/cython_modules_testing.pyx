# -*- coding: utf-8 -*-
# distutils: language = c++
# Testing-related functions - exception handling verification

from cython_modules_common cimport protocol, hive_exception_data, exception_ptr, wrapped_exception_ptr_from_exception

# Include shared decorators (these are def functions, cannot be cimported)
include "_decorators.pxi"


@call_with_exception_relay
def verify_exception_handling(throw_type: int) -> None:
    """Verify exception handling by throwing a specific exception type."""
    cdef protocol obj
    obj.cpp_throws(throw_type)


@call_with_exception_relay
def cpp_throws(type: int) -> bytes:
    """Throw a C++ exception of a specific type for testing."""
    cdef protocol obj
    obj.cpp_throws(type)
    return b''
