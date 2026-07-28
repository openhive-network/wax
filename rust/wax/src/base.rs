//! Offline Hive blockchain primitives: transaction building, operation
//! construction, asset math, authority handling and validation.
//!
//! The entry point is [`create_wax_foundation`], which returns a
//! [`WaxFoundation`] exposing the offline API surface. All public items are
//! re-exported at the crate root.

// pub(crate): joins the online builders in the public
// `crate::complex_operations` namespace assembled by `lib.rs`.
pub(crate) mod complex_operations;
pub mod constants;
mod error;
pub mod formatters;
mod foundation;
pub mod hive_apps_operations;
// pub(crate): the online layer reuses the FFI conversion and construction
// helpers (`internal::authority`, `internal::protocol`, ...).
pub(crate) mod internal;
pub mod models;
mod operation;
mod options;
pub mod result;
pub(crate) mod transaction;

pub use error::WaxError;
pub use formatters::{
    AssetFormatterOptions, CustomFormatter, FormatContext, FormattedDisplay,
    FormatterRegistry, FoundationHandle, MatchRule, NumberSeparators,
    TransactionFormatterOptions, WaxFormatter, WaxFormatterOptions,
};
pub use foundation::WaxFoundation;
// The online `create_transaction` factory shares the offline construction
// helper but needs the internal `RustTransaction` it returns.
pub(crate) use foundation::build_transaction_with_chain_reference_data;
pub use models::authority::AuthorityDataProvider;
pub use models::manabar_data::Manabar;
pub use operation::{ComplexOperation, Operation};
pub use options::WaxOptions;
pub use transaction::{SignatureProvider, Transaction};

/// Creates a [`WaxFoundation`] for offline operations, using the given
/// [`WaxOptions`] (or the defaults when `None` is passed).
pub fn create_wax_foundation(
    options: impl Into<Option<WaxOptions>>,
) -> WaxFoundation {
    let options = options.into().unwrap_or_default();
    WaxFoundation::new(options)
}
