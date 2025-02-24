from __future__ import annotations

from schemas.apis import block_api

from beekeepy._remote_handle.abc.api import AbstractAsyncApi


class BlockApi(AbstractAsyncApi):
    api = AbstractAsyncApi._endpoint

    @api
    async def get_block_header(self, *, block_num: int) -> block_api.GetBlockHeader:
        raise NotImplementedError

    @api
    async def get_block(self, *, block_num: int) -> block_api.GetBlock:
        raise NotImplementedError

    @api
    async def get_block_range(self, starting_block_num: int, count: int) -> block_api.GetBlockRange:
        raise NotImplementedError
