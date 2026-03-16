from __future__ import annotations

from datetime import datetime  # noqa: TCH003

from beekeepy.handle.remote import AbstractSyncApi
from hiveio_api import transaction_status_api


class TransactionStatusApi(AbstractSyncApi):
    @AbstractSyncApi.endpoint_jsonrpc
    def find_transaction(
        self, *, transaction_id: str, expiration: datetime | None = None
    ) -> transaction_status_api.FindTransactionResponse:
        raise NotImplementedError
