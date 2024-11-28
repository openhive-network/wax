from __future__ import annotations

from typing import Any

from wax._private.exceptions import WaxValidationFailedError
from wax.wax_result import python_error_code, python_result


def validate_wax_result(result: python_result) -> None:
    if result.status == python_error_code.fail:
        raise WaxValidationFailedError(
            result.exception_message.decode()
            if isinstance(result.exception_message, bytes)
            else result.exception_message
        )


def expose_result(result: python_result) -> Any:  # noqa: ANN401
    return result.result.decode()
