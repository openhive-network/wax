mod request;

use std::sync::Arc;
use std::sync::atomic::{AtomicU64, Ordering};

use serde::Serialize;
use serde::de::DeserializeOwned;
use serde_json::Value;

use crate::chain::error::WaxChainError;
use crate::chain::interceptor::{
    ApiCallerKind, RequestInterceptor, ResponseInterceptor,
};
use crate::chain::util::{
    DetailedResponseData, EndpointResolver, RequestData, RequestHelper,
    RequestOptions, ResponseType,
};

use self::request::{JsonRpcRequest, JsonRpcResponse, unwrap_envelope};

/// Provides a cloneable handle to a chain's JSON-RPC transport. Typed API
/// surfaces produced by [`#[hive_api]`](crate::hive_api) hold one and issue
/// requests through [`JsonRpcCaller::call`].
///
/// The handle shares the chain's [`JsonRpcClient`], so a later
/// `set_endpoint_url` on the chain is reflected by API surfaces already
/// handed out.
///
/// TS NOTE: the TS analog is the `ApiCaller` proxy configured for JSON-RPC in
/// `chain_api.ts`; the generated Rust methods bind to this handle instead.
#[derive(Clone)]
pub struct JsonRpcCaller {
    client: Arc<JsonRpcClient>,
}

impl JsonRpcCaller {
    pub(crate) fn new(client: Arc<JsonRpcClient>) -> Self {
        Self { client }
    }

    /// Calls the JSON-RPC method described by `descriptor` with `params`
    /// against the endpoint resolved from the descriptor's namespace path
    /// (per-namespace override, else the chain-wide endpoint), returning
    /// the decoded `result`.
    pub async fn call<P, R>(
        &self,
        descriptor: &JsonRpcCallDescriptor,
        params: P,
    ) -> Result<R, WaxChainError>
    where
        P: Serialize,
        R: DeserializeOwned,
    {
        self.client.call(descriptor, params).await
    }

    /// Calls the JSON-RPC method against an explicit `endpoint` (ignoring
    /// the chain's configured one), returning the decoded `result` together
    /// with the raw response data (timings, status, headers). Used by
    /// health-check probes.
    ///
    /// TS NOTE: the capability behind `withProxy` — the TS health checker
    /// redirects a call through a request interceptor rewriting
    /// `data.endpoint` and captures the timings through a response
    /// interceptor; Rust takes the endpoint as an argument and returns the
    /// timings instead.
    pub async fn call_at<P, R>(
        &self,
        endpoint: &str,
        method: &str,
        params: P,
    ) -> Result<(R, DetailedResponseData), WaxChainError>
    where
        P: Serialize,
        R: DeserializeOwned,
    {
        self.client.call_at(endpoint, method, params).await
    }

    /// Sets (or clears with `None`) the endpoint override for the given
    /// namespace path; an empty path overrides every call of this
    /// transport.
    ///
    /// TS NOTE: `setEndpointUrlForPath`. Clearing diverges: TS pins the
    /// *current* `defaultEndpointUrl` into the path, so a later default
    /// change no longer reaches it; the Rust port removes the override, so
    /// the path follows the live default again.
    pub fn set_endpoint_url_for_path(
        &self,
        path: &[&str],
        url: Option<String>,
    ) {
        self.client.set_endpoint_url_for_path(path, url);
    }
}

/// Represents one JSON-RPC method as emitted by
/// [`#[hive_api]`](crate::hive_api): the wire method name and the logical
/// path of the method within the API surface.
///
/// TS NOTE: the JSON-RPC counterpart of [`crate::RestCallDescriptor`] — the
/// static analog of the path the TS proxy assembles at property-access time
/// (`paths` and the `"<ns>.<method>"` string built from them).
#[derive(Debug, Clone, Copy)]
pub struct JsonRpcCallDescriptor {
    /// Wire method name, e.g. `"block_api.get_block"`.
    pub method: &'static str,
    /// Logical path of the method within the API surface, e.g.
    /// `["block_api", "get_block"]`; feeds health-check endpoint
    /// registration (TS `paths`).
    pub namespace_path: &'static [&'static str],
}

/// Provides JSON-RPC transport to a Hive node.
///
/// Holds a [`RequestHelper`] (one pooled `reqwest::Client`) and a mutable
/// endpoint URL. Per-method DTOs live in `api::*`; this layer only knows
/// envelopes.
pub(crate) struct JsonRpcClient {
    helper: RequestHelper,
    /// Default endpoint plus the per-namespace overrides (see
    /// [`EndpointResolver`]).
    endpoints: EndpointResolver,
    /// Request timeout in milliseconds; `0` disables it.
    timeout_ms: u64,
    /// `X-Wax-Api-Caller` header value attached to every request.
    wax_api_caller: Option<String>,
    next_id: AtomicU64,
}

