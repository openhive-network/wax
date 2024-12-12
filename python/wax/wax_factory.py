from __future__ import annotations

from typing import TYPE_CHECKING

from wax._private.base_api import WaxBaseApi
from wax.wax_options import IWaxOptionsChain

if TYPE_CHECKING:
    from wax.interfaces import WaxBaseInterface


def create_wax_foundation(options: IWaxOptionsChain | None = None) -> WaxBaseInterface:
    """Factory function to provide wax base interface functionality."""
    chain_id = options.chain_id if options is not None else IWaxOptionsChain().chain_id

    return WaxBaseApi._create_instance(chain_id)
