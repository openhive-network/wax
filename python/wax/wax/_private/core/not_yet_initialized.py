from __future__ import annotations

from typing import TypeVar

TEnsurer = TypeVar("TEnsurer")


class NotYetInitialized:
    """Class indicating that the 'init' method has not been called."""

    @staticmethod
    def ensure_is_attribute_initialized(attribute: TEnsurer | NotYetInitialized) -> TEnsurer:
        """Ensures that the attribute is initialized."""
        assert not isinstance(
            attribute, NotYetInitialized
        ), f"Attribute {attribute} is not initialized. Please use `init` method first."
        return attribute
