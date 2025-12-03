from __future__ import annotations


class WaxError(Exception):
    """Base exception for all wax operations."""


class WaxImportProtoBeforeCompileError(WaxError):
    """Raised when trying to import a proto module before compiling it."""

    def __init__(self) -> None:
        super().__init__(
            "You must compile the proto files before importing them.Using `build_wax..sh` script is recommended."
        )
