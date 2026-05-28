//! Configuration for the online chain layer and its default endpoints.

use wax::constants::DEFAULT_CHAIN_ID;
use wax::models::basic::ChainId;

/// Used as the default JSON-RPC API endpoint.
pub const DEFAULT_API_ENDPOINT: &str = "https://api.hive.blog/";
/// Used as the default REST API endpoint.
pub const DEFAULT_REST_API_ENDPOINT: &str = "https://api.syncad.com";
/// Used as the default API request timeout, in milliseconds.
pub const DEFAULT_API_TIMEOUT_MS: u32 = 2_000;

/// Represents the configuration for a [`crate::HiveChain`]: the chain id, the
/// JSON-RPC and REST endpoints, the request timeout and an optional caller tag.
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
            chain_id: DEFAULT_CHAIN_ID.to_string(),
            api_endpoint: DEFAULT_API_ENDPOINT.to_string(),
            rest_api_endpoint: DEFAULT_REST_API_ENDPOINT.to_string(),
            api_timeout_ms: DEFAULT_API_TIMEOUT_MS,
            wax_api_caller: None,
        }
    }
}
