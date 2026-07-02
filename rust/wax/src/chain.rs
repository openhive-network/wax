//! Online Hive blockchain API: chain-bound operations layered on the offline
//! foundation, covering JSON-RPC/REST endpoint configuration and on-chain
//! authority verification.
//!
//! The entry point is [`create_hive_chain`], which returns a [`HiveChain`]
//! that also implements [`crate::WaxFoundation`], so a chain instance can be used
//! wherever an offline foundation is expected.

mod authority_trace;
mod error;
mod healthchecker;
mod hive_chain;
mod internal;
mod online_transaction;
mod options;
mod rpc;
mod util;

pub use authority_trace::{
    AuthorityEntryProcessingStatus, AuthorityPathEntry, AuthorityPathTraceData,
    AuthorityRole, AuthorityTrace, AuthorityTraceSignatureInfo, ProcessedEntry,
};
pub use error::WaxChainError;
pub use healthchecker::{
    ChainApiType, EndpointInfo, ErrorReason, HealthCheckerError, HiveEndpoint,
    HiveEndpointData, HiveEndpointDataDown, HiveEndpointDataUp, NewBestEvent,
    NewUpDownEvent, RequestError,
};
pub use hive_chain::HiveChain;
pub use online_transaction::OnlineTransaction;
pub use options::WaxChainOptions;

/// Constructs a [`HiveChain`] from the given options.
///
/// TS NOTE: TS `createHiveChain` is `async` because of WASM module init. Rust
/// has no such dependency, so this factory is sync — async I/O only happens
/// when calling chain methods.
pub fn create_hive_chain(
    options: impl Into<Option<WaxChainOptions>>,
) -> Result<Box<dyn HiveChain>, WaxChainError> {
    let options = options.into().unwrap_or_default();
    Ok(Box::new(internal::chain::HiveChainApi::new(options)?))
}
