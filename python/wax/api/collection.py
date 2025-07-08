from __future__ import annotations

from database_api.database_api_client import DatabaseApi
from network_broadcast_api.network_broadcast_api_client import NetworkBroadcastApi


class WaxApiCollection:
    def __init__(self) -> None:
        self.database_api = DatabaseApi
        self.network_broadcast_api = NetworkBroadcastApi
