//! Error types surfaced by the health checker and the underlying request layer.

use std::collections::HashSet;
use std::error::Error;

use thiserror::Error;

use crate::chain::error::WaxChainError;
use crate::chain::interceptor::InterceptorError;
use crate::chain::transport::{DetailedResponseData, RequestOptions};

/// Represents a probe failure wrapped by the health checker, emitted through
/// [`super::HealthCheckerEvent::Error`].
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
#[derive(Debug, Error)]
pub enum RequestError {
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

    #[error(
        "Request timed out: \"{} {}{}\"",
        .request.method, .request.endpoint, .request.url
    )]
    Timeout {
        request: RequestOptions,
        response: DetailedResponseData,
    },

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
#[derive(Debug, Clone)]
pub struct EndpointInfo {
    pub id: u32,
    pub api_caller_id: ChainApiType,
    pub paths: Vec<String>,
    pub endpoint_urls: HashSet<String>,
}

/// Represents which API caller an endpoint belongs to.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ChainApiType {
    JsonRpc,
    Rest,
}
