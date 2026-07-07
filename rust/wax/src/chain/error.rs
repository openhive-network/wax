use crate::WaxError;
use thiserror::Error;

use crate::chain::healthchecker::RequestError;
use crate::chain::util::{DetailedResponseData, RequestOptions};

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

    /// TS NOTE: the `WaxRequestError` subclasses raised by the request layer
    /// (see `util::request_helper`).
    #[error(transparent)]
    Request(#[from] RequestError),

    /// TS NOTE: TS throws a bare `Error('No <param> in request')` when a
    /// `{param}` path placeholder is missing from the REST request params
    /// (`util/api_caller.ts`).
    #[error("No {name} in request")]
    MissingPathParam { name: String },

    /// NOTE: TS constrains REST request params to `object | undefined` at the
    /// type level; Rust accepts any `Serialize` params, so the guard lives in
    /// the REST caller instead.
    #[error("REST API request params must serialize to a JSON object")]
    NonObjectParams,

    /// TS NOTE: `WaxChainApiError` — TS raises 'No result found in the Hive
    /// API response' when a declared result is absent; typed deserialization
    /// subsumes that presence check, so this variant covers every mismatch
    /// between the response body and the declared result type.
    #[error(
        "Invalid response from chain API \"{} {}{}\": {source}",
        .request.method, .request.endpoint, .request.url
    )]
    ApiResponse {
        request: RequestOptions,
        response: DetailedResponseData,
        #[source]
        source: serde_json::Error,
    },

    #[error(transparent)]
    Foundation(#[from] WaxError),
}
