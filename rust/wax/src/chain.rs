//! Online Hive blockchain API: chain-bound operations layered on the offline
//! foundation, covering JSON-RPC/REST endpoint configuration and on-chain
//! authority verification.
//!
//! The entry point is [`create_hive_chain`], which returns a [`HiveChain`]
//! that also derefs to [`crate::WaxFoundation`], so a chain instance can be
//! used wherever an offline foundation is expected.

pub mod api;

mod authority_trace;
mod broadcast;
mod error;
mod extend;
mod healthchecker;
mod hive_chain;
mod internal;
mod online_transaction;
mod options;
mod rest;
mod rpc;
mod util;

pub use api::DefaultHiveApi;
pub use authority_trace::{
    AuthorityEntryProcessingStatus, AuthorityPathEntry, AuthorityPathTraceData,
    AuthorityRole, AuthorityTrace, AuthorityTraceSignatureInfo, ProcessedEntry,
};
pub use broadcast::Broadcastable;
pub use error::WaxChainError;
pub use extend::{HiveApi, HiveRestApi};
pub use healthchecker::*;
pub use hive_chain::HiveChain;
pub use online_transaction::OnlineTransaction;
pub use options::HiveChainOptions;
pub use rest::{RestCallDescriptor, RestCaller};
pub use rpc::{JsonRpcCallDescriptor, JsonRpcCaller};
pub use util::*;

/// Constructs a [`HiveChain`] from the given options.
///
/// TS NOTE: TS `createHiveChain` is `async` because of WASM module init. Rust
/// has no such dependency, so this factory is sync — async I/O only happens
/// when calling chain methods.
pub fn create_hive_chain(
    options: impl Into<Option<HiveChainOptions>>,
) -> Result<HiveChain, WaxChainError> {
    let options = options.into().unwrap_or_default();
    HiveChain::new(options)
}
