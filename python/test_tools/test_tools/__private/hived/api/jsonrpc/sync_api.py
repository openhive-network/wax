from __future__ import annotations

from beekeepy.handle.remote import AbstractSyncApi
from hiveio_api import jsonrpc


class Jsonrpc(AbstractSyncApi):
    api = AbstractSyncApi.endpoint_jsonrpc

    @api
    def get_methods(self) -> list[str]:
        raise NotImplementedError

    @api
    def get_signature(self, *, method: str = "") -> jsonrpc.GetSignatureResponse:
        raise NotImplementedError
