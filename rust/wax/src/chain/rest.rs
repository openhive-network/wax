//! REST request engine behind the typed API surfaces.
//!
//! - the constructor-injected "static" pair exists only to bend the one
//!   generic engine into a JSON-RPC transport (`chain_api.ts` rewrites the
//!   request into an envelope and unwraps the response); Rust has the
//!   dedicated `JsonRpcClient` instead, so this engine is REST-only,
//! - the health checker's use of the user pair (`withProxy`) — redirecting
//!   a call to a probed endpoint and smuggling timings out of the fixed
//!   `(params) => result` proxy signature — is covered by plain arguments
//!   and the [`DetailedResponseData`] return value of
//!   [`RequestHelper::request`] (see [`RestClient::call_at`]).
//!
//! The general-purpose user pair (`chain.withProxy`) DOES have a direct
//! Rust counterpart: the interceptor callbacks of
//! [`crate::chain::interceptor`], handed down from `HiveChainOptions` to
//! this engine's [`RequestHelper`].
//!
//! With the proxy gone, the TS per-call mutable state (`paths` /
//! `realPaths` / `lastMethod` / `config`) disappears as well: callers pass
//! an immutable [`RestCallDescriptor`] instead.

mod braced_strings;
mod payload;
mod query_string;

use std::sync::Arc;

use serde::Serialize;
use serde::de::DeserializeOwned;

use crate::chain::error::WaxChainError;
use crate::chain::interceptor::{
    ApiCallerKind, RequestInterceptor, ResponseInterceptor,
};
use crate::chain::transport::{
    DetailedResponseData, EndpointResolver, RequestData, RequestHelper,
    RequestOptions, ResponseType,
};

use self::payload::{
    extract_result, split_payload, substitute_path_params, to_params_map,
};

/// Provides a cloneable handle to a chain's REST transport. Typed REST API
/// surfaces hold one and issue requests through [`RestCaller::call`].
///
/// The handle shares the chain's [`RestClient`], so a later
/// `set_rest_endpoint_url` on the chain is reflected by API surfaces already
/// handed out.
#[derive(Clone)]
pub struct RestCaller {
    client: Arc<RestClient>,
}

impl RestCaller {
    pub(crate) fn new(client: Arc<RestClient>) -> Self {
        Self { client }
    }

    /// Calls the REST method described by `descriptor` with `params`,
    /// returning the decoded result. See [`RestClient::call`].
    pub async fn call<P, R>(
        &self,
        descriptor: &RestCallDescriptor,
        params: P,
    ) -> Result<R, WaxChainError>
    where
        P: Serialize,
        R: DeserializeOwned,
    {
        self.client.call(descriptor, params).await
    }

    /// Calls the REST method described by `descriptor` against an explicit
    /// `endpoint`, returning the decoded result together with the raw
    /// response data (timings, status, headers). Used by health-check
    /// probes. See [`RestClient::call_at`].
    pub async fn call_at<P, R>(
        &self,
        endpoint: &str,
        descriptor: &RestCallDescriptor,
        params: P,
    ) -> Result<(R, DetailedResponseData), WaxChainError>
    where
        P: Serialize,
        R: DeserializeOwned,
    {
        self.client.call_at(endpoint, descriptor, params).await
    }

    /// Sets (or clears with `None`) the endpoint override for the given
    /// namespace path. See [`RestClient::set_endpoint_url_for_path`].
    pub fn set_endpoint_url_for_path(
        &self,
        path: &[&str],
        url: Option<String>,
    ) {
        self.client.set_endpoint_url_for_path(path, url);
    }

    /// Returns the endpoint calls under `path` currently resolve to: the
    /// deepest matching per-namespace override, else the transport-wide
    /// default endpoint.
    pub fn endpoint_url_for_path(&self, path: &[&str]) -> String {
        self.client.endpoint_url_for_path(path)
    }
}

/// Provides the REST request engine behind the typed API surfaces produced by
/// `extend_rest`.
///
/// Each generated method holds a static [`RestCallDescriptor`] and delegates
/// to [`RestClient::call`], which substitutes path parameters, splits the
/// remaining params into query string or body, performs the request and
/// decodes the typed result.
pub struct RestClient {
    helper: RequestHelper,
    /// Default endpoint plus the per-namespace overrides (see
    /// [`EndpointResolver`]).
    endpoints: EndpointResolver,
    /// Request timeout in milliseconds; `0` disables it.
    timeout_ms: u64,
    /// `X-Wax-Api-Caller` header value attached to every request.
    wax_api_caller: Option<String>,
}

