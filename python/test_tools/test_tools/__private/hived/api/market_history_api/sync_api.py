from __future__ import annotations

from datetime import datetime  # noqa: TCH003

from beekeepy.handle.remote import AbstractSyncApi
from hiveio_api import market_history_api


class MarketHistoryApi(AbstractSyncApi):
    api = AbstractSyncApi.endpoint_jsonrpc

    @api
    def get_ticker(self) -> market_history_api.GetTickerResponse:
        raise NotImplementedError

    @api
    def get_volume(self) -> market_history_api.GetVolumeResponse:
        raise NotImplementedError

    @api
    def get_order_book(self, *, limit: int = 500) -> market_history_api.MarketHistoryGetOrderBookResponse:
        raise NotImplementedError

    @api
    def get_trade_history(
        self, *, start: datetime, end: datetime, limit: int = 1000
    ) -> market_history_api.GetTradeHistoryResponse:
        raise NotImplementedError

    @api
    def get_recent_trades(self, *, limit: int = 1000) -> market_history_api.GetRecentTradesResponse:
        raise NotImplementedError

    @api
    def get_market_history(
        self, *, start: datetime, end: datetime, bucket_seconds: int = 0
    ) -> market_history_api.GetMarketHistoryResponse:
        raise NotImplementedError

    @api
    def get_market_history_buckets(self) -> market_history_api.GetMarketHistoryBucketsResponse:
        raise NotImplementedError
