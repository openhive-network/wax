pub use wax_core::proto;

mod error;
mod foundation;
mod interfaces;
mod internal;
pub mod models;
mod options;
pub mod result;

pub use error::WaxError;
pub use foundation::WaxFoundation;
pub use interfaces::{AuthorityDataProvider, Transaction};
pub use options::{WaxChainOptions, WaxOptions};

pub fn create_wax_foundation(
    options: impl Into<Option<WaxOptions>>,
) -> Box<dyn WaxFoundation> {
    let options = options.into().unwrap_or_default();
    Box::new(internal::foundation::WaxFoundationApi::new(options))
}
