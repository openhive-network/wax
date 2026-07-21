//! Configuration for the online chain layer and its default endpoints.

use std::fmt;
use std::sync::Arc;

use crate::chain::interceptor::{
    InterceptorError, InterceptorRequestOptions, RequestInterceptor,
    ResponseInterceptor,
};
use crate::chain::util::{DetailedResponseData, RequestOptions};
use crate::constants::DEFAULT_CHAIN_ID;
use crate::models::basic::ChainId;

/// Used as the default JSON-RPC API endpoint.
pub const DEFAULT_API_ENDPOINT: &str = "https://api.hive.blog";
/// Used as the default REST API endpoint.
pub const DEFAULT_REST_API_ENDPOINT: &str = "https://api.syncad.com";
/// Used as the default API request timeout, in milliseconds.
pub const DEFAULT_API_TIMEOUT_MS: u32 = 2_000;

/// Represents the configuration for a [`crate::chain::HiveChain`]: the chain id, the
/// JSON-RPC and REST endpoints, the request timeout, an optional caller tag
/// and the optional interceptor callbacks.
#[derive(Clone)]
pub struct HiveChainOptions {
    pub chain_id: ChainId,
    pub api_endpoint: String,
    pub rest_api_endpoint: String,
    pub api_timeout: u32,
    pub wax_api_caller: Option<String>,
    /// Callback run on the wax-level request options before every HTTP
    /// request the chain makes (JSON-RPC, REST, health-check probes); its
    /// return value drives the request. See [`crate::chain::interceptor`].
    ///
    /// TS NOTE: `requestInterceptor`, installed via `chain.withProxy`
    /// (`chain_api.ts:122`).
    pub request_interceptor: Option<RequestInterceptor>,
    /// Callback run on the decoded response of every successful request;
    /// its return value is what the caller (and the typed parsing) sees.
    /// See [`crate::chain::interceptor`].
    ///
    /// TS NOTE: `responseInterceptor`, installed via `chain.withProxy`
    /// (`chain_api.ts:122`).
    pub response_interceptor: Option<ResponseInterceptor>,
}

impl HiveChainOptions {
    /// Sets the request interceptor from a plain closure.
    ///
    /// TS NOTE: ergonomic counterpart of `chain.withProxy(req, res)`, which
    /// always takes the pair; each Rust side is set independently.
    pub fn with_request_interceptor(
        mut self,
        f: impl Fn(
            InterceptorRequestOptions,
        ) -> Result<RequestOptions, InterceptorError>
        + Send
        + Sync
        + 'static,
    ) -> Self {
        self.request_interceptor = Some(Arc::new(f));

        self
    }

    /// Sets the response interceptor from a plain closure.
    ///
    /// TS NOTE: ergonomic counterpart of `chain.withProxy(req, res)`, which
    /// always takes the pair; each Rust side is set independently.
    pub fn with_response_interceptor(
        mut self,
        f: impl Fn(
            DetailedResponseData,
            &InterceptorRequestOptions,
        ) -> Result<DetailedResponseData, InterceptorError>
        + Send
        + Sync
        + 'static,
    ) -> Self {
        self.response_interceptor = Some(Arc::new(f));

        self
    }
}

impl Default for HiveChainOptions {
    fn default() -> Self {
        Self {
            chain_id: DEFAULT_CHAIN_ID.to_string(),
            api_endpoint: DEFAULT_API_ENDPOINT.to_string(),
            rest_api_endpoint: DEFAULT_REST_API_ENDPOINT.to_string(),
            api_timeout: DEFAULT_API_TIMEOUT_MS,
            wax_api_caller: None,
            request_interceptor: None,
            response_interceptor: None,
        }
    }
}

// NOTE: manual because the interceptor closures are not `Debug`; they are
// reported by presence.
impl fmt::Debug for HiveChainOptions {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("HiveChainOptions")
            .field("chain_id", &self.chain_id)
            .field("api_endpoint", &self.api_endpoint)
            .field("rest_api_endpoint", &self.rest_api_endpoint)
            .field("api_timeout", &self.api_timeout)
            .field("wax_api_caller", &self.wax_api_caller)
            .field("request_interceptor", &self.request_interceptor.is_some())
            .field("response_interceptor", &self.response_interceptor.is_some())
            .finish()
    }
}
