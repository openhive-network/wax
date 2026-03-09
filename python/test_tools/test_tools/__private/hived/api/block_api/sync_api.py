from __future__ import annotations

from beekeepy.handle.remote import AbstractSyncApi

from hiveio_api import block_api


class BlockApi(AbstractSyncApi):
    api = AbstractSyncApi.endpoint_jsonrpc

    @api
    def get_block_header(self, *, block_num: int) -> block_api.GetBlockHeaderResponse:
        raise NotImplementedError

    @api
    def get_block(self, *, block_num: int) -> block_api.GetBlockResponse:
        raise NotImplementedError

    @api
    def get_block_range(self, starting_block_num: int, count: int) -> block_api.GetBlockRangeResponse:
        raise NotImplementedError
