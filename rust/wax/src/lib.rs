pub use wax_core::proto;

mod error;
mod foundation;
mod interfaces;
pub mod models;
mod options;
mod protocol;
mod transaction;

pub use error::WaxError;
pub use foundation::WaxFoundation;
pub use interfaces::{AuthorityDataProvider, Transaction};
pub use options::{WaxChainOptions, WaxOptions};
pub use protocol::rust_protocol;

pub fn create_wax_foundation(
    options: impl Into<Option<WaxOptions>>,
) -> Box<dyn WaxFoundation> {
    let options = options.into().unwrap_or_default();
    Box::new(foundation::WaxFoundationApi::new(options))
}
