from __future__ import annotations

from schemas.apis import block_api

from beekeepy.handle.remote import AbstractSyncApi


class BlockApi(AbstractSyncApi):
    api = AbstractSyncApi.endpoint_jsonrpc

    @api
    def get_block_header(self, *, block_num: int) -> block_api.GetBlockHeader:
        raise NotImplementedError

    @api
    def get_block(self, *, block_num: int) -> block_api.GetBlock:
        raise NotImplementedError

    @api
    def get_block_range(self, starting_block_num: int, count: int) -> block_api.GetBlockRange:
        raise NotImplementedError
