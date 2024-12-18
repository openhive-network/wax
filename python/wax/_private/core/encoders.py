from __future__ import annotations


def to_python_string(value: bytes | str) -> str:
    if isinstance(value, str):
        return value
    return value.decode()


def to_cpp_string(value: bytes | str) -> bytes:
    if isinstance(value, str):
        return value.encode()
    return value
