//! Error types surfaced by the health checker and the underlying request layer.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/healthchecker/errors.ts`. The TS
//! class hierarchy (`WaxError` ← `WaxHealthCheckerError` /
//! `WaxHealthCheckerValidatorFailedError`, and `WaxError` ← `WaxRequestError` ←
//! the concrete request errors) is expressed here as two `thiserror` enums. The
//! request-error subclasses differ only by message, so they become variants of
//! [`RequestError`].
//!
//! TS NOTE: the `IRequestOptions` / `IDetailedResponseData` payloads (from
//! `util/request_helper.ts`) are not ported yet, so the `request` / `response`
//! fields are typed as [`Dummy`], and the messages that interpolated their
//! contents (resource URL, HTTP status) are reduced until those types land.

use std::collections::HashSet;
use std::error::Error;

use thiserror::Error;

use super::Dummy;

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
    #[error("Validator did not pass: \"{failed_reason}\"")]
    ValidatorFailed {
        failed_reason: String,
        endpoint: EndpointInfo,
        request: Dummy,
        response: Dummy,
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
    #[error("Received malformed JSON while requesting given resource")]
    MalformedJson { request: Dummy, response: Dummy },

    /// TS NOTE: `WaxNon_2XX_3XX_ResponseCodeError`.
    #[error(
        "Received non 2xx-3xx http response code while requesting given resource"
    )]
    NonSuccessResponseCode { request: Dummy, response: Dummy },

    /// TS NOTE: `WaxRequestTimeoutError`.
    #[error("Request timed out")]
    Timeout { request: Dummy, response: Dummy },

    /// TS NOTE: `WaxRequestAbortedByUser`.
    #[error(
        "Request aborted by user action (browser stop button, closing tab, etc.)"
    )]
    AbortedByUser { request: Dummy, response: Dummy },

    /// TS NOTE: `WaxUnknownRequestError`.
    #[error("Unknown request error caught (possible network or CORS error)")]
    Unknown {
        request: Dummy,
        response: Dummy,
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
