from __future__ import annotations

from beekeepy.handle.remote import AbstractSyncApi
from hiveio_api import rc_api


class RcApi(AbstractSyncApi):
    api = AbstractSyncApi.endpoint_jsonrpc

    @api
    def find_rc_accounts(self, *, accounts: list[str], refresh_mana: bool = False) -> rc_api.FindRcAccountsResponse:
        raise NotImplementedError

    @api
    def get_resource_params(self) -> rc_api.GetResourceParamsResponse:
        raise NotImplementedError

    @api
    def get_resource_pool(self) -> rc_api.GetResourcePoolResponse:
        raise NotImplementedError

    @api
    def list_rc_accounts(self, *, accounts: list[str], refresh_mana: bool = False) -> rc_api.ListRcAccountsResponse:
        raise NotImplementedError

    @api
    def list_rc_direct_delegations(
        self, *, start: tuple[str, str], limit: int
    ) -> rc_api.ListRcDirectDelegationsResponse:
        raise NotImplementedError
