from __future__ import annotations

from typing import TYPE_CHECKING

from wax._private.base_api import WaxBaseApi
from wax.wax_options import WaxOptions

if TYPE_CHECKING:
    from wax.interfaces import IWaxBaseInterface


def create_wax_foundation(options: WaxOptions | None = None) -> IWaxBaseInterface:
    """Factory function to provide wax base interface functionality."""
    chain_id = options.chain_id if options is not None else WaxOptions().chain_id

    return WaxBaseApi(chain_id, _private=True)
