//! Offline Hive blockchain primitives: transaction building, operation
//! construction, asset math, authority handling and validation.
//!
//! The entry point is [`create_wax_foundation`], which returns a
//! [`WaxFoundation`] exposing the offline API surface. All public items are
//! re-exported at the crate root.

pub mod complex_operations;
pub mod constants;
mod error;
mod foundation;
pub mod hive_apps_operations;
mod interfaces;
// pub(crate): the online layer reuses the FFI conversion and construction
// helpers (`internal::authority`, `internal::protocol`, ...).
pub(crate) mod internal;
pub mod models;
mod operation;
mod options;
pub mod result;
pub(crate) mod transaction;

pub use error::WaxError;
pub use foundation::WaxFoundation;
// The online `create_transaction` factory shares the offline construction
// helper but needs the internal `RustTransaction` it returns.
pub(crate) use foundation::build_transaction_with_chain_reference_data;
pub use interfaces::{AuthorityDataProvider, Manabar, SignatureProvider};
pub use internal::models::manabar_data::ManabarData;
pub use operation::{Operation, OperationBuilder};
pub use options::WaxOptions;
pub use transaction::Transaction;

/// Creates a [`WaxFoundation`] for offline operations, using the given
/// [`WaxOptions`] (or the defaults when `None` is passed).
pub fn create_wax_foundation(
    options: impl Into<Option<WaxOptions>>,
) -> WaxFoundation {
    let options = options.into().unwrap_or_default();
    WaxFoundation::new(options)
}
