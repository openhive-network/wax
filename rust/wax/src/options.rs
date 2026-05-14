const MAINNET_CHAIN_ID: &str =
    "beeab0de00000000000000000000000000000000000000000000000000000000";

const DEFAULT_API_ENDPOINT: &str = "https://api.hive.blog/";
const DEFAULT_REST_API_ENDPOINT: &str = "https://api.syncad.com";
const DEFAULT_API_TIMEOUT_MS: u32 = 2_000;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ChainId(String);

impl ChainId {
    pub fn new(hex: impl Into<String>) -> Self {
        Self(hex.into())
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl Default for ChainId {
    fn default() -> Self {
        Self(MAINNET_CHAIN_ID.to_string())
    }
}

#[derive(Debug, Clone, Default)]
pub struct WaxOptions {
    pub chain_id: ChainId,
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
            chain_id: ChainId::default(),
            api_endpoint: DEFAULT_API_ENDPOINT.to_string(),
            rest_api_endpoint: DEFAULT_REST_API_ENDPOINT.to_string(),
            api_timeout_ms: DEFAULT_API_TIMEOUT_MS,
            wax_api_caller: None,
        }
    }
}
