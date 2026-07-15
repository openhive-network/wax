use crate::WaxError;
use thiserror::Error;

use crate::chain::healthchecker::RequestError;
use crate::chain::util::{DetailedResponseData, RequestOptions};
use crate::models::basic::AccountName;

/// Represents any failure originating from the online chain layer.
///
/// TS NOTE: TS surfaces these under `WaxChainApiError` / `WaxError`; Rust splits
/// the offline `WaxError` (re-used here via [`Self::Foundation`]) from the
/// online-only variants.
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

    /// TS NOTE: `findAccounts` throws when `database_api.find_accounts`
    /// returns fewer accounts than requested.
    #[error(
        "No such account{s} on chain with given name{s}: \"{}\"",
        .accounts.join(", "),
        s = plural(.accounts)
    )]
    AccountsNotFound { accounts: Vec<AccountName> },

    /// TS NOTE: `findWitnessAccounts` throws when
    /// `database_api.find_witnesses` returns fewer witnesses than requested.
    #[error(
        "No such witness{s} on chain with given name{s}: \"{}\"",
        .witnesses.join(", "),
        s = plural(.witnesses)
    )]
    WitnessesNotFound { witnesses: Vec<AccountName> },

    /// TS NOTE: `OnChainOperationValidator.ensureAccountsExist` throws when
    /// `rc_api.find_rc_accounts` reports fewer accounts than checked.
    #[error("Accounts \"{}\" do not exist!", .accounts.join("\", \""))]
    AccountsDoNotExist { accounts: Vec<AccountName> },

    #[error(transparent)]
    Foundation(#[from] WaxError),
}

fn plural(names: &[AccountName]) -> &'static str {
    if names.len() == 1 { "" } else { "s" }
}
