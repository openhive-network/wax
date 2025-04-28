from __future__ import annotations

from datetime import datetime  # noqa: TCH003

from schemas.apis import market_history_api

from beekeepy.handle.remote import AbstractSyncApi
from wax.helpy._interfaces.asset import Hf26Asset


class MarketHistoryApi(AbstractSyncApi):
    api = AbstractSyncApi.endpoint

    @api
    def get_ticker(self) -> market_history_api.GetTicker[Hf26Asset.HiveT, Hf26Asset.HbdT]:
        raise NotImplementedError

    @api
    def get_volume(self) -> market_history_api.GetVolume[Hf26Asset.HiveT, Hf26Asset.HbdT]:
        raise NotImplementedError

    @api
    def get_order_book(
        self, *, limit: int = 500
    ) -> market_history_api.GetOrderBook[Hf26Asset.HiveT, Hf26Asset.HbdT, Hf26Asset.VestsT]:
        raise NotImplementedError

    @api
    def get_trade_history(
        self, *, start: datetime, end: datetime, limit: int = 1000
    ) -> market_history_api.GetTradeHistory:
        raise NotImplementedError

    @api
    def get_recent_trades(self, *, limit: int = 1000) -> market_history_api.GetRecentTrades:
        raise NotImplementedError

    @api
    def get_market_history(
        self, *, start: datetime, end: datetime, bucket_seconds: int = 0
    ) -> market_history_api.GetMarketHistory:
        raise NotImplementedError

    @api
    def get_market_history_buckets(self) -> market_history_api.GetMarketHistoryBuckets:
        raise NotImplementedError