impl JsonRpcClient {
    /// Creates a JSON-RPC client issuing requests against `endpoint`,
    /// running the given interceptor callbacks (when set) around every
    /// request — `call` and `call_at` probes alike (see
    /// [`crate::chain::interceptor`]).
    pub(crate) fn new(
        endpoint: String,
        timeout_ms: u64,
        wax_api_caller: Option<String>,
        request_interceptor: Option<RequestInterceptor>,
        response_interceptor: Option<ResponseInterceptor>,
    ) -> Self {
        Self {
            helper: RequestHelper::with_interceptors(
                ApiCallerKind::JsonRpc,
                request_interceptor,
                response_interceptor,
            ),
            endpoints: EndpointResolver::new(endpoint),
            timeout_ms,
            wax_api_caller,
            next_id: AtomicU64::new(1),
        }
    }

    pub(crate) fn endpoint(&self) -> String {
        self.endpoints.default_url()
    }

    pub(crate) fn set_endpoint(&self, url: String) {
        self.endpoints.set_default_url(url);
    }

    /// Sets (or clears with `None`) the endpoint override for the given
    /// namespace path; an empty path overrides every call of this client.
    /// See [`EndpointResolver::set_url_for_path`] for the TS divergence on
    /// clearing.
    pub(crate) fn set_endpoint_url_for_path(
        &self,
        path: &[&str],
        url: Option<String>,
    ) {
        self.endpoints.set_url_for_path(path, url);
    }

    /// Issues a single JSON-RPC call against the endpoint resolved from the
    /// descriptor's namespace path (per-namespace override, else the
    /// client-wide endpoint). Returns the decoded `result` payload, or a
    /// [`WaxChainError`] when the transport fails, the response can't be
    /// decoded, or the node reports an error envelope.
    pub(crate) async fn call<P, R>(
        &self,
        descriptor: &JsonRpcCallDescriptor,
        params: P,
    ) -> Result<R, WaxChainError>
    where
        P: Serialize,
        R: DeserializeOwned,
    {
        let endpoint = self.endpoints.resolve(descriptor.namespace_path);
        let (result, _) =
            self.call_at(&endpoint, descriptor.method, params).await?;

        Ok(result)
    }

    /// Issues a single JSON-RPC call against an explicit `endpoint`,
    /// additionally returning the raw response data (timings, status,
    /// headers). See [`JsonRpcCaller::call_at`].
    pub(crate) async fn call_at<P, R>(
        &self,
        endpoint: &str,
        method: &str,
        params: P,
    ) -> Result<(R, DetailedResponseData), WaxChainError>
    where
        P: Serialize,
        R: DeserializeOwned,
    {
        let id = self.next_id.fetch_add(1, Ordering::Relaxed);
        let body = JsonRpcRequest::new(id, method, params);
        let request = RequestOptions {
            endpoint: endpoint.to_string(),
            url: String::new(),
            method: "POST".to_string(),
            timeout: self.timeout_ms,
            data: Some(RequestData::Json(serde_json::to_value(&body)?)),
            response_type: Some(ResponseType::Json),
            wax_api_caller: self.wax_api_caller.clone(),
            extra_headers: Vec::new(),
        };

        let response = self.helper.request(request).await?;
        let envelope: JsonRpcResponse<R> = serde_json::from_value(
            response.response.clone().unwrap_or(Value::Null),
        )?;
        let result = unwrap_envelope(envelope)?;

        Ok((result, response))
    }
}

#[cfg(test)]
mod tests {
    use serde_json::{Value, json};

    use super::super::util::test_support::{
        header_value, spawn_capture_server,
    };
    use super::*;

    fn client(endpoint: &str) -> JsonRpcClient {
        JsonRpcClient::new(endpoint.to_string(), 5_000, None, None, None)
    }

    const PING: JsonRpcCallDescriptor = JsonRpcCallDescriptor {
        method: "test_api.ping",
        namespace_path: &["test_api", "ping"],
    };

