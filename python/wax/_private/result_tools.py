from __future__ import annotations

from typing import TYPE_CHECKING

from wax.exceptions.validation_errors import WaxValidationFailedError
from wax.wax_result import python_error_code, python_result

if TYPE_CHECKING:
    from wax.models.basic import AccountName


def to_python_string(value: str) -> str:
    return value


def to_python_str_list(value: list[str]) -> list[str]:
    return list(value)


def to_cpp_string(value: str) -> bytes:
    """Convert str to bytes for C++ consumption."""
    return value.encode('utf-8')


def validate_wax_result(result: python_result) -> None:
    if result.status == python_error_code.fail:
        raise WaxValidationFailedError(to_python_string(result.exception_message))


def expose_result_as_python_string(result: python_result) -> str:
    return to_python_string(result.result)


def expose_result_as_cpp_string(result: python_result) -> str:
    return result.result


def decode_impacted_account_names(account_names: list[str]) -> list[AccountName]:
    """
    Convert account names to the AccountName type.

    Args:
        account_names: List of account names.

    Returns:
        List of account names.
    """
    return list(account_names)
