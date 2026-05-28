//! Offline Hive blockchain primitives: transaction building, operation
//! construction, asset math, authority handling and validation.
//!
//! The entry point is [`create_wax_foundation`], which returns a
//! [`WaxFoundation`] exposing the offline API surface. Online functionality
//! (API calls and broadcasting) lives in the separate `wax_chain` crate.

pub mod complex_operations;
pub mod constants;
mod error;
mod foundation;
pub mod hive_apps_operations;
mod interfaces;
mod internal;
pub mod models;
mod options;
pub mod result;

pub use error::WaxError;
pub use foundation::WaxFoundation;
pub use interfaces::{
    AuthorityDataProvider, Manabar, Operation, OperationBuilder,
    SignatureProvider, Transaction,
};
pub use internal::models::manabar_data::ManabarData;
pub use options::WaxOptions;
pub use wax_core::proto;
pub use wax_core::transaction_to_canonical_json;

/// Creates a [`WaxFoundation`] for offline operations, using the given
/// [`WaxOptions`] (or the defaults when `None` is passed).
pub fn create_wax_foundation(
    options: impl Into<Option<WaxOptions>>,
) -> Box<dyn WaxFoundation> {
    let options = options.into().unwrap_or_default();
    Box::new(internal::foundation::WaxFoundationApi::new(options))
}
