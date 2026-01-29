# -*- coding: utf-8 -*-
# Shared decorator functions for Cython modules
# This file is meant to be included (not imported) via Cython's include directive.
# Usage: include "_decorators.pxi"
#
# These decorators CANNOT be cimported because they are def functions, not cdef.
# By including this file, each module gets its own copy of the decorators,
# eliminating the need for runtime imports between modules.
#
# IMPORTANT: Modules that include this file must first cimport these types from cython_modules_common:
#   from cython_modules_common cimport protocol, hive_exception_data, exception_ptr, wrapped_exception_ptr_from_exception

from functools import wraps

import json

from wax.exceptions import WaxChainAssertionError, WaxProtocolAssertionError, WaxAssertionError, WaxError
from wax.wax_result import (
    python_result,
    python_error_code,
    python_json_asset,
    python_ref_block_data,
)


cdef object raise_appropriate_wax_exception(object ex):
    """Convert C++ exceptions to appropriate Python Wax exceptions."""
    cdef protocol obj
    cdef exception_ptr eptr = wrapped_exception_ptr_from_exception(ex)
    cdef hive_exception_data raw_data = obj.cpp_translate_to_wax_exception_data(eptr)
    wax_exception_name = raw_data.wax_exception_name.decode()
    wax_exception_what = raw_data.what.decode()
    if wax_exception_name == "WaxError":
        raise WaxError(wax_exception_what)
    else:
        try:
            aux = json.loads(wax_exception_what)
            assertion_code = aux['assert_hash']
        except Exception:
            # Non-assertion exception or malformed assertion data
            raise WaxError(wax_exception_what)
        assertion_type = eval(wax_exception_name)
        raise assertion_type(assertion_code, wax_exception_what)


def call_with_exception_relay(foo):
    """Decorator that converts C++ exceptions to Python Wax exceptions.

    This decorator wraps a function and catches any exceptions thrown,
    converting them to appropriate Wax exception types.
    """
    @wraps(foo)
    def wrapper(*args, **kwargs):
        try:
            result = foo(*args, **kwargs)
            return result
        except Exception as ex:
            raise_appropriate_wax_exception(ex)
    return wrapper


cdef object _convert_exception_to_json_message(object ex):
    """Convert exception to JSON message string.

    If the exception contains a C++ exception_ptr capsule, convert it to a
    proper Wax exception first. Otherwise, just return str(ex).
    """
    cdef protocol obj
    cdef exception_ptr eptr
    cdef hive_exception_data raw_data

    # Try to extract exception_ptr from capsule (C++ exception)
    try:
        eptr = wrapped_exception_ptr_from_exception(ex)
        if eptr:
            raw_data = obj.cpp_translate_to_wax_exception_data(eptr)
            return raw_data.what.decode()
    except:
        pass

    # Not a capsule exception, return string representation
    return str(ex)


def return_python_result(foo):
    """Decorator that wraps function results in python_result dataclass.

    Handles exceptions by returning a failed result instead of raising.
    """
    @wraps(foo)
    def wrapper(*args, **kwargs):
        try:
            result = foo(*args, **kwargs)
            if result is None:
                result = ''  # Ensure result is str
            else:
                if isinstance(result, bytes):
                    result = result.decode('utf-8')
                elif not isinstance(result, str):
                    result = json.dumps(result)  # Convert to str if not already
            return python_result(status=python_error_code.ok, result=result, exception_message='')
        except Exception as ex:
            # Convert capsule exceptions to proper messages
            ex_message = _convert_exception_to_json_message(ex)
            aux = json.loads(ex_message)
            if isinstance(aux, dict) and 'stack' in aux and isinstance(aux['stack'], list):
                for val in aux['stack']:
                    if isinstance(val, dict) and 'context' in val and isinstance(val['context'], dict):
                        val['context'].pop('timestamp', None)
            return python_result(status=python_error_code.fail, result='', exception_message=str(aux))
    return wrapper


def return_python_json_asset(foo):
    """Decorator that wraps function results in python_json_asset dataclass."""
    @wraps(foo)
    def wrapper(*args, **kwargs):
        amount, precision, nai = foo(*args, **kwargs)
        # Decode bytes to str if needed
        if isinstance(amount, bytes):
            amount = amount.decode('utf-8')
        if isinstance(nai, bytes):
            nai = nai.decode('utf-8')
        return python_json_asset(
            amount=amount,
            precision=precision,
            nai=nai
        )
    return wrapper


def return_python_ref_block_data(foo):
    """Decorator that wraps function results in python_ref_block_data dataclass."""
    @wraps(foo)
    def wrapper(*args, **kwargs):
        ref_block_num, ref_block_prefix = foo(*args, **kwargs)
        return python_ref_block_data(
            ref_block_num=ref_block_num & 0xffff,  # convert to unsigned
            ref_block_prefix=ref_block_prefix & 0xffffffff  # convert to unsigned
        )
    return wrapper
