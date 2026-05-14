use crate::models::basic::{ChainId, MAINNET_CHAIN_ID};

const DEFAULT_API_ENDPOINT: &str = "https://api.hive.blog/";
const DEFAULT_REST_API_ENDPOINT: &str = "https://api.syncad.com";
const DEFAULT_API_TIMEOUT_MS: u32 = 2_000;

#[derive(Debug, Clone)]
pub struct WaxOptions {
    pub chain_id: ChainId,
}

impl Default for WaxOptions {
    fn default() -> Self {
        Self { chain_id: MAINNET_CHAIN_ID.to_string() }
    }
}

#[derive(Debug, Clone)]
pub struct WaxChainOptions {
    pub chain_id: ChainId,
    pub api_endpoint: String,
    pub rest_api_endpoint: String,
    pub api_timeout_ms: u32,
    pub wax_api_caller: Option<String>,
}

impl Default for WaxChainOptions {
    fn default() -> Self {
        Self {
            chain_id: MAINNET_CHAIN_ID.to_string(),
            api_endpoint: DEFAULT_API_ENDPOINT.to_string(),
            rest_api_endpoint: DEFAULT_REST_API_ENDPOINT.to_string(),
            api_timeout_ms: DEFAULT_API_TIMEOUT_MS,
            wax_api_caller: None,
        }
    }
}
