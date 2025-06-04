from __future__ import annotations

from schemas.apis import witness_api

from beekeepy.handle.remote import AbstractAsyncApi
from wax.helpy._handles.hived.api.wallet_bridge_api.common import WalletBridgeApiCommons


class WitnessApi(AbstractAsyncApi, WalletBridgeApiCommons):
    api = AbstractAsyncApi.endpoint

    @api
    async def enable_fast_confirm(self) -> witness_api.EnableFastConfirm:
        raise NotImplementedError

    @api
    async def disable_fast_confirm(self) -> witness_api.DisableFastConfirm:
        raise NotImplementedError

    @api
    async def is_fast_confirm_enabled(self) -> witness_api.IsFastConfirmEnabled:
        raise NotImplementedError
