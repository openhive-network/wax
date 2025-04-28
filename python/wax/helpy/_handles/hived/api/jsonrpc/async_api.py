from __future__ import annotations

from schemas.apis import jsonrpc

from beekeepy.handle.remote import AbstractAsyncApi


class Jsonrpc(AbstractAsyncApi):
    api = AbstractAsyncApi.endpoint

    @api
    async def get_methods(self) -> jsonrpc.GetMethods:
        raise NotImplementedError

    @api
    async def get_signature(self, *, method: str = "") -> jsonrpc.GetSignature:
        raise NotImplementedError
