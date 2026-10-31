"""
Responses of wallet_bridge_api under the names used by test_tools (`wallet_bridge_api.GetVersion`, ...).

The aliases are defined at runtime - the API (`sync_api.py`) is built from the annotations of its methods.
"""

from __future__ import annotations

from typing import TypeAlias

from hiveio_api import wallet_bridge_api

BroadcastTransaction: TypeAlias = wallet_bridge_api.BroadcastTransactionResponse
BroadcastTransactionSynchronous: TypeAlias = wallet_bridge_api.BroadcastTransactionSynchronous
FindProposals: TypeAlias = wallet_bridge_api.FindProposalsResponse
FindRcAccounts: TypeAlias = list[wallet_bridge_api.RcAccount]
FindRecurrentTransfers: TypeAlias = list[wallet_bridge_api.RecurrentTransfer]
GetAccount: TypeAlias = wallet_bridge_api.Account | None
GetAccountHistory: TypeAlias = list[list[int | wallet_bridge_api.Operation]]
GetAccounts: TypeAlias = list[wallet_bridge_api.Account]
GetActiveWitnesses: TypeAlias = wallet_bridge_api.GetActiveWitnessesResponse
GetBlock: TypeAlias = wallet_bridge_api.GetBlockResponse
GetChainProperties: TypeAlias = wallet_bridge_api.WitnessProps
GetCollateralizedConversionRequests: TypeAlias = list[wallet_bridge_api.CollateralizedConversionRequests]
GetConversionRequests: TypeAlias = list[wallet_bridge_api.HbdConversion]
GetCurrentMedianHistoryPrice: TypeAlias = wallet_bridge_api.GetCurrentPriceFeedResponse
GetDynamicGlobalProperties: TypeAlias = wallet_bridge_api.GetDynamicGlobalPropertiesResponse
GetFeedHistory: TypeAlias = wallet_bridge_api.GetFeedHistoryResponse
GetHardforkVersion: TypeAlias = str
GetOpenOrders: TypeAlias = list[wallet_bridge_api.LimitOrder]
GetOpsInBlock: TypeAlias = wallet_bridge_api.GetOpsInBlockResponse
GetOrderBook: TypeAlias = wallet_bridge_api.MarketHistoryGetOrderBookResponse
GetOwnerHistory: TypeAlias = wallet_bridge_api.FindOwnerHistoriesResponse
GetRewardFund: TypeAlias = wallet_bridge_api.RewardFunds
GetTransaction: TypeAlias = wallet_bridge_api.GetTransactionResponse
GetVersion: TypeAlias = wallet_bridge_api.GetVersionResponse
GetWithdrawRoutes: TypeAlias = list[wallet_bridge_api.WithdrawVestingRoutes]
GetWitness: TypeAlias = wallet_bridge_api.Witness | None
GetWitnessSchedule: TypeAlias = wallet_bridge_api.GetWitnessScheduleResponse
IsKnownTransaction: TypeAlias = bool
ListAccounts: TypeAlias = wallet_bridge_api.WalletBridgeListAccountsResponse
ListMyAccounts: TypeAlias = list[wallet_bridge_api.Account]
ListProposalVotes: TypeAlias = wallet_bridge_api.ListProposalVotesResponse
ListProposals: TypeAlias = wallet_bridge_api.ListProposalsResponse
ListRcAccounts: TypeAlias = list[wallet_bridge_api.RcAccount]
ListRcDirectDelegations: TypeAlias = list[wallet_bridge_api.RcAccountDelegation]
ListWitnesses: TypeAlias = wallet_bridge_api.ListWitnessesResponse
