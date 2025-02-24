from __future__ import annotations

from schemas.apis import jsonrpc

from beekeepy._remote_handle.abc.api import AbstractSyncApi


class Jsonrpc(AbstractSyncApi):
    api = AbstractSyncApi._endpoint

    @api
    def get_methods(self) -> jsonrpc.GetMethods:
        raise NotImplementedError

    @api
    def get_signature(self, *, method: str = "") -> jsonrpc.GetSignature:
        raise NotImplementedError
