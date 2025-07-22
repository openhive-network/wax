from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from wax.models.basic import AccountName

def to_python_string(value: bytes | str) -> str:
    if isinstance(value, str):
        return value
    return value.decode()

def to_python_str_list(value: list[bytes]) -> list[str]:
    return [to_python_string(item) for item in value]

def to_cpp_string(value: bytes | str) -> bytes:
    if isinstance(value, str):
        return value.encode()
    return value

def decode_impacted_account_names(account_names: list[bytes]) -> list[AccountName]:
    """
    Decode account names from bytes to str.

    Args:
        account_names: List of account names in bytes.

    Returns:
        List of account names.
    """
    return [to_python_string(account_name) for account_name in account_names]
