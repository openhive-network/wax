//! DTOs of the `database_api` namespace.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/api/database_api/`. The TS
//! response interfaces carry stale Steem-era fields (`confidential_supply`,
//! `smt_creation_fee`, `sps_interval_ledger`, …) that nodes no longer emit;
//! since typed deserialization enforces field presence, the Rust DTOs follow
//! the fields the node actually reflects (`database_api_objects.hpp`)
//! instead.

use serde::{Deserialize, Serialize};

use crate::hive_api;
use crate::models::asset::NaiAsset;
use crate::models::basic::{AccountName, Hex, HiveDateTime};

use super::types::{
    ApiAccount, ApiTransaction, ApiWitness, NumberOrString, TransactionPackType,
};

/// `database_api` JSON-RPC namespace of
/// [`DefaultHiveApi`](super::DefaultHiveApi).
#[hive_api]
pub trait DatabaseApi {
    /// Returns the requested accounts.
    async fn find_accounts(params: FindAccountsRequest)
    -> FindAccountsResponse;
    /// Returns the requested witnesses.
    async fn find_witnesses(
        params: FindWitnessesRequest,
    ) -> FindWitnessesResponse;
    /// Returns the current dynamic global properties.
    async fn get_dynamic_global_properties(
        params: GetDynamicGlobalPropertiesRequest,
    ) -> GetDynamicGlobalPropertiesResponse;
    /// Returns the current witness schedule.
    async fn get_witness_schedule(
        params: GetWitnessScheduleRequest,
    ) -> GetWitnessScheduleResponse;
    /// Verifies that a signed transaction carries the authorities it
    /// requires.
    async fn verify_authority(
        params: VerifyAuthorityRequest,
    ) -> VerifyAuthorityResponse;
}

/// Represents the parameters of `database_api.find_accounts`.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct FindAccountsRequest {
    pub accounts: Vec<AccountName>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub delayed_votes_active: Option<bool>,
}

/// Represents the result of `database_api.find_accounts`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FindAccountsResponse {
    pub accounts: Vec<ApiAccount>,
}

/// Represents the parameters of `database_api.find_witnesses`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FindWitnessesRequest {
    pub owners: Vec<AccountName>,
    pub delayed_votes_active: bool,
}

/// Represents the result of `database_api.find_witnesses`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FindWitnessesResponse {
    pub witnesses: Vec<ApiWitness>,
}

/// Represents the (empty) parameters of
/// `database_api.get_dynamic_global_properties`.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct GetDynamicGlobalPropertiesRequest {}

/// Represents the result of `database_api.get_dynamic_global_properties`.
///
/// Field types follow the node's `api_dynamic_global_property_object`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GetDynamicGlobalPropertiesResponse {
    pub id: u32,
    pub head_block_number: u32,
    pub head_block_id: Hex,
    pub time: HiveDateTime,
    pub current_witness: AccountName,
    pub total_pow: NumberOrString,
    pub num_pow_witnesses: u32,
    pub virtual_supply: NaiAsset,
    pub current_supply: NaiAsset,
    pub init_hbd_supply: NaiAsset,
    pub current_hbd_supply: NaiAsset,
    pub total_vesting_fund_hive: NaiAsset,
    pub total_vesting_shares: NaiAsset,
    pub pending_rewarded_vesting_shares: NaiAsset,
    pub pending_rewarded_vesting_hive: NaiAsset,
    pub hbd_interest_rate: u16,
    pub hbd_print_rate: u16,
    pub maximum_block_size: u32,
    pub current_aslot: NumberOrString,
    pub recent_slots_filled: String,
    pub participation_count: u8,
    pub last_irreversible_block_num: u32,
    pub vote_power_reserve_rate: u32,
    pub delegation_return_period: u32,
    pub reverse_auction_seconds: NumberOrString,
    pub available_account_subsidies: NumberOrString,
    pub hbd_stop_percent: u16,
    pub hbd_start_percent: u16,
    pub next_maintenance_time: HiveDateTime,
    pub last_budget_time: HiveDateTime,
    pub next_daily_maintenance_time: HiveDateTime,
    pub content_reward_percent: u16,
    pub vesting_reward_percent: u16,
    pub proposal_fund_percent: u16,
    pub dhf_interval_ledger: NaiAsset,
    pub downvote_pool_percent: u16,
    pub current_remove_threshold: i16,
    pub early_voting_seconds: NumberOrString,
    pub mid_voting_seconds: NumberOrString,
    pub max_consecutive_recurrent_transfer_failures: u8,
    pub max_recurrent_transfer_end_date: u16,
    pub min_recurrent_transfers_recurrence: u8,
    pub max_open_recurrent_transfers: u16,
}

/// Represents the (empty) parameters of `database_api.get_witness_schedule`.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct GetWitnessScheduleRequest {}

/// Represents the result of `database_api.get_witness_schedule`.
///
/// Field types follow the node's `api_witness_schedule_object`; the
/// `fc::optional` future-schedule fields (only filled on request) are not
/// ported, matching TS.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GetWitnessScheduleResponse {
    pub id: u32,
    pub current_virtual_time: String,
    pub next_shuffle_block_num: u32,
    pub current_shuffled_witnesses: Vec<AccountName>,
    pub num_scheduled_witnesses: u8,
    pub elected_weight: u8,
    pub timeshare_weight: u8,
    pub miner_weight: u8,
    pub witness_pay_normalization_factor: u32,
    pub median_props: ChainProperties,
    pub majority_version: String,
    pub max_voted_witnesses: u8,
    pub max_miner_witnesses: u8,
    pub max_runner_witnesses: u8,
    pub hardfork_required_witnesses: u8,
    pub account_subsidy_rd: RdDynamicsParams,
    pub account_subsidy_witness_rd: RdDynamicsParams,
    pub min_witness_account_subsidy_decay: NumberOrString,
}

/// Represents the parameters of `database_api.verify_authority`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct VerifyAuthorityRequest {
    pub trx: ApiTransaction,
    pub pack: TransactionPackType,
}

/// Represents the result of `database_api.verify_authority`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct VerifyAuthorityResponse {
    pub valid: bool,
}

/// Represents the witness-elected chain properties (`median_props`).
///
/// TS NOTE: TS inlines this object literal in
/// `GetWitnessScheduleResponse`; Rust needs the named struct.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ChainProperties {
    pub account_creation_fee: NaiAsset,
    pub maximum_block_size: u32,
    pub hbd_interest_rate: u16,
    pub account_subsidy_budget: i32,
    pub account_subsidy_decay: u32,
}

/// Represents the resource-dynamics parameters of the account-subsidy pools.
///
/// TS NOTE: TS inlines this object literal in
/// `GetWitnessScheduleResponse`; Rust needs the named struct.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RdDynamicsParams {
    pub resource_unit: NumberOrString,
    pub budget_per_time_unit: i32,
    pub pool_eq: NumberOrString,
    pub max_pool_size: NumberOrString,
    pub decay_params: RdDecayParams,
    pub min_decay: NumberOrString,
}

/// Represents the decay parameters of a resource-dynamics pool.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RdDecayParams {
    pub decay_per_time_unit: u32,
    pub decay_per_time_unit_denom_shift: u8,
}
