//! Online Hive blockchain API: chain-bound operations layered on the offline
//! foundation, covering JSON-RPC/REST endpoint configuration and on-chain
//! authority verification.
//!
//! The entry point is [`create_hive_chain`], which returns a [`HiveChain`]
//! that also derefs to [`crate::WaxFoundation`], so a chain instance can be
//! used wherever an offline foundation is expected.

pub mod api;
pub mod authority_trace;
pub mod healthchecker;
pub mod interceptor;
pub mod transport;

mod broadcast;
// pub(crate): joins the offline builders in the public
// `crate::complex_operations` namespace assembled by `lib.rs`.
pub(crate) mod complex_operations;
mod error;
mod extend;
mod hive_chain;
mod internal;
mod online_transaction;
mod options;
mod rest;
mod rpc;

pub use api::DefaultHiveApi;
pub use broadcast::Broadcastable;
pub use error::WaxChainError;
pub use extend::{HiveApi, HiveRestApi};
pub use hive_chain::HiveChain;
pub use online_transaction::OnlineTransaction;
pub use options::{
    DEFAULT_API_ENDPOINT, DEFAULT_API_TIMEOUT, DEFAULT_REST_API_ENDPOINT,
    HiveChainOptions,
};
pub use rest::{RestCallDescriptor, RestCaller};
pub use rpc::{JsonRpcCallDescriptor, JsonRpcCaller};

/// Constructs a [`HiveChain`] from the given options.
pub fn create_hive_chain(
    options: impl Into<Option<HiveChainOptions>>,
) -> Result<HiveChain, WaxChainError> {
    let options = options.into().unwrap_or_default();
    HiveChain::new(options)
}
