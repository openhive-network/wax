from __future__ import annotations

from schemas.apis import network_broadcast_api  # noqa: TCH002
from schemas.transaction import Transaction  # noqa: TCH002
from beekeepy._handle.abc.api import AbstractAsyncApi


class NetworkBroadcastApi(AbstractAsyncApi):
    @AbstractAsyncApi._endpoint
    async def broadcast_transaction(self, *, trx: Transaction) -> network_broadcast_api.BroadcastTransaction:
        raise NotImplementedError
