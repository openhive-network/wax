//! Typed DTOs of the default Hive API set and the [`DefaultHiveApi`] surface
//! built from them.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/api/` and the `HiveApiTypes`
//! literal in `chain_api_data.ts`. Where the TS interfaces diverge from what
//! nodes actually emit (stale Steem-era fields, the `runningVersion` typo),
//! the Rust DTOs follow the node — typed deserialization enforces field
//! presence, so a stale required field would fail every call.

mod account_by_key_api;
mod block_api;
mod database_api;
mod network_broadcast_api;
mod rc_api;
#[cfg(test)]
mod tests;
mod types;

pub use account_by_key_api::*;
pub use block_api::*;
pub use database_api::*;
pub use network_broadcast_api::*;
pub use rc_api::*;
pub use types::*;

use crate::hive_api;

/// Represents the default JSON-RPC API surface available on every chain via
/// [`HiveChain::api`](crate::HiveChain::api), composable into custom
/// surfaces via `#[hive_api(base)]`.
///
/// TS NOTE: mirrors the `HiveApiTypes` default set of `chain_api_data.ts`
/// (TS `chain.api`); TS `HiveRestApiTypes` is empty, so there is no REST
/// counterpart.
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
