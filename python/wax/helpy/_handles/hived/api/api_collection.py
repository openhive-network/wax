from __future__ import annotations

from typing import TYPE_CHECKING

from beekeepy.handle.remote import AppStatusProbeAsyncApiCollection
from wax.helpy._handles.hived.api.account_by_key_api import AsyncAccountByKeyApi
from wax.helpy._handles.hived.api.account_history_api import AsyncAccountHistoryApi
from wax.helpy._handles.hived.api.block_api import AsyncBlockApi
from wax.helpy._handles.hived.api.condenser_api import AsyncCondenserApi
from wax.helpy._handles.hived.api.database_api import AsyncDatabaseApi
from wax.helpy._handles.hived.api.debug_node_api import AsyncDebugNodeApi
from wax.helpy._handles.hived.api.jsonrpc import AsyncJsonrpc
from wax.helpy._handles.hived.api.market_history_api import AsyncMarketHistoryApi
from wax.helpy._handles.hived.api.network_broadcast_api import AsyncNetworkBroadcastApi
from wax.helpy._handles.hived.api.network_node_api import AsyncNetworkNodeApi
from wax.helpy._handles.hived.api.rc_api import AsyncRcApi
from wax.helpy._handles.hived.api.reputation_api import AsyncReputationApi
from wax.helpy._handles.hived.api.transaction_status_api import AsyncTransactionStatusApi
from wax.helpy._handles.hived.api.wallet_bridge_api import AsyncWalletBridgeApi

if TYPE_CHECKING:
    from beekeepy.handle.remote import AsyncSendable


class HivedAsyncApiCollection(AppStatusProbeAsyncApiCollection):
    def __init__(self, owner: AsyncSendable) -> None:
        super().__init__(owner)
        self.account_by_key = AsyncAccountByKeyApi(owner=self._owner)
        self.account_history = AsyncAccountHistoryApi(owner=self._owner)
        self.block = AsyncBlockApi(owner=self._owner)
        self.condenser = AsyncCondenserApi(owner=self._owner)
        self.database = AsyncDatabaseApi(owner=self._owner)
        self.debug_node = AsyncDebugNodeApi(owner=self._owner)
        self.jsonrpc = AsyncJsonrpc(owner=self._owner)
        self.market_history = AsyncMarketHistoryApi(owner=self._owner)
        self.network_broadcast = AsyncNetworkBroadcastApi(owner=self._owner)
        self.network_node = AsyncNetworkNodeApi(owner=self._owner)
        self.rc = AsyncRcApi(owner=self._owner)
        self.reputation = AsyncReputationApi(owner=self._owner)
        self.transaction_status = AsyncTransactionStatusApi(owner=self._owner)
        self.wallet_bridge = AsyncWalletBridgeApi(owner=self._owner)

        self.account_by_key_api = self.account_by_key
        self.account_history_api = self.account_history
        self.block_api = self.block
        self.condenser_api = self.condenser
        self.database_api = self.database
        self.debug_node_api = self.debug_node
        self.jsonrpc_api = self.jsonrpc
        self.market_history_api = self.market_history
        self.network_broadcast_api = self.network_broadcast
        self.network_node_api = self.network_node
        self.rc_api = self.rc
        self.reputation_api = self.reputation
        self.transaction_status_api = self.transaction_status
        self.wallet_bridge_api = self.wallet_bridge
