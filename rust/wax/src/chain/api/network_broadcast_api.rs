//! DTOs of the `network_broadcast_api` namespace.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/api/network_broadcast_api/`.

use serde::{Deserialize, Serialize};

use crate::hive_api;

use super::types::ApiTransaction;

/// `network_broadcast_api` JSON-RPC namespace of
/// [`DefaultHiveApi`](super::DefaultHiveApi).
#[hive_api]
pub trait NetworkBroadcastApi {
    /// Broadcasts a signed transaction to the network.
    async fn broadcast_transaction(
        params: BroadcastTransactionRequest,
    ) -> BroadcastTransactionResponse;
}

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
