//! DTOs of the `network_broadcast_api` namespace.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/api/network_broadcast_api/`.

use serde::{Deserialize, Serialize};

use super::types::ApiTransaction;

/// Represents the parameters of
/// `network_broadcast_api.broadcast_transaction`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BroadcastTransactionRequest {
    pub trx: ApiTransaction,
    pub max_block_age: i32,
}

/// Represents the (empty) result of
/// `network_broadcast_api.broadcast_transaction`.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct BroadcastTransactionResponse {}
