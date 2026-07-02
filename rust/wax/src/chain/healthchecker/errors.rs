//! Error types surfaced by the health checker and the underlying request layer.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/healthchecker/errors.ts`. The TS
//! class hierarchy (`WaxError` ← `WaxHealthCheckerError` /
//! `WaxHealthCheckerValidatorFailedError`, and `WaxError` ← `WaxRequestError` ←
//! the concrete request errors) is expressed here as two `thiserror` enums. The
//! request-error subclasses differ only by message, so they become variants of
//! [`RequestError`].
//!
//! TS NOTE: the `request` / `response` fields carry the ported
//! [`RequestOptions`] / [`DetailedResponseData`] payloads (from
//! `util/request_helper.rs`), so the messages interpolate the resource URL and
//! HTTP status like their TS counterparts.

use std::collections::HashSet;
use std::error::Error;

use thiserror::Error;

use crate::chain::util::{DetailedResponseData, RequestOptions};

/// Represents a failure raised by the health checker itself.
#[derive(Debug, Error)]
pub enum HealthCheckerError {
    /// TS NOTE: `WaxHealthCheckerError`.
    #[error("Health checker error: {source}")]
    Check {
        #[source]
        source: Box<dyn Error + Send + Sync>,
        endpoint: EndpointInfo,
        api_url: Option<String>,
    },

    /// TS NOTE: `WaxHealthCheckerValidatorFailedError`.
    #[error(
        "Validator did not pass on api: \"{} {}{}\": \"{failed_reason}\"",
        .request.method, .request.endpoint, .request.url
    )]
    ValidatorFailed {
        failed_reason: String,
        endpoint: EndpointInfo,
        request: RequestOptions,
        response: DetailedResponseData,
    },
}

/// Represents a failure while performing an HTTP request to a Hive node.
///
/// TS NOTE: `WaxRequestError` and its subclasses. Every variant carries the
/// originating request and the partial response; the `Display` message mirrors
/// the matching TS subclass.
#[derive(Debug, Error)]
pub enum RequestError {
    /// TS NOTE: `WaxMalformedJsonError`.
    #[error(
        "Received malformed JSON while requesting given resource \
         \"{} {}{}\": #{}",
        .request.method, .request.endpoint, .request.url,
        .response.status.unwrap_or_default()
    )]
    MalformedJson {
        request: RequestOptions,
        response: DetailedResponseData,
    },

    /// TS NOTE: `WaxNon_2XX_3XX_ResponseCodeError`.
    #[error(
        "Received non 2xx-3xx http response code while requesting given \
         resource \"{} {}{}\": #{}",
        .request.method, .request.endpoint, .request.url,
        .response.status.unwrap_or_default()
    )]
    NonSuccessResponseCode {
        request: RequestOptions,
        response: DetailedResponseData,
    },

    /// TS NOTE: `WaxRequestTimeoutError`.
    #[error(
        "Request timed out: \"{} {}{}\"",
        .request.method, .request.endpoint, .request.url
    )]
    Timeout {
        request: RequestOptions,
        response: DetailedResponseData,
    },

    /// TS NOTE: `WaxRequestAbortedByUser`. Kept for parity with the TS error
    /// hierarchy; not produced by the Rust request layer (see
    /// `util::request_helper`).
    /// TODO: probably remove this: reqwest doesn't provide an abort error.
    #[error(
        "Request aborted by user action (browser stop button, closing tab, \
         etc.): \"{} {}{}\"",
        .request.method, .request.endpoint, .request.url
    )]
    AbortedByUser {
        request: RequestOptions,
        response: DetailedResponseData,
    },

    /// TS NOTE: `WaxUnknownRequestError`.
    #[error(
        "Unknown request error caught (possible network or CORS error): \
         \"{} {}{}\"",
        .request.method, .request.endpoint, .request.url
    )]
    Unknown {
        request: RequestOptions,
        response: DetailedResponseData,
        #[source]
        source: Option<Box<dyn Error + Send + Sync>>,
    },
}

/// Represents an owned identity snapshot of the endpoint an error refers to.
///
/// TS NOTE: the TS errors hold the live `IHiveEndpoint`; the Rust errors carry
/// a copy of its identifying fields instead, so the error stays fully owned and
/// can be propagated without borrowing the mutable endpoint. Once `HealthChecker`
/// and the endpoint ownership model are ported, this may become a shared handle
/// (e.g. `Arc<HiveEndpoint>`).
#[derive(Debug, Clone)]
pub struct EndpointInfo {
    pub id: u32,
    pub api_caller_id: ChainApiType,
    pub paths: Vec<String>,
    pub endpoint_urls: HashSet<String>,
}

/// Represents which API caller an endpoint belongs to.
///
/// TS NOTE: `EChainApiType` from `chain_api.ts`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ChainApiType {
    JsonRpc,
    Rest,
}
