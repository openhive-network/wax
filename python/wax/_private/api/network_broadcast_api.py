from __future__ import annotations

from beekeepy._handle.abc.api import AbstractAsyncApi
from wax._private.models.schemas import ApiTransaction, network_broadcast_api  # NOQA: TCH001


class NetworkBroadcastApi(AbstractAsyncApi):
    @AbstractAsyncApi._endpoint
    async def broadcast_transaction(self, *, trx: ApiTransaction) -> network_broadcast_api.BroadcastTransaction:
        raise NotImplementedError