/// Represents one REST method as emitted by
/// [`#[hive_api(rest)]`](crate::hive_api) — the static analog of the call
/// the TS proxy assembles at property-access time (`paths`, `lastMethod` and
/// `config.urlPath`).
#[derive(Debug, Clone, Copy)]
pub struct RestCallDescriptor {
    /// HTTP verb of the method.
    pub method: &'static str,
    /// URL path with `{param}` placeholders filled from the request params.
    pub path_template: &'static str,
    /// Logical path of the method within the API surface; feeds the
    /// per-namespace endpoint overrides (TS `realPaths`).
    pub namespace_path: &'static [&'static str],
}

impl RestClient {
    /// Creates a REST caller issuing requests against `endpoint`, running
    /// the given interceptor callbacks (when set) around every request —
    /// `call` and `call_at` probes alike.
    pub fn new(
        endpoint: String,
        timeout_ms: u64,
        wax_api_caller: Option<String>,
        request_interceptor: Option<RequestInterceptor>,
        response_interceptor: Option<ResponseInterceptor>,
    ) -> Self {
        Self {
            helper: RequestHelper::with_interceptors(
                ApiCallerKind::Rest,
                request_interceptor,
                response_interceptor,
            ),
            endpoints: EndpointResolver::new(endpoint),
            timeout_ms,
            wax_api_caller,
        }
    }

    pub fn endpoint(&self) -> String {
        self.endpoints.default_url()
    }

    pub fn set_endpoint(&self, url: String) {
        self.endpoints.set_default_url(url);
    }

    /// Sets (or clears with `None`) the endpoint override for the given
    /// namespace path; an empty path overrides every call of this caller.
    pub fn set_endpoint_url_for_path(
        &self,
        path: &[&str],
        url: Option<String>,
    ) {
        self.endpoints.set_url_for_path(path, url);
    }

    /// Returns the endpoint calls under `path` currently resolve to. See
    /// [`RestCaller::endpoint_url_for_path`].
    pub fn endpoint_url_for_path(&self, path: &[&str]) -> String {
        self.endpoints.resolve(path)
    }

    /// Calls the REST method described by `descriptor` with `params`,
    /// returning the decoded result.
    pub async fn call<P, R>(
        &self,
        descriptor: &RestCallDescriptor,
        params: P,
    ) -> Result<R, WaxChainError>
    where
        P: Serialize,
        R: DeserializeOwned,
    {
        let endpoint = self.endpoints.resolve(descriptor.namespace_path);
        let (result, _) = self.call_at(&endpoint, descriptor, params).await?;

        Ok(result)
    }

    /// Calls the REST method described by `descriptor` against an explicit
    /// `endpoint` (ignoring the caller's endpoint and overrides), returning
    /// the decoded result together with the raw response data (timings,
    /// status, headers). Used by health-check probes.
    pub async fn call_at<P, R>(
        &self,
        endpoint: &str,
        descriptor: &RestCallDescriptor,
        params: P,
    ) -> Result<(R, DetailedResponseData), WaxChainError>
    where
        P: Serialize,
        R: DeserializeOwned,
    {
        let params = to_params_map(params)?;
        let (path, params) =
            substitute_path_params(descriptor.path_template, params)?;
        let (query_string, body) = split_payload(descriptor.method, params);

        let request =
            self.build_request(endpoint, descriptor, path, query_string, body);
        let response = self.helper.request(request.clone()).await?;

        extract_result(request, response)
    }

    /// Assembles the request options; TS `api_caller.ts` lines 129-143.
    fn build_request(
        &self,
        endpoint: &str,
        descriptor: &RestCallDescriptor,
        path: String,
        query_string: String,
        body: Option<RequestData>,
    ) -> RequestOptions {
        RequestOptions {
            endpoint: endpoint.to_string(),
            url: format!("{path}{query_string}"),
            method: descriptor.method.to_string(),
            timeout: self.timeout_ms,
            data: body,
            response_type: Some(ResponseType::Json),
            wax_api_caller: self.wax_api_caller.clone(),
            extra_headers: Vec::new(),
        }
    }
}

#[cfg(test)]
mod tests {
    use serde::Deserialize;
    use serde_json::{Value, json};

    use super::super::transport::test_support::{
        header_value, spawn_capture_server,
    };
    use super::*;

