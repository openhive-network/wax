mod chain;
mod error;
mod internal;
mod rpc;

pub use chain::HiveChain;
pub use error::WaxChainError;
pub use wax::WaxChainOptions;

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
