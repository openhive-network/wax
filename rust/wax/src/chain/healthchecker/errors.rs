//! Error types surfaced by the health checker and the underlying request layer.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/healthchecker/errors.ts`. The TS
//! class hierarchy (`WaxError` ← `WaxHealthCheckerError` /
//! `WaxHealthCheckerValidatorFailedError`, and `WaxError` ← `WaxRequestError` ←
//! the concrete request errors) is expressed here as two `thiserror` structs
//! and one enum. The request-error subclasses differ only by message, so they
//! become variants of [`RequestError`].
//!
//! TS NOTE: the `request` / `response` fields carry the ported
//! [`RequestOptions`] / [`DetailedResponseData`] payloads (from
//! `util/request_helper.rs`), so the messages interpolate the resource URL and
//! HTTP status like their TS counterparts.

use std::collections::HashSet;
use std::error::Error;

use thiserror::Error;

use crate::chain::error::WaxChainError;
use crate::chain::interceptor::InterceptorError;
use crate::chain::util::{DetailedResponseData, RequestOptions};

/// Represents a probe failure wrapped by the health checker, emitted through
/// [`super::HealthCheckerEvent::Error`].
///
/// TS NOTE: `WaxHealthCheckerError`.
#[derive(Debug, Error)]
#[error("Health checker error: {source}")]
pub struct HealthCheckerError {
    #[source]
    pub source: Box<dyn Error + Send + Sync>,
    pub endpoint: EndpointInfo,
    pub api_url: Option<String>,
}

/// Represents a user validator rejecting an otherwise successful probe
/// response, emitted through
/// [`super::HealthCheckerEvent::ValidationError`].
///
/// TS NOTE: `WaxHealthCheckerValidatorFailedError`. The TS message
/// interpolates the request options captured by its request interceptor; the
/// Rust transport builds those internally and only the response data leaves
/// [`crate::JsonRpcCaller::call_at`] / [`crate::RestCaller::call_at`], so
/// this error carries the probed node URL instead.
#[derive(Debug, Error)]
#[error("Validator did not pass on api: \"{url}\": \"{failed_reason}\"")]
pub struct ValidatorFailedError {
    pub failed_reason: String,
    pub endpoint: EndpointInfo,
    /// The node URL whose response failed validation.
    pub url: String,
    pub response: DetailedResponseData,
}

/// Represents a failure returned by a registered probe.
///
/// TS NOTE: the errors thrown out of the TS `register` caller closure — a
/// transport/API failure, or the `WaxHealthCheckerValidatorFailedError`
/// raised when the user validator rejects a decoded response. TS builds the
/// rich validator error inside that closure; the Rust closure returns the
/// reason and the raw response instead, and the endpoint builds the
/// [`ValidatorFailedError`] while recording the failure, where the live
/// endpoint identity is known.
#[derive(Debug, Error)]
pub enum ProbeFailure {
    #[error(transparent)]
    Chain(#[from] WaxChainError),

    #[error("Validator did not pass: \"{reason}\"")]
    Validation {
        reason: String,
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

    /// TS NOTE: `WaxUnknownRequestError`. TS also has
    /// `WaxRequestAbortedByUser` for the browser abort signal
    /// (`AbortController`); the Rust request layer has no user-abort path
    /// (`reqwest` reports no such error), so that subclass is not ported.
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

    /// TS NOTE: a throwing TS interceptor rejects the call promise; this is
    /// that failure made explicit. Raised by the request callback before the
    /// send (blank running data) or by the response callback after the
    /// decode (full response attached) — see [`crate::chain::interceptor`].
    #[error(
        "Interceptor error while requesting given resource \"{} {}{}\": \
         {source}",
        .request.method, .request.endpoint, .request.url
    )]
    Interceptor {
        request: RequestOptions,
        response: DetailedResponseData,
        #[source]
        source: InterceptorError,
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
