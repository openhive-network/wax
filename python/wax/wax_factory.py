from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from wax.interfaces import IHiveChainInterface, IWaxBaseInterface
    from wax.wax_options import WaxChainOptions, WaxOptions


def create_wax_foundation(options: WaxOptions | None = None) -> IWaxBaseInterface:
    """Factory function to provide wax base interface functionality."""
    from wax._private.base_api import WaxBaseApi
    from wax.wax_options import WaxOptions

    chain_id = options.chain_id if options is not None else WaxOptions().chain_id

    return WaxBaseApi(chain_id, _private=True)


def create_hive_chain(options: WaxChainOptions | None = None) -> IHiveChainInterface:
    """Factory function to provide hive chain interface functionality."""
    from wax._private.chain_api import HiveChainApi
    from wax.wax_options import WaxChainOptions

    options = options if options is not None else WaxChainOptions()
    chain_id = options.chain_id
    endpoint_url = options.endpoint_url

    return HiveChainApi(chain_id, endpoint_url, _private=True)