    #[tokio::test]
    async fn performs_get_call_with_path_and_query_params() {
        let (endpoint, captured) =
            spawn_capture_server(r#"{"transaction_json":{"id":1}}"#);

        #[derive(Deserialize)]
        struct TransactionResponse {
            transaction_json: Value,
        }

        const DESC: RestCallDescriptor = RestCallDescriptor {
            method: "GET",
            path_template: "/hafah-api/transactions/{transactionId}",
            namespace_path: &["hafah_api", "transactions"],
        };

        let caller = RestClient::new(
            endpoint,
            0,
            Some("test-wax-client-v1.0".into()),
            None,
            None,
        );

        let result: TransactionResponse = caller
            .call(
                &DESC,
                json!({ "transactionId": "954f", "include-virtual": true }),
            )
            .await
            .unwrap();

        assert_eq!(result.transaction_json, json!({ "id": 1 }));

        let raw = captured.recv().unwrap();

        assert!(
            raw.starts_with(
                "GET /hafah-api/transactions/954f?include-virtual=true \
                 HTTP/1.1"
            ),
            "unexpected request line in: {raw}"
        );
        assert_eq!(
            header_value(&raw, "x-wax-api-caller").as_deref(),
            Some("test-wax-client-v1.0")
        );
    }

    #[tokio::test]
    async fn posts_remaining_params_as_json_body() {
        let (endpoint, captured) = spawn_capture_server(r#"{"ok":true}"#);

        const DESC: RestCallDescriptor = RestCallDescriptor {
            method: "POST",
            path_template: "/items/{id}",
            namespace_path: &["items"],
        };

        let caller = RestClient::new(endpoint, 0, None, None, None);

        let _: Value = caller
            .call(&DESC, json!({ "id": 7, "name": "widget" }))
            .await
            .unwrap();

        let raw = captured.recv().unwrap();

        assert!(raw.starts_with("POST /items/7 HTTP/1.1"));
        assert!(raw.ends_with(r#"{"name":"widget"}"#));
    }

    fn caller_with_default(endpoint: &str) -> RestClient {
        RestClient::new(endpoint.into(), 0, None, None, None)
    }

    // NOTE: the pure prefix-resolution semantics (longest match, root
    // override, replace, clear) are covered on the shared
    // [`EndpointResolver`] in `util/endpoints.rs`.

    #[tokio::test]
    async fn call_at_hits_explicit_endpoint_and_returns_timings() {
        let (endpoint, captured) = spawn_capture_server(r#"{"ok":true}"#);

        const DESC: RestCallDescriptor = RestCallDescriptor {
            method: "GET",
            path_template: "/headblock",
            namespace_path: &["hafah_api", "headblock"],
        };

        let caller = caller_with_default("http://127.0.0.1:1");
        let (result, timings): (Value, _) =
            caller.call_at(&endpoint, &DESC, ()).await.unwrap();

        assert_eq!(result, json!({ "ok": true }));
        assert_eq!(timings.status, Some(200));
        assert!(timings.end.expect("set on success") >= timings.start);
        assert!(captured.recv().unwrap().starts_with("GET /headblock"));
    }

    // Interceptors handed to the client must run for `call` AND `call_at`
    // (the health-check probe path) — uniform by design, so e.g. an auth
    // header reaches probes too.
    #[tokio::test]
    async fn interceptors_apply_to_call_and_call_at() {
        use std::sync::Mutex;

        use crate::capture;

        const DESC: RestCallDescriptor = RestCallDescriptor {
            method: "GET",
            path_template: "/headblock",
            namespace_path: &["hafah_api", "headblock"],
        };

        let kinds = Arc::new(Mutex::new(Vec::new()));

        let (call_endpoint, _call_captured) =
            spawn_capture_server(r#"{"ok":true}"#);
        let (probe_endpoint, _probe_captured) =
            spawn_capture_server(r#"{"ok":true}"#);

        let caller = RestClient::new(
            call_endpoint,
            0,
            None,
            Some(Arc::new(capture!(
                [kinds] | data | {
                    kinds.lock().unwrap().push(data.caller);

                    Ok(data.options)
                }
            ))),
            None,
        );

        let _: Value = caller.call(&DESC, ()).await.unwrap();
        let _: (Value, _) =
            caller.call_at(&probe_endpoint, &DESC, ()).await.unwrap();

        use crate::chain::interceptor::ApiCallerKind;

        assert_eq!(*kinds.lock().unwrap(), vec![ApiCallerKind::Rest; 2]);
    }

    // End-to-end: an overridden namespace routes to its own server. The
    // caller-wide default is unroutable, so a routing mistake fails loudly.
    #[tokio::test]
    async fn routes_call_to_overridden_endpoint() {
        let (endpoint, captured) = spawn_capture_server(r#"{"ok":true}"#);

        const DESC: RestCallDescriptor = RestCallDescriptor {
            method: "GET",
            path_template: "/headblock",
            namespace_path: &["hafah_api", "headblock"],
        };

        let caller = caller_with_default("http://127.0.0.1:1");
        caller.set_endpoint_url_for_path(&["hafah_api"], Some(endpoint));

        let _: Value = caller.call(&DESC, ()).await.unwrap();

        let raw = captured.recv().unwrap();

        assert!(raw.starts_with("GET /headblock HTTP/1.1"));
    }
}
