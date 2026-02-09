from __future__ import annotations

from typing import ClassVar

from hiveio_api.database_api.database_api_client import DatabaseApi
from hiveio_api.network_broadcast_api.network_broadcast_api_client import NetworkBroadcastApi
from hiveio_api.rc_api.rc_api_client import RcApi


class WaxApiCollection:
    database_api: DatabaseApi
    network_broadcast_api: NetworkBroadcastApi
    rc_api: RcApi

    _API_MAP: ClassVar[dict[str, type]] = {
        "database_api": DatabaseApi,
        "network_broadcast_api": NetworkBroadcastApi,
        "rc_api": RcApi,
    }
