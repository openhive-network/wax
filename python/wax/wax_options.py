from __future__ import annotations

from typing import TYPE_CHECKING

from wax._private.core.constants import DEFAULT_CHAIN_ID

if TYPE_CHECKING:
    from wax._private.models.basic import ChainId


class WaxOptions:
    """Allows configuration of wax itself."""

    def __init__(self, chain_id: ChainId = DEFAULT_CHAIN_ID) -> None:
        """
        Constructs WaxOptions.

        Args:
            chain_id: chain id used for signing. Defaults to mainnet chain id.
        """
        self.chain_id = chain_id
