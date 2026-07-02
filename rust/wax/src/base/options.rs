use crate::base::constants::DEFAULT_CHAIN_ID;
use crate::base::models::basic::ChainId;

/// Represents the configuration for a [`crate::WaxFoundation`], currently the
/// chain id transactions are bound to.
#[derive(Debug, Clone)]
pub struct WaxOptions {
    pub chain_id: ChainId,
}

impl Default for WaxOptions {
    fn default() -> Self {
        Self {
            chain_id: DEFAULT_CHAIN_ID.to_string(),
        }
    }
}
