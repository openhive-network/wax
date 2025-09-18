from __future__ import annotations


class WaxError(Exception):
    """Base exception for all wax operations."""


class WaxImportProtoBeforeCompileError(WaxError):
    """Raised when trying to import a proto module before compiling it."""

    def __init__(self) -> None:
        super().__init__(
            "You must compile the proto files before importing them.Using `build_wax..sh` script is recommended."
        )


class WaxAssertionError(WaxError):
    """Raises when an assertion occurred while calling C++ code."""

    def __init__(self, assertion_hash: str, assertion_data: str) -> None:
        self.assertion_hash = assertion_hash
        self.assertion_data = assertion_data
        super().__init__(self.assertion_data)


class WaxChainAssertionError(WaxAssertionError):
    pass


class WaxProtocolAssertionError(WaxAssertionError):
    pass
