//! The error type of the online chain layer.

use crate::WaxError;
use thiserror::Error;

use crate::chain::healthchecker::RequestError;
use crate::chain::transport::{DetailedResponseData, RequestOptions};
use crate::models::basic::AccountName;

/// Represents any failure originating from the online chain layer.
#[derive(Debug, Error)]
pub enum WaxChainError {
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
    Request(#[from] RequestError),

    #[error("No {name} in request")]
    MissingPathParam { name: String },

    /// NOTE: TS constrains REST request params to `object | undefined` at the
    /// type level; Rust accepts any `Serialize` params, so the guard lives in
    /// the REST caller instead.
    #[error("REST API request params must serialize to a JSON object")]
    NonObjectParams,

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

    #[error(
        "No such account{s} on chain with given name{s}: \"{}\"",
        .accounts.join(", "),
        s = plural(.accounts)
    )]
    AccountsNotFound { accounts: Vec<AccountName> },

    #[error(
        "No such witness{s} on chain with given name{s}: \"{}\"",
        .witnesses.join(", "),
        s = plural(.witnesses)
    )]
    WitnessesNotFound { witnesses: Vec<AccountName> },

    #[error("Accounts \"{}\" do not exist!", .accounts.join("\", \""))]
    AccountsDoNotExist { accounts: Vec<AccountName> },

    #[error(transparent)]
    Foundation(#[from] WaxError),
}

fn plural(names: &[AccountName]) -> &'static str {
    if names.len() == 1 { "" } else { "s" }
}
