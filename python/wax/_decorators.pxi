# -*- coding: utf-8 -*-
# Shared decorator functions for Cython modules
# This file is meant to be included (not imported) via Cython's include directive.
# Usage: include "_decorators.pxi"
#
# These decorators CANNOT be cimported because they are def functions, not cdef.
# By including this file, each module gets its own copy of the decorators,
# eliminating the need for runtime imports between modules.

from functools import wraps

from wax.exceptions.wax_specialised_errors import wax_error_boundary
from wax.wax_result import (
    python_json_asset,
    python_ref_block_data,
)


def return_python_json_asset(foo):
    """Decorator that wraps function results in python_json_asset dataclass.

    When stacked with @wax_error_boundary, the ordering must be:
        @wax_error_boundary   # outer — catches exceptions and re-raises specialised errors
        @return_python_json_asset  # inner — converts (amount, precision, nai) tuple to dataclass
    """
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
