from __future__ import annotations

from typing import TYPE_CHECKING

from beekeepy.handle.remote import AbstractAsyncApiCollection
from wax._private.api.database_api import DatabaseApi
from wax._private.api.network_broadcast_api import NetworkBroadcastApi

if TYPE_CHECKING:
    from beekeepy._remote_handle.abc.api import AsyncHandleT


class ApiCollection(AbstractAsyncApiCollection):
    def __init__(self, owner: AsyncHandleT) -> None:
        super().__init__(owner)
        self.network_broadcast = NetworkBroadcastApi(owner)
        self.database_api = DatabaseApi(owner)
