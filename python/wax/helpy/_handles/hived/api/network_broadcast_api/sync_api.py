from __future__ import annotations

from schemas.apis import network_broadcast_api
from schemas.transaction import Transaction

from beekeepy._remote_handle.abc.api import AbstractSyncApi


class NetworkBroadcastApi(AbstractSyncApi):
    @AbstractSyncApi._endpoint
    def broadcast_transaction(self, *, trx: Transaction) -> network_broadcast_api.BroadcastTransaction:
        raise NotImplementedError
