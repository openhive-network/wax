use thiserror::Error;
use wax::WaxError;

/// Represents any failure originating from the online chain layer.
///
/// TS NOTE: TS surfaces these under `WaxChainApiError` / `WaxError`; Rust splits
/// the offline `WaxError` (re-used here via [`Self::Foundation`]) from the
/// online-only variants.
#[derive(Debug, Error)]
pub enum WaxChainError {
    #[error("HTTP transport error: {0}")]
    Http(#[from] reqwest::Error),

    #[error("JSON-RPC error {code}: {message}")]
    JsonRpc { code: i64, message: String },

    #[error("Failed to deserialize response: {0}")]
    Deserialization(#[from] serde_json::Error),

    #[error("Invalid endpoint URL '{url}': {source}")]
    EndpointParse {
        url: String,
        #[source]
        source: url::ParseError,
    },

    #[error(transparent)]
    Foundation(#[from] WaxError),
}
