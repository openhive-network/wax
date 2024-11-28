from __future__ import annotations

from typing import TYPE_CHECKING

from wax._private.base_api import WaxBaseApi

if TYPE_CHECKING:
    from wax.interfaces import WaxBaseInterface


def create_wax_foundation() -> WaxBaseInterface:
    """Factory function to provide wax base interface functionality."""
    return WaxBaseApi._create_instance()
