from __future__ import annotations

from wax.exceptions.validation_errors import WaxValidationFailedError
from wax.wax_result import python_error_code, python_result


def validate_wax_result(result: python_result) -> None:
    """Validate a wax result and raise an error if it failed."""
    if result.status == python_error_code.fail:
        raise WaxValidationFailedError(result.exception_message)


def expose_result_as_python_string(result: python_result) -> str:
    """Extract the result string from a wax result."""
    return result.result
