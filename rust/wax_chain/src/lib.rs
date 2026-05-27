mod authority_trace;
mod chain;
mod error;
mod internal;
mod online_transaction;
mod options;
mod rpc;

pub use authority_trace::{
    AuthorityEntryProcessingStatus, AuthorityPathEntry, AuthorityPathTraceData, AuthorityRole,
    AuthorityTrace, AuthorityTraceSignatureInfo, ProcessedEntry,
};
pub use chain::HiveChain;
pub use error::WaxChainError;
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
