from __future__ import annotations

from beekeepy.handle.remote import AbstractAsyncApi
from wax._private.models.schemas import database_api  # NOQA: TCH001


class DatabaseApi(AbstractAsyncApi):
    @AbstractAsyncApi._endpoint
    async def get_dynamic_global_properties(self) -> database_api.GetDynamicGlobalProperties:
        raise NotImplementedError

    @AbstractAsyncApi._endpoint
    async def find_accounts(
        self, *, accounts: list[str], delayed_votes_active: bool | None = None
    ) -> database_api.FindAccounts:
        raise NotImplementedError
