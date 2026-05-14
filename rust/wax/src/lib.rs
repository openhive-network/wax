pub use wax_core::proto;

mod error;
mod foundation;
mod interfaces;
mod options;
mod protocol;
mod transaction;

pub use error::WaxError;
pub use foundation::WaxFoundation;
pub use interfaces::RustTransactionApi;
pub use options::{ChainId, WaxChainOptions, WaxOptions};

pub fn create_wax_foundation(
    options: impl Into<Option<WaxOptions>>,
) -> Box<dyn WaxFoundation> {
    let options = options.into().unwrap_or_default();
    Box::new(foundation::WaxFoundationApi::new(options))
}
