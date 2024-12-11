from __future__ import annotations

from typing import Any

from pydantic import ValidationError

from schemas.fields.basic import AccountName
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


def decode_impacted_account_names(account_names: list[bytes]) -> list[AccountName]:
    """
    Decode account names from bytes to AccountName models.

    Args:
        account_names: List of account names in bytes.

    Returns:
        List of validated account names.

    Raises:
        WaxValidationFailedError: If account names are not valid.
    """
    try:
        return [AccountName(account_name.decode()) for account_name in account_names]
    except ValidationError as error:
        raise WaxValidationFailedError("Error while parsing impacted accounts.") from error