    // TS NOTE: the standard-API case of
    // `ts/wasm/__tests__/detailed/wax_api_caller_header.ts` — the chain-level
    // tag must reach regular JSON-RPC calls, like it reaches REST calls.
    #[tokio::test]
    async fn call_sets_wax_api_caller_header() {
        let (endpoint, captured) = spawn_capture_server(
            r#"{"jsonrpc":"2.0","id":1,"result":{"pong":1}}"#,
        );

        let rpc = JsonRpcClient::new(
            endpoint,
            0,
            Some("test-wax-client-v1.0".into()),
            None,
            None,
        );
        let _: Value = rpc.call(&PING, ()).await.unwrap();

        let raw = captured.recv().unwrap();

        assert_eq!(
            header_value(&raw, "x-wax-api-caller").as_deref(),
            Some("test-wax-client-v1.0")
        );
    }

    // End-to-end: an overridden namespace routes to its own server, like on
    // the REST side. The client-wide default is unroutable, so a routing
    // mistake fails loudly.
    #[tokio::test]
    async fn routes_call_to_overridden_endpoint() {
        let (endpoint, captured) = spawn_capture_server(
            r#"{"jsonrpc":"2.0","id":1,"result":{"pong":1}}"#,
        );

        let rpc = client("http://127.0.0.1:1");
        rpc.set_endpoint_url_for_path(&["test_api"], Some(endpoint));

        let _: Value = rpc.call(&PING, ()).await.unwrap();

        assert!(
            captured
                .recv()
                .unwrap()
                .contains(r#""method":"test_api.ping""#)
        );
    }

    // Interceptors handed to the client must run for `call` AND `call_at`
    // (the health-check probe path) — uniform by design, so e.g. an auth
    // header reaches probes too.
    #[tokio::test]
    async fn interceptors_apply_to_call_and_call_at() {
        use std::sync::Mutex;

        use crate::capture;
        use crate::chain::interceptor::ApiCallerKind;

        let kinds = Arc::new(Mutex::new(Vec::new()));

        let (call_endpoint, _call_captured) = spawn_capture_server(
            r#"{"jsonrpc":"2.0","id":1,"result":{"pong":1}}"#,
        );
        let (probe_endpoint, _probe_captured) = spawn_capture_server(
            r#"{"jsonrpc":"2.0","id":2,"result":{"pong":1}}"#,
        );

        let rpc = JsonRpcClient::new(
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

        let _: Value = rpc.call(&PING, ()).await.unwrap();
        let _: (Value, _) = rpc
            .call_at(&probe_endpoint, "test_api.ping", ())
            .await
            .unwrap();

        assert_eq!(*kinds.lock().unwrap(), vec![ApiCallerKind::JsonRpc; 2]);
    }

    // TS NOTE: the health-checker seam for JSON-RPC probes — `withProxy`'s
    // endpoint rewrite and timings capture become an explicit argument and a
    // returned value. The client's own endpoint is unroutable, so `call_at`
    // must hit the given one.
    #[tokio::test]
    async fn call_at_posts_envelope_to_explicit_endpoint() {
        let (endpoint, captured) = spawn_capture_server(
            r#"{"jsonrpc":"2.0","id":1,"result":{"pong":1}}"#,
        );

        let rpc = client("http://127.0.0.1:1");
        let (result, timings): (Value, _) = rpc
            .call_at(&endpoint, "test_api.ping", json!({ "token": 1 }))
            .await
            .unwrap();

        assert_eq!(result, json!({ "pong": 1 }));
        assert_eq!(timings.status, Some(200));
        assert!(timings.end.expect("set on success") >= timings.start);

        let raw = captured.recv().unwrap();

        assert!(raw.starts_with("POST / HTTP/1.1"));
        assert!(raw.contains(r#""method":"test_api.ping""#));
        assert!(raw.contains(r#""params":{"token":1}"#));
    }

    #[tokio::test]
    async fn call_at_surfaces_json_rpc_error_envelope() {
        let (endpoint, _captured) = spawn_capture_server(
            r#"{"jsonrpc":"2.0","id":1,"error":{"code":-32601,"message":"no such method"}}"#,
        );

        let error = client("http://127.0.0.1:1")
            .call_at::<_, Value>(&endpoint, "test_api.nope", ())
            .await
            .unwrap_err();

        assert!(matches!(error, WaxChainError::JsonRpc { code: -32601, .. }));
    }

    // Probe failures must surface through the request-layer taxonomy
    // ([`RequestError`]) — the health checker classifies them into
    // [`crate::ErrorReason`]s.
    #[tokio::test]
    async fn call_at_reports_transport_failures_as_request_errors() {
        let error = client("http://127.0.0.1:1")
            .call_at::<_, Value>("http://127.0.0.1:1", "test_api.ping", ())
            .await
            .unwrap_err();

        assert!(matches!(error, WaxChainError::Request(_)));
    }
}
