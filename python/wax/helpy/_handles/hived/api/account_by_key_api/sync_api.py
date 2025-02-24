from __future__ import annotations

from schemas.apis import account_by_key_api

from beekeepy._remote_handle.abc.api import AbstractSyncApi


class AccountByKeyApi(AbstractSyncApi):
    @AbstractSyncApi._endpoint
    def get_key_references(self, *, keys: list[str]) -> account_by_key_api.GetKeyReferences:
        raise NotImplementedError
