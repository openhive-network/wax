from __future__ import annotations

from datetime import datetime  # noqa: TCH003
from typing import Any, Literal

from beekeepy.handle.remote import AbstractSyncApi, ApiArgumentSerialization
from hiveio_api.condenser_api import (
    AccountCondenserApi,
    AccountExtendedCondenserApi,
    AccountReputation,
    ActiveVotesDefault,
    CollateralizedConversionRequestsCondenserApi,
    CondenserBroadcastTransactionResponse,
    CondenserBroadcastTransactionSynchronousResponse,
    CondenserGetBlockHeaderResponse,
    CondenserGetBlockResponse,
    CondenserGetChainPropertiesResponse,
    CondenserGetConfigResponse,
    CondenserGetCurrentMedianHistoryPriceResponse,
    CondenserGetDynamicGlobalPropertiesResponse,
    CondenserGetFeedHistoryResponse,
    CondenserGetNextScheduledHardforkResponse,
    CondenserGetOrderBookResponse,
    CondenserGetPotentialSignaturesResponse,
    CondenserGetRewardFundResponse,
    CondenserGetTickerResponse,
    CondenserGetTransactionResponse,
    CondenserGetVolumeResponse,
    CondenserGetWitnessScheduleResponse,
    ConversionRequest,
    GetVersionResponse,
    LimitOrderCondenserApi,
    MarketHistory,
    OperationCondenserApi,
    OwnerAuthHistory,
    ProposalsCondenserApi,
    ProposalVoteCondenserApi,
    RcAccountCondenserApi,
    RcAccountDelegation,
    RecurrentTransferCondenserApi,
    SavingsWithdrawalCondenserApi,
    TradeCondenserApi,
    VestingDelegationCondenserApi,
    VestingDelegationExpirationsCondenserApi,
    WithdrawVestingRoutes,
    WitnessCondenserApi,
)

from schemas.apis.condenser_api import GetEscrow, GetRecoveryRequest, GetWitnessByAccount, VerifyAccountAuthority
from schemas.transaction import TransactionLegacy
from test_tools.__private.hived.api.condenser_api.common import CondenserApiCommons


