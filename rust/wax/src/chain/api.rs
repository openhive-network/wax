//! Typed DTOs of the default Hive API set and the [`DefaultHiveApi`] surface
//! built from them.
//!
//! NOTE: where the other wax implementations diverge from what nodes
//! actually emit (stale Steem-era fields, the `runningVersion` typo), these
//! DTOs follow the node — typed deserialization enforces field presence, so
//! a stale required field would fail every call.

mod account_by_key_api;
mod block_api;
mod database_api;
mod network_broadcast_api;
mod rc_api;
#[cfg(test)]
mod tests;
mod types;

pub use account_by_key_api::{
    AccountByKeyApi, GetKeyReferencesRequest, GetKeyReferencesResponse,
};
pub use block_api::{
    BlockApi, GetBlockHeaderRequest, GetBlockHeaderResponse,
    GetBlockRangeRequest, GetBlockRangeResponse, GetBlockRequest,
    GetBlockResponse,
};
pub use database_api::{
    ChainProperties, DatabaseApi, FindAccountsRequest, FindAccountsResponse,
    FindWitnessesRequest, FindWitnessesResponse,
    GetDynamicGlobalPropertiesRequest, GetDynamicGlobalPropertiesResponse,
    GetWitnessScheduleRequest, GetWitnessScheduleResponse, RdDecayParams,
    RdDynamicsParams, VerifyAuthorityRequest, VerifyAuthorityResponse,
};
pub use network_broadcast_api::{
    BroadcastTransactionRequest, BroadcastTransactionResponse,
    NetworkBroadcastApi,
};
pub use rc_api::{
    FindRcAccountsRequest, FindRcAccountsResponse, RcAccount, RcApi,
};
pub use types::{
    ApiAccount, ApiAccountAuth, ApiAuthority, ApiBlock, ApiBlockHeader,
    ApiDelayedVote, ApiKeyAuth, ApiManabar, ApiOperation, ApiTransaction,
    ApiWitness, NumberOrString, TransactionPackType,
};

use crate::hive_api;

/// Represents the default JSON-RPC API surface available on every chain via
/// [`HiveChain::api`](crate::HiveChain::api), composable into custom
/// surfaces via `#[hive_api(base)]`.
#[hive_api]
#[derive(Clone)]
pub struct DefaultHiveApi {
    /// `account_by_key_api` JSON-RPC namespace.
    pub account_by_key_api: AccountByKeyApi,
    /// `database_api` JSON-RPC namespace.
    pub database_api: DatabaseApi,
    /// `network_broadcast_api` JSON-RPC namespace.
    pub network_broadcast_api: NetworkBroadcastApi,
    /// `block_api` JSON-RPC namespace.
    pub block_api: BlockApi,
    /// `rc_api` JSON-RPC namespace.
    pub rc_api: RcApi,
}
