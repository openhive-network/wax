from __future__ import annotations

from wax._private.core.constants import DEFAULT_CHAIN_ID
from wax._private.models.basic import ChainId


class IWaxOptionsChain:
    """Allows configuration of wax itself."""

    def __init__(self, chain_id: ChainId | str = DEFAULT_CHAIN_ID) -> None:
        """
        Constructs IWaxOptionsChain.

        Args:
            chain_id: chain id used for signing. Defaults to mainnet chain id.
        """
        self.chain_id = ChainId(chain_id)
