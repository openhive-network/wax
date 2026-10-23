from __future__ import annotations

from typing import ClassVar

from hiveio_api.client import AbstractAsyncApiCollection
from hiveio_api.database_api.database_api_client import DatabaseApi
from hiveio_api.network_broadcast_api.network_broadcast_api_client import NetworkBroadcastApi
from hiveio_api.rc_api.rc_api_client import RcApi


class WaxApiCollection(AbstractAsyncApiCollection):
    """
    APIs of a chain - declared by `_API_MAP`, created with their owner by `api_collection_factory`.

    Collections are templates - created without arguments (also the ones joined by `extends`).
    """

    database_api: DatabaseApi
    network_broadcast_api: NetworkBroadcastApi
    rc_api: RcApi

    _API_MAP: ClassVar[dict[str, type]] = {
        "database_api": DatabaseApi,
        "network_broadcast_api": NetworkBroadcastApi,
        "rc_api": RcApi,
    }

    def __init__(self) -> None:
        """Owner and callbacks of the collection are set by `api_collection_factory`."""