class CondenserApi(AbstractSyncApi, CondenserApiCommons):
    api = AbstractSyncApi.endpoint_jsonrpc

    def _serialize_type(self) -> Literal["legacy"]:
        return "legacy"

    def argument_serialization(self) -> ApiArgumentSerialization:
        return ApiArgumentSerialization.ARRAY

    @api
    def get_version(self) -> GetVersionResponse:
        raise NotImplementedError

    @api
    def get_active_witnesses(self, include_future: bool = False, /) -> list[str]:
        raise NotImplementedError

    @api
    def get_block_header(self, block_num: int, /) -> CondenserGetBlockHeaderResponse:
        raise NotImplementedError

    @api
    def get_block(self, block_num: int, /) -> CondenserGetBlockResponse:
        raise NotImplementedError

    @api
    def get_ops_in_block(self, block_num: int, only_virtual: bool = False, /) -> list[OperationCondenserApi]:
        raise NotImplementedError

    @api
    def get_config(self) -> CondenserGetConfigResponse:
        raise NotImplementedError

    @api
    def get_dynamic_global_properties(self) -> CondenserGetDynamicGlobalPropertiesResponse:
        raise NotImplementedError

    @api
    def get_chain_properties(self) -> CondenserGetChainPropertiesResponse:
        raise NotImplementedError

    @api
    def get_current_median_history_price(self) -> CondenserGetCurrentMedianHistoryPriceResponse:
        raise NotImplementedError

    @api
    def get_feed_history(self) -> CondenserGetFeedHistoryResponse:
        raise NotImplementedError

    @api
    def get_witness_schedule(self, include_future: bool = False, /) -> CondenserGetWitnessScheduleResponse:
        raise NotImplementedError

    @api
    def get_hardfork_version(self) -> str:
        raise NotImplementedError

    @api
    def get_next_scheduled_hardfork(self) -> CondenserGetNextScheduledHardforkResponse:
        raise NotImplementedError

    @api
    def get_reward_fund(self, name: str, /) -> CondenserGetRewardFundResponse:
        raise NotImplementedError

    @api
    def get_key_references(self, key: str, /) -> list[list[str]]:
        raise NotImplementedError

    @api
    def get_accounts(
        self, accounts: list[str], delayed_votes_active: bool = True, /
    ) -> list[AccountExtendedCondenserApi]:
        raise NotImplementedError

    @api
    def lookup_account_names(
        self, accounts: list[str], delayed_votes_active: bool = True, /
    ) -> list[AccountCondenserApi]:
        raise NotImplementedError

    @api
    def lookup_accounts(self, lower_bound_name: str, limit: int, /) -> list[str]:
        raise NotImplementedError

    @api
    def get_account_count(self) -> int:
        raise NotImplementedError

    @api
    def get_owner_history(self, owner: str, /) -> list[OwnerAuthHistory]:
        raise NotImplementedError

    @api
    def get_recovery_request(self, account: str, /) -> GetRecoveryRequest:
        raise NotImplementedError

    @api
    def get_escrow(
        self, start: tuple[str, int] | tuple[bool, datetime, int], limit: int, order: CondenserApiCommons.SORT_TYPES, /
    ) -> GetEscrow:
        raise NotImplementedError

    @api
    def get_withdraw_routes(
        self, account: str, destination: CondenserApiCommons.WITHDRAW_ROUTE_TYPES, /
    ) -> list[WithdrawVestingRoutes]:
        raise NotImplementedError

    @api
    def get_savings_withdraw_from(self, account: str, /) -> list[SavingsWithdrawalCondenserApi]:
        raise NotImplementedError

    @api
    def get_savings_withdraw_to(self, account: str, /) -> list[SavingsWithdrawalCondenserApi]:
        raise NotImplementedError

    @api
    def get_vesting_delegations(
        self, account: str, start: str, limit: int = 100, /
    ) -> list[VestingDelegationCondenserApi]:
        raise NotImplementedError

    @api
    def get_expiring_vesting_delegations(
        self, account: str, start: str, limit: int = 100, /
    ) -> list[VestingDelegationExpirationsCondenserApi]:
        raise NotImplementedError

    @api
    def get_witnesses(self, witness_ids: list[int], /) -> list[WitnessCondenserApi]:
        raise NotImplementedError

    @api
    def get_conversion_requests(self, account: str, /) -> list[ConversionRequest]:
        raise NotImplementedError

    @api
    def get_collateralized_conversion_requests(
        self, account: str, /
    ) -> list[CollateralizedConversionRequestsCondenserApi]:
        raise NotImplementedError

    @api
    def get_witness_by_account(self, account: str, /) -> GetWitnessByAccount:
        raise NotImplementedError

    @api
    def get_witnesses_by_vote(self, start_name: str, limit: int, /) -> list[WitnessCondenserApi]:
        raise NotImplementedError

    @api
    def lookup_witness_accounts(self, start: str, limit: int, /) -> list[str]:
        raise NotImplementedError

    @api
    def get_witness_count(self) -> int:
        raise NotImplementedError

    @api
    def get_open_orders(self, owner: str, /) -> list[LimitOrderCondenserApi]:
        raise NotImplementedError

    @api
    def get_transaction_hex(self, transaction: TransactionLegacy, /) -> str:
        raise NotImplementedError

    @api
    def get_transaction(self, transaction_id: str, /) -> CondenserGetTransactionResponse:
        raise NotImplementedError

    @api
    def get_required_signatures(self, transaction: TransactionLegacy, public_key: str, /) -> list[Any]:
        raise NotImplementedError

    @api
    def get_potential_signatures(self, transaction: TransactionLegacy, /) -> CondenserGetPotentialSignaturesResponse:
        raise NotImplementedError

    @api
    def verify_authority(self, transaction: TransactionLegacy, /) -> bool:
        raise NotImplementedError

    @api
    def verify_account_authority(self, transaction: TransactionLegacy, /) -> VerifyAccountAuthority:
        raise NotImplementedError

    @api
    def get_active_votes(self, author: str, permlink: str, /) -> list[ActiveVotesDefault]:
        raise NotImplementedError

    @api
    def get_account_history(
        self,
        account: str,
        start: int,
        limit: int,
        operation_filter_low: int | None = None,
        operation_filter_high: int | None = None,
    ) -> list[list]:
        raise NotImplementedError

    @api
    def broadcast_transaction(self, transaction: TransactionLegacy, /) -> CondenserBroadcastTransactionResponse:
        raise NotImplementedError

    @api
    def broadcast_transaction_synchronous(
        self, transaction: TransactionLegacy, /
    ) -> CondenserBroadcastTransactionSynchronousResponse:
        raise NotImplementedError

    @api
    def get_account_reputations(self, account: str, limit: int = 1000, /) -> list[AccountReputation]:
        raise NotImplementedError

    @api
    def get_ticker(self) -> CondenserGetTickerResponse:
        raise NotImplementedError

    @api
    def get_volume(self) -> CondenserGetVolumeResponse:
        raise NotImplementedError

    @api
    def get_order_book(self, limit: int = 500, /) -> CondenserGetOrderBookResponse:
        raise NotImplementedError

    @api
    def get_trade_history(self, start: datetime, stop: datetime, limit: int = 1000, /) -> list[TradeCondenserApi]:
        raise NotImplementedError

    @api
    def get_recent_trades(self, limit: int = 1000, /) -> list[TradeCondenserApi]:
        raise NotImplementedError

    @api
    def get_market_history(self, bucket_seconds: int, start: datetime, stop: datetime, /) -> list[MarketHistory]:
        raise NotImplementedError

    @api
    def get_market_history_buckets(self) -> list[int]:
        raise NotImplementedError

    @api
    def is_known_transaction(self, transaction_id: str, /) -> bool:
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
    ) -> list[ProposalsCondenserApi]:
        raise NotImplementedError

    @api
    def find_proposals(self, proposals_ids: list[int], /) -> list[ProposalsCondenserApi]:
        raise NotImplementedError

    @api
    def list_proposal_votes(
        self,
        start: list[str],
        limit: int,
        order: CondenserApiCommons.SORT_TYPES,
        order_direction: CondenserApiCommons.SORT_DIRECTION,
        status: CondenserApiCommons.PROPOSAL_STATUS,
    ) -> list[ProposalVoteCondenserApi]:
        raise NotImplementedError

    @api
    def find_recurrent_transfers(self, account: str, /) -> list[RecurrentTransferCondenserApi]:
        raise NotImplementedError

    @api
    def find_rc_accounts(self, accounts: list[str], /) -> list[RcAccountCondenserApi]:
        raise NotImplementedError

    @api
    def list_rc_accounts(self, start: str, limit: int, /) -> list[RcAccountCondenserApi]:
        raise NotImplementedError

    @api
    def list_rc_direct_delegations(self, start: tuple[str, str], limit: int, /) -> list[RcAccountDelegation]:
        raise NotImplementedError
