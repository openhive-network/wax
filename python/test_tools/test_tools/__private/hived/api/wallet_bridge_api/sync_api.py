from __future__ import annotations

from datetime import datetime  # noqa: TCH003

from beekeepy.handle.remote import AbstractSyncApi, ApiArgumentSerialization
from hiveio_api._validation import wallet_bridge_api  # validation models: responses decoded with Hive types

from schemas.transaction import Transaction
from test_tools.__private.hived.api.wallet_bridge_api.common import WalletBridgeApiCommons


class WalletBridgeApi(AbstractSyncApi, WalletBridgeApiCommons):
    api = AbstractSyncApi.endpoint_jsonrpc

    def argument_serialization(self) -> ApiArgumentSerialization:
        return ApiArgumentSerialization.DOUBLE_ARRAY

    @api
    def get_version(self) -> wallet_bridge_api.GetVersionResponse:
        raise NotImplementedError

    @api
    def get_block(self, block: int, /) -> wallet_bridge_api.GetBlockResponse:
        raise NotImplementedError

    @api
    def get_chain_properties(self) -> wallet_bridge_api.WitnessProps:
        raise NotImplementedError

    @api
    def get_witness_schedule(self) -> wallet_bridge_api.GetWitnessScheduleResponse:
        raise NotImplementedError

    @api
    def get_current_median_history_price(self) -> wallet_bridge_api.GetCurrentPriceFeedResponse:
        raise NotImplementedError

    @api
    def get_hardfork_version(self) -> str:
        raise NotImplementedError

    @api
    def get_ops_in_block(self, block: int, only_virtual: bool = False, /) -> wallet_bridge_api.GetOpsInBlockResponse:
        raise NotImplementedError

    @api
    def get_feed_history(self) -> wallet_bridge_api.GetFeedHistoryResponse:
        raise NotImplementedError

    @api
    def get_active_witnesses(self, include_future: bool, /) -> wallet_bridge_api.GetActiveWitnessesResponse:
        raise NotImplementedError

    @api
    def get_withdraw_routes(
        self, account: str, destination: WalletBridgeApiCommons.WITHDRAW_ROUTE_TYPES, /
    ) -> list[wallet_bridge_api.WithdrawVestingRoutes]:
        raise NotImplementedError

    @api
    def list_my_accounts(self, accounts: list[str], /) -> list[wallet_bridge_api.AccountDefault]:
        raise NotImplementedError

    @api
    def list_accounts(self, start: str, limit: int, /) -> wallet_bridge_api.WalletBridgeListAccountsResponse:
        raise NotImplementedError

    @api
    def get_dynamic_global_properties(self) -> wallet_bridge_api.GetDynamicGlobalPropertiesResponse:
        raise NotImplementedError

    @api
    def get_account(self, account: str, /) -> wallet_bridge_api.WalletBridgeGetAccountResponse1 | None:
        raise NotImplementedError

    @api
    def get_accounts(self, accounts: list[str], /) -> list[wallet_bridge_api.AccountDefault]:
        raise NotImplementedError

    @api
    def get_transaction(self, transaction_id: str, /) -> wallet_bridge_api.GetTransactionResponse:
        raise NotImplementedError

    @api
    def list_witnesses(self, start: str, limit: int, /) -> wallet_bridge_api.ListWitnessesResponse:
        raise NotImplementedError

    @api
    def get_witness(self, witness: str, /) -> wallet_bridge_api.WalletBridgeGetWitnessResponse1 | None:
        raise NotImplementedError

    @api
    def get_conversion_requests(self, account: str, /) -> list[wallet_bridge_api.HbdConversion]:
        raise NotImplementedError

    @api
    def get_collateralized_conversion_requests(
        self, account: str, /
    ) -> list[wallet_bridge_api.CollateralizedConversionRequestsDefault]:
        raise NotImplementedError

    @api
    def get_order_book(self, limit: int, /) -> wallet_bridge_api.MarketHistoryGetOrderBookResponse:
        raise NotImplementedError

    @api
    def get_open_orders(self, account: str, /) -> list[wallet_bridge_api.LimitOrderDefault]:
        raise NotImplementedError

    @api
    def get_owner_history(self, account: str, /) -> wallet_bridge_api.FindOwnerHistoriesResponse:
        raise NotImplementedError

    @api
    def get_account_history(
        self, account: str, start: int, limit: int, /
    ) -> list[list[int | wallet_bridge_api.AccountHistoryArray1]]:
        raise NotImplementedError

    @api
    def list_proposals(
        self,
        start: datetime,
        limit: int,
        order: WalletBridgeApiCommons.SORT_TYPES,
        direction: WalletBridgeApiCommons.SORT_DIRECTION,
        status: WalletBridgeApiCommons.PROPOSAL_STATUS,
    ) -> wallet_bridge_api.ListProposalsResponse:
        raise NotImplementedError

    @api
    def find_proposals(self, proposal_ids: list[int], /) -> wallet_bridge_api.FindProposalsResponse:
        raise NotImplementedError

    @api
    def is_known_transaction(self, transaction_id: str, /) -> bool:
        raise NotImplementedError

    @api
    def list_proposal_votes(
        self,
        start: datetime,
        limit: int,
        order: WalletBridgeApiCommons.SORT_TYPES,
        direction: WalletBridgeApiCommons.SORT_DIRECTION,
        status: WalletBridgeApiCommons.PROPOSAL_STATUS,
    ) -> wallet_bridge_api.ListProposalVotesResponse:
        raise NotImplementedError

    @api
    def get_reward_fund(self, reward_fund_account: str, /) -> wallet_bridge_api.RewardFundsDefault:
        raise NotImplementedError

    @api
    def broadcast_transaction_synchronous(
        self, transaction: Transaction, /
    ) -> wallet_bridge_api.BroadcastTransactionSynchronous:
        raise NotImplementedError

    @api
    def broadcast_transaction(self, transaction: Transaction, /) -> wallet_bridge_api.BroadcastTransactionResponse:
        raise NotImplementedError

    @api
    def find_recurrent_transfers(self, account: str, /) -> list[wallet_bridge_api.RecurrentTransferDefault]:
        raise NotImplementedError

    @api
    def find_rc_accounts(self, accounts: list[str], /) -> list[wallet_bridge_api.RcAccountDefault]:
        raise NotImplementedError

    @api
    def list_rc_accounts(self, start: str, limit: int, /) -> list[wallet_bridge_api.RcAccountDefault]:
        raise NotImplementedError

    @api
    def list_rc_direct_delegations(
        self, start: tuple[str, str], limit: int, /
    ) -> list[wallet_bridge_api.RcAccountDelegation]:
        raise NotImplementedError
