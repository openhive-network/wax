//! Shared DTO types of the default Hive API surface.

use serde::{Deserialize, Serialize};

use crate::models::asset::NaiAsset;
use crate::models::basic::{
    AccountName, Hex, PublicKey, Signature, TransactionId,
};
use crate::models::hive_date_time::HiveDateTime;

/// Represents an account as returned by `database_api.find_accounts`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ApiAccount {
    pub id: u32,
    pub name: AccountName,
    pub owner: ApiAuthority,
    pub active: ApiAuthority,
    pub posting: ApiAuthority,
    pub memo_key: PublicKey,
    pub json_metadata: String,
    pub posting_json_metadata: String,
    pub proxy: AccountName,
    pub previous_owner_update: HiveDateTime,
    pub last_owner_update: HiveDateTime,
    pub last_account_update: HiveDateTime,
    pub created: HiveDateTime,
    pub mined: bool,
    pub recovery_account: AccountName,
    pub last_account_recovery: HiveDateTime,
    pub reset_account: AccountName,
    pub comment_count: u32,
    pub lifetime_vote_count: u32,
    pub post_count: u32,
    pub can_vote: bool,
    pub voting_manabar: ApiManabar,
    pub downvote_manabar: ApiManabar,
    pub balance: NaiAsset,
    pub savings_balance: NaiAsset,
    pub hbd_balance: NaiAsset,
    pub hbd_seconds: String,
    pub hbd_seconds_last_update: HiveDateTime,
    pub hbd_last_interest_payment: HiveDateTime,
    pub savings_hbd_balance: NaiAsset,
    pub savings_hbd_seconds: String,
    pub savings_hbd_seconds_last_update: HiveDateTime,
    pub savings_hbd_last_interest_payment: HiveDateTime,
    pub savings_withdraw_requests: u8,
    pub reward_hbd_balance: NaiAsset,
    pub reward_hive_balance: NaiAsset,
    pub reward_vesting_balance: NaiAsset,
    pub reward_vesting_hive: NaiAsset,
    pub vesting_shares: NaiAsset,
    pub delegated_vesting_shares: NaiAsset,
    pub received_vesting_shares: NaiAsset,
    pub vesting_withdraw_rate: NaiAsset,
    pub post_voting_power: NaiAsset,
    pub next_vesting_withdrawal: HiveDateTime,
    pub withdrawn: NumberOrString,
    pub to_withdraw: NumberOrString,
    pub withdraw_routes: u16,
    pub pending_transfers: u16,
    pub curation_rewards: NumberOrString,
    pub posting_rewards: NumberOrString,
    pub proxied_vsf_votes: Vec<NumberOrString>,
    pub witnesses_voted_for: u16,
    pub last_post: HiveDateTime,
    pub last_root_post: HiveDateTime,
    pub last_post_edit: HiveDateTime,
    pub last_vote_time: HiveDateTime,
    pub post_bandwidth: u32,
    pub pending_claimed_accounts: NumberOrString,
    pub open_recurrent_transfers: u16,
    pub is_smt: bool,
    pub delayed_votes: Option<Vec<ApiDelayedVote>>,
    pub governance_vote_expiration_ts: HiveDateTime,
}

/// Represents an authority as returned by the database API: a weight
/// threshold with account and key auths as `[entity, weight]` pairs.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ApiAuthority {
    pub weight_threshold: u32,
    pub account_auths: Vec<ApiAccountAuth>,
    pub key_auths: Vec<ApiKeyAuth>,
}

/// Represents an `[account, weight]` authority entry.
pub type ApiAccountAuth = (AccountName, u16);

/// Represents a `[public_key, weight]` authority entry.
pub type ApiKeyAuth = (PublicKey, u16);

/// Represents a delayed governance vote entry of an account.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ApiDelayedVote {
    pub time: HiveDateTime,
    pub val: NumberOrString,
}

/// Represents a manabar as emitted by the chain APIs.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ApiManabar {
    pub current_mana: NumberOrString,
    pub last_update_time: u32,
}

/// Represents the witness fields consumed by wax from
/// `database_api.find_witnesses` (the node returns more; unknown fields are
/// ignored).
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ApiWitness {
    pub id: u32,
    pub owner: AccountName,
    pub created: HiveDateTime,
    pub signing_key: PublicKey,
    pub total_missed: u32,
    pub last_confirmed_block_num: u32,
    pub running_version: String,
}

/// Represents a full signed block as returned by the block API.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ApiBlock {
    #[serde(flatten)]
    pub header: ApiBlockHeader,
    pub witness_signature: Signature,
    pub transactions: Vec<ApiTransaction>,
    pub block_id: Hex,
    pub signing_key: PublicKey,
    pub transaction_ids: Vec<TransactionId>,
}

/// Represents a block header as returned by the block API.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ApiBlockHeader {
    pub previous: Hex,
    pub timestamp: HiveDateTime,
    pub witness: AccountName,
    pub transaction_merkle_root: Hex,
    pub extensions: Vec<serde_json::Value>,
}

/// Represents a transaction in the API (hf26) JSON form.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ApiTransaction {
    pub ref_block_num: u16,
    pub ref_block_prefix: u32,
    pub expiration: HiveDateTime,
    pub operations: Vec<ApiOperation>,
    pub extensions: Vec<serde_json::Value>,
    pub signatures: Vec<Signature>,
}

/// Represents an operation in the API (hf26) JSON form: a type tag plus the
/// operation body.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ApiOperation {
    pub r#type: String,
    pub value: serde_json::Value,
}

/// Represents the serialization format of a transaction.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum TransactionPackType {
    #[serde(rename = "legacy")]
    Legacy,
    #[serde(rename = "hf26")]
    Hf26,
}

/// Represents an integer field that nodes emit either as a JSON number or as
/// a string.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum NumberOrString {
    Number(serde_json::Number),
    String(String),
}

impl NumberOrString {
    /// Converts the value to `i64`, parsing the string form if needed.
    pub fn as_i64(&self) -> Option<i64> {
        match self {
            Self::Number(number) => number.as_i64(),
            Self::String(string) => string.parse().ok(),
        }
    }

    /// Converts the value to `u64`, parsing the string form if needed.
    pub fn as_u64(&self) -> Option<u64> {
        match self {
            Self::Number(number) => number.as_u64(),
            Self::String(string) => string.parse().ok(),
        }
    }
}
