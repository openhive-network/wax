from __future__ import annotations

from dataclasses import dataclass, field

from wax._private.models.basic import ChainId


@dataclass
class IWaxOptionsChain:
    chain_id: ChainId = field(
        default_factory=lambda: ChainId("18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e")
    )
