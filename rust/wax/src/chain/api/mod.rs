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

crate::define_hive_api! {
    /// Represents the default JSON-RPC API surface available on every chain
    /// via [`HiveChain::api`](crate::HiveChain::api), composable into custom
    /// surfaces with `define_hive_api!`'s `: DefaultHiveApi` arm.
    ///
    /// TS NOTE: mirrors the `HiveApiTypes` default set of `chain_api_data.ts`
    /// (TS `chain.api`); TS `HiveRestApiTypes` is empty, so there is no REST
    /// counterpart.
    pub struct DefaultHiveApi {
        /// `account_by_key_api` JSON-RPC namespace.
        account_by_key_api {
            /// Returns, for each given public key, the accounts referencing
            /// it.
            fn get_key_references(GetKeyReferencesRequest)
                -> GetKeyReferencesResponse;
        }
        /// `database_api` JSON-RPC namespace.
        database_api {
            /// Returns the requested accounts.
            fn find_accounts(FindAccountsRequest) -> FindAccountsResponse;
            /// Returns the requested witnesses.
            fn find_witnesses(FindWitnessesRequest) -> FindWitnessesResponse;
            /// Returns the current dynamic global properties.
            fn get_dynamic_global_properties(
                GetDynamicGlobalPropertiesRequest
            ) -> GetDynamicGlobalPropertiesResponse;
            /// Returns the current witness schedule.
            fn get_witness_schedule(GetWitnessScheduleRequest)
                -> GetWitnessScheduleResponse;
            /// Verifies that a signed transaction carries the authorities it
            /// requires.
            fn verify_authority(VerifyAuthorityRequest)
                -> VerifyAuthorityResponse;
        }
        /// `network_broadcast_api` JSON-RPC namespace.
        network_broadcast_api {
            /// Broadcasts a signed transaction to the network.
            fn broadcast_transaction(BroadcastTransactionRequest)
                -> BroadcastTransactionResponse;
        }
        /// `block_api` JSON-RPC namespace.
        block_api {
            /// Returns the requested block.
            fn get_block(GetBlockRequest) -> GetBlockResponse;
            /// Returns the requested block header.
            fn get_block_header(GetBlockHeaderRequest)
                -> GetBlockHeaderResponse;
            /// Returns a range of blocks.
            fn get_block_range(GetBlockRangeRequest) -> GetBlockRangeResponse;
        }
        /// `rc_api` JSON-RPC namespace.
        rc_api {
            /// Returns the resource-credit state of the requested accounts.
            fn find_rc_accounts(FindRcAccountsRequest)
                -> FindRcAccountsResponse;
        }
    }
}
