from __future__ import annotations

from datetime import datetime  # noqa: TCH003
from typing import Literal

from beekeepy.handle.remote import AbstractSyncApi, ApiArgumentSerialization
from hiveio_api import condenser_api

from schemas.transaction import TransactionLegacy
from test_tools.__private.hived.api.condenser_api.common import CondenserApiCommons


class CondenserApi(AbstractSyncApi, CondenserApiCommons):
    api = AbstractSyncApi.endpoint_jsonrpc

    def _serialize_type(self) -> Literal["legacy"]:
        return "legacy"

    def argument_serialization(self) -> ApiArgumentSerialization:
        return ApiArgumentSerialization.ARRAY

    @api
    def get_version(self) -> condenser_api.GetVersionResponse:
        raise NotImplementedError

    @api
    def get_active_witnesses(
        self, include_future: bool = False, /
    ) -> condenser_api.CondenserGetActiveWitnessesResponse:
        raise NotImplementedError

    @api
    def get_block_header(self, block_num: int, /) -> condenser_api.CondenserGetBlockHeaderResponse:
        raise NotImplementedError

    @api
    def get_block(self, block_num: int, /) -> condenser_api.CondenserGetBlockResponse:
        raise NotImplementedError

    @api
    def get_ops_in_block(
        self, block_num: int, only_virtual: bool = False, /
    ) -> list[condenser_api.OperationCondenserApi]:
        raise NotImplementedError

    @api
    def get_config(self) -> condenser_api.CondenserGetConfigResponse:
        raise NotImplementedError

    @api
    def get_dynamic_global_properties(self) -> condenser_api.CondenserGetDynamicGlobalPropertiesResponse:
        raise NotImplementedError

    @api
    def get_chain_properties(self) -> condenser_api.CondenserGetChainPropertiesResponse:
        raise NotImplementedError

    @api
    def get_current_median_history_price(self) -> condenser_api.CondenserGetCurrentMedianHistoryPriceResponse:
        raise NotImplementedError

    @api
    def get_feed_history(self) -> condenser_api.CondenserGetFeedHistoryResponse:
        raise NotImplementedError

    @api
    def get_witness_schedule(
        self, include_future: bool = False, /
    ) -> condenser_api.CondenserGetWitnessScheduleResponse:
        raise NotImplementedError

    @api
    def get_hardfork_version(self) -> condenser_api.CondenserGetHardforkVersionResponse:
        raise NotImplementedError

    @api
    def get_next_scheduled_hardfork(self) -> condenser_api.CondenserGetNextScheduledHardforkResponse:
        raise NotImplementedError

    @api
    def get_reward_fund(self, name: str, /) -> condenser_api.CondenserGetRewardFundResponse:
        raise NotImplementedError

    @api
    def get_key_references(self, key: str, /) -> condenser_api.CondenserGetKeyReferencesResponse:
        raise NotImplementedError

    @api
    def get_accounts(
        self, accounts: list[str], delayed_votes_active: bool = True, /
    ) -> list[condenser_api.AccountExtendedCondenserApi]:
        raise NotImplementedError

    @api
    def lookup_account_names(
        self, accounts: list[str], delayed_votes_active: bool = True, /
    ) -> list[condenser_api.AccountCondenserApi | None]:
        raise NotImplementedError

    @api
    def lookup_accounts(self, lower_bound_name: str, limit: int, /) -> condenser_api.CondenserLookupAccountsResponse:
        raise NotImplementedError

    @api
    def get_account_count(self) -> condenser_api.CondenserGetAccountCountResponse:
        raise NotImplementedError

    @api
    def get_owner_history(self, owner: str, /) -> list[condenser_api.OwnerAuthHistory]:
        raise NotImplementedError

    @api
    def get_recovery_request(self, account: str, /) -> condenser_api.CondenserGetRecoveryRequestResponse:
        raise NotImplementedError

    @api
    def get_escrow(
        self, start: tuple[str, int] | tuple[bool, datetime, int], limit: int, order: CondenserApiCommons.SORT_TYPES, /
    ) -> condenser_api.CondenserGetEscrowResponse:
        raise NotImplementedError

    @api
    def get_withdraw_routes(
        self, account: str, destination: CondenserApiCommons.WITHDRAW_ROUTE_TYPES, /
    ) -> list[condenser_api.WithdrawVestingRoutes]:
        raise NotImplementedError

    @api
    def get_savings_withdraw_from(self, account: str, /) -> list[condenser_api.SavingsWithdrawalCondenserApi]:
        raise NotImplementedError

    @api
    def get_savings_withdraw_to(self, account: str, /) -> list[condenser_api.SavingsWithdrawalCondenserApi]:
        raise NotImplementedError

    @api
    def get_vesting_delegations(
        self, account: str, start: str, limit: int = 100, /
    ) -> list[condenser_api.VestingDelegationCondenserApi]:
        raise NotImplementedError

    @api
    def get_expiring_vesting_delegations(
        self, account: str, start: str, limit: int = 100, /
    ) -> list[condenser_api.VestingDelegationExpirationsCondenserApi]:
        raise NotImplementedError

    @api
    def get_witnesses(self, witness_ids: list[int], /) -> list[condenser_api.WitnessCondenserApi]:
        raise NotImplementedError

    @api
    def get_conversion_requests(self, account: str, /) -> list[condenser_api.ConversionRequest]:
        raise NotImplementedError

    @api
    def get_collateralized_conversion_requests(
        self, account: str, /
    ) -> list[condenser_api.CollateralizedConversionRequestsCondenserApi]:
        raise NotImplementedError

    @api
    def get_witness_by_account(self, account: str, /) -> condenser_api.CondenserGetWitnessByAccountResponse:
        raise NotImplementedError

    @api
    def get_witnesses_by_vote(self, start_name: str, limit: int, /) -> list[condenser_api.WitnessCondenserApi]:
        raise NotImplementedError

    @api
    def lookup_witness_accounts(
        self, start: str, limit: int, /
    ) -> condenser_api.CondenserLookupWitnessAccountsResponse:
        raise NotImplementedError

    @api
    def get_witness_count(self) -> condenser_api.CondenserGetWitnessCountResponse:
        raise NotImplementedError

    @api
    def get_open_orders(self, owner: str, /) -> list[condenser_api.LimitOrderCondenserApi]:
        raise NotImplementedError

    @api
    def get_transaction_hex(
        self, transaction: TransactionLegacy, /
    ) -> condenser_api.CondenserGetTransactionHexResponse:
        raise NotImplementedError

    @api
    def get_transaction(self, transaction_id: str, /) -> condenser_api.CondenserGetTransactionResponse:
        raise NotImplementedError

    @api
    def get_required_signatures(
        self, transaction: TransactionLegacy, public_key: str, /
    ) -> condenser_api.CondenserGetRequiredSignaturesResponse:
        raise NotImplementedError

    @api
    def get_potential_signatures(
        self, transaction: TransactionLegacy, /
    ) -> condenser_api.CondenserGetPotentialSignaturesResponse:
        raise NotImplementedError

    @api
    def verify_authority(self, transaction: TransactionLegacy, /) -> condenser_api.CondenserVerifyAuthorityResponse:
        raise NotImplementedError

    @api
    def verify_account_authority(self, transaction: TransactionLegacy, /) -> bool:
        raise NotImplementedError

    @api
    def get_active_votes(self, author: str, permlink: str, /) -> list[condenser_api.ActiveVotesDefault]:
        raise NotImplementedError

    @api
    def get_account_history(
        self,
        account: str,
        start: int,
        limit: int,
        operation_filter_low: int | None = None,
        operation_filter_high: int | None = None,
    ) -> list[condenser_api.AccountHistoryArrayCondenserApi]:
        raise NotImplementedError

    @api
    def broadcast_transaction(
        self, transaction: TransactionLegacy, /
    ) -> condenser_api.CondenserBroadcastTransactionResponse:
        raise NotImplementedError

    @api
    def broadcast_transaction_synchronous(
        self, transaction: TransactionLegacy, /
    ) -> condenser_api.CondenserBroadcastTransactionSynchronousResponse:
        raise NotImplementedError

    @api
    def get_account_reputations(self, account: str, limit: int = 1000, /) -> list[condenser_api.AccountReputation]:
        raise NotImplementedError

    @api
    def get_ticker(self) -> condenser_api.CondenserGetTickerResponse:
        raise NotImplementedError

    @api
    def get_volume(self) -> condenser_api.CondenserGetVolumeResponse:
        raise NotImplementedError

    @api
    def get_order_book(self, limit: int = 500, /) -> condenser_api.CondenserGetOrderBookResponse:
        raise NotImplementedError

    @api
    def get_trade_history(
        self, start: datetime, stop: datetime, limit: int = 1000, /
    ) -> list[condenser_api.TradeCondenserApi]:
        raise NotImplementedError

    @api
    def get_recent_trades(self, limit: int = 1000, /) -> list[condenser_api.TradeCondenserApi]:
        raise NotImplementedError

    @api
    def get_market_history(
        self, bucket_seconds: int, start: datetime, stop: datetime, /
    ) -> list[condenser_api.MarketHistory]:
        raise NotImplementedError

    @api
    def get_market_history_buckets(self) -> condenser_api.CondenserGetMarketHistoryBucketsResponse:
        raise NotImplementedError

    @api
    def is_known_transaction(self, transaction_id: str, /) -> condenser_api.CondenserIsKnownTransactionResponse:
        raise NotImplementedError

    @api
    def list_proposals(
        self,
        start: list[str] | list[int] | list[datetime],
        limit: int,
        order: CondenserApiCommons.SORT_TYPES,
        direction: CondenserApiCommons.SORT_DIRECTION = "ascending",
        status: CondenserApiCommons.PROPOSAL_STATUS = "all",
        last_id: int | None = None,
    ) -> list[condenser_api.ProposalsCondenserApi]:
        raise NotImplementedError

    @api
    def find_proposals(self, proposals_ids: list[int], /) -> list[condenser_api.ProposalsCondenserApi]:
        raise NotImplementedError

    @api
    def list_proposal_votes(
        self,
        start: list[str],
        limit: int,
        order: CondenserApiCommons.SORT_TYPES,
        order_direction: CondenserApiCommons.SORT_DIRECTION,
        status: CondenserApiCommons.PROPOSAL_STATUS,
    ) -> list[condenser_api.ProposalVoteCondenserApi]:
        raise NotImplementedError

    @api
    def find_recurrent_transfers(self, account: str, /) -> list[condenser_api.RecurrentTransferCondenserApi]:
        raise NotImplementedError

    @api
    def find_rc_accounts(self, accounts: list[str], /) -> list[condenser_api.RcAccountCondenserApi]:
        raise NotImplementedError

    @api
    def list_rc_accounts(self, start: str, limit: int, /) -> list[condenser_api.RcAccountCondenserApi]:
        raise NotImplementedError

    @api
    def list_rc_direct_delegations(
        self, start: tuple[str, str], limit: int, /
    ) -> list[condenser_api.RcAccountDelegation]:
        raise NotImplementedError
