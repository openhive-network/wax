pub mod complex_operations;
pub mod hive_apps_operations;
pub mod constants;
mod error;
mod foundation;
mod interfaces;
mod internal;
pub mod models;
mod options;
pub mod result;

pub use error::WaxError;
pub use foundation::WaxFoundation;
pub use interfaces::{
    AuthorityDataProvider, Manabar, Operation, OperationBuilder, SignatureProvider, Transaction,
};
pub use internal::models::manabar_data::ManabarData;
pub use options::WaxOptions;
pub use wax_core::proto;
pub use wax_core::{RustOperation, RustTransaction, transaction_to_canonical_json};

pub fn create_wax_foundation(options: impl Into<Option<WaxOptions>>) -> Box<dyn WaxFoundation> {
    let options = options.into().unwrap_or_default();
    Box::new(internal::foundation::WaxFoundationApi::new(options))
}
