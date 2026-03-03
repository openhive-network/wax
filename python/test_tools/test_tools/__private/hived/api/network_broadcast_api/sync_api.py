from __future__ import annotations

from beekeepy.handle.remote import AbstractSyncApi
from hiveio_api import network_broadcast_api

from schemas.transaction import Transaction


class NetworkBroadcastApi(AbstractSyncApi):
    @AbstractSyncApi.endpoint_jsonrpc
    def broadcast_transaction(self, *, trx: Transaction) -> network_broadcast_api.BroadcastTransactionResponse:
        raise NotImplementedError
