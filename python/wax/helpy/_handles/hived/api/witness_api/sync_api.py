from __future__ import annotations

from schemas.apis import witness_api

from beekeepy.handle.remote import AbstractSyncApi, ApiArgumentSerialization
from wax.helpy._handles.hived.api.wallet_bridge_api.common import WalletBridgeApiCommons


class WitnessApi(AbstractSyncApi, WalletBridgeApiCommons):
    api = AbstractSyncApi.endpoint

    def argument_serialization(self) -> ApiArgumentSerialization:
        return ApiArgumentSerialization.OBJECT

    @api
    def enable_fast_confirm(self) -> witness_api.EnableFastConfirm:
        raise NotImplementedError

    @api
    def disable_fast_confirm(self) -> witness_api.DisableFastConfirm:
        raise NotImplementedError

    @api
    def is_fast_confirm_enabled(self) -> witness_api.IsFastConfirmEnabled:
        raise NotImplementedError
