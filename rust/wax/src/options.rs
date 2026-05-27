use crate::constants::DEFAULT_CHAIN_ID;
use crate::models::basic::ChainId;

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
