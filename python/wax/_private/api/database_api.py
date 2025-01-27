from __future__ import annotations

from schemas.apis import database_api  # noqa: TCH002

from beekeepy._handle.abc.api import AbstractAsyncApi


class DatabaseApi(AbstractAsyncApi):
    @AbstractAsyncApi._endpoint
    async def get_dynamic_global_properties(self) -> database_api.GetDynamicGlobalProperties:
        raise NotImplementedError

    @AbstractAsyncApi._endpoint
    async def find_accounts(
        self, *, accounts: list[str], delayed_votes_active: bool | None = None
    ) -> database_api.FindAccounts:
        raise NotImplementedError
