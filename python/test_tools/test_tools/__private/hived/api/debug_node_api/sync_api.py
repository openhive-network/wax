from __future__ import annotations

from datetime import datetime  # noqa: TCH003

import hiveio_api._validation.debug_node_api as debug_node_validation  # validation models (Hive types)
from beekeepy.handle.remote import AbstractSyncApi
from hiveio_api import debug_node_api

from schemas.fields.compound import Price
from schemas.fields.hex import TransactionId


class DebugNodeApi(AbstractSyncApi):
    api = AbstractSyncApi.endpoint_jsonrpc

    @api
    def debug_generate_blocks(
        self, *, debug_key: str, count: int = 0, skip: int = 0, miss_blocks: int = 0
    ) -> debug_node_api.DebugGenerateBlocksResponse:
        raise NotImplementedError

    @api
    def debug_generate_blocks_until(
        self, *, debug_key: str, head_block_time: datetime, generate_sparsely: bool = True
    ) -> debug_node_api.DebugGenerateBlocksUntilResponse:
        raise NotImplementedError

    @api
    def debug_get_head_block(self) -> debug_node_validation.DebugGetHeadBlockResponse:
        raise NotImplementedError

    @api
    def debug_get_witness_schedule(self) -> debug_node_api.DebugGetWitnessScheduleResponse:
        raise NotImplementedError

    @api
    def debug_get_future_witness_schedule(self) -> debug_node_api.DebugGetWitnessScheduleResponse:
        raise NotImplementedError

    @api
    def debug_get_hardfork_property_object(self) -> debug_node_api.DebugGetHardforkPropertyObjectResponse:
        raise NotImplementedError

    @api
    def debug_set_hardfork(self, *, hardfork_id: int) -> debug_node_api.DebugSetHardforkResponse:
        raise NotImplementedError

    @api
    def debug_has_hardfork(self, *, hardfork_id: int) -> debug_node_api.DebugHasHardforkResponse:
        raise NotImplementedError

    @api
    def debug_set_vest_price(self, *, vest_price: Price) -> debug_node_api.DebugSetVestPriceResponse:
        raise NotImplementedError

    @api
    def debug_get_json_schema(self) -> debug_node_api.DebugGetJsonSchemaResponse:
        raise NotImplementedError

    @api
    def debug_throw_exception(self, throw_exception: bool = False) -> debug_node_api.DebugThrowExceptionResponse:
        raise NotImplementedError

    @api
    def debug_fail_transaction(self, tx_id: TransactionId) -> debug_node_validation.DebugNodeFailTransactionResponse:
        raise NotImplementedError
