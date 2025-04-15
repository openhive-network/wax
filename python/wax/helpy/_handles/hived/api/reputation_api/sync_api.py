from __future__ import annotations

from schemas.apis import reputation_api

from beekeepy._remote_handle.abc.api import AbstractSyncApi


class ReputationApi(AbstractSyncApi):
    @AbstractSyncApi.endpoint
    def get_account_reputations(
        self, *, account_lower_bound: str, limit: int = 1_000
    ) -> reputation_api.GetAccountReputations:
        raise NotImplementedError
