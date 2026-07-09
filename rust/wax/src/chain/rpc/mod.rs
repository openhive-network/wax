mod request;

use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use serde::Serialize;
use serde::de::DeserializeOwned;
use serde_json::Value;

use crate::chain::error::WaxChainError;
use crate::chain::util::{
    DetailedResponseData, RequestData, RequestHelper, RequestOptions,
    ResponseType,
};

use self::request::{JsonRpcRequest, JsonRpcResponse};

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

    /// Calls the JSON-RPC method `"<namespace>.<method>"` with `params`,
    /// returning the decoded `result`.
    pub async fn call<P, R>(
        &self,
        method: &str,
        params: P,
    ) -> Result<R, WaxChainError>
    where
        P: Serialize,
        R: DeserializeOwned,
    {
        self.client.call(method, params).await
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
}

/// Provides JSON-RPC transport to a Hive node.
///
/// Holds a single `reqwest::Client` (with connection pooling) and a mutable
/// endpoint URL. Per-method DTOs live in `api::*`; this layer only knows
/// envelopes.
///
/// NOTE: the probe path ([`Self::call_at`]) goes through a [`RequestHelper`]
/// instead of the plain `reqwest::Client`, because probes need the recorded
/// timings and the request-layer error taxonomy ([`crate::RequestError`]);
/// the regular [`Self::call`] path stays on the leaner client.
pub(crate) struct JsonRpcClient {
    http: reqwest::Client,
    helper: RequestHelper,
    endpoint: Mutex<String>,
    /// Request timeout in milliseconds; `0` disables it.
    timeout_ms: u64,
    next_id: AtomicU64,
}

impl JsonRpcClient {
    pub(crate) fn new(
        endpoint: String,
        timeout: Duration,
    ) -> Result<Self, WaxChainError> {
        let http = reqwest::Client::builder()
            .timeout(timeout)
            .build()
            .map_err(WaxChainError::from)?;
        Ok(Self {
            http,
            helper: RequestHelper::new(),
            endpoint: Mutex::new(endpoint),
            timeout_ms: timeout.as_millis() as u64,
            next_id: AtomicU64::new(1),
        })
    }

    pub(crate) fn endpoint(&self) -> String {
        self.endpoint
            .lock()
            .expect("endpoint mutex poisoned")
            .clone()
    }

    pub(crate) fn set_endpoint(&self, url: String) {
        *self.endpoint.lock().expect("endpoint mutex poisoned") = url;
    }

    /// Issues a single JSON-RPC call. Returns the decoded `result` payload, or
    /// a [`WaxChainError`] when the transport fails, the response can't be
    /// decoded, or the node reports an error envelope.
    pub(crate) async fn call<P, R>(
        &self,
        method: &str,
        params: P,
    ) -> Result<R, WaxChainError>
    where
        P: Serialize,
        R: DeserializeOwned,
    {
        let id = self.next_id.fetch_add(1, Ordering::Relaxed);
        let body = JsonRpcRequest::new(id, method, params);
        let endpoint = self.endpoint();

        let response: JsonRpcResponse<R> = self
            .http
            .post(&endpoint)
            .json(&body)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;

        unwrap_envelope(response)
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
            // NOTE: the chain-level `wax_api_caller` tag currently only
            // reaches the REST caller (TS sets it on both transports).
            wax_api_caller: None,
        };

        let response = self.helper.request(request).await?;
        let envelope: JsonRpcResponse<R> = serde_json::from_value(
            response.response.clone().unwrap_or(Value::Null),
        )?;
        let result = unwrap_envelope(envelope)?;

        Ok((result, response))
    }
}

/// Converts a decoded JSON-RPC envelope into its `result` payload, or the
/// matching [`WaxChainError`] when the node reports an error envelope or the
/// envelope carries neither field.
fn unwrap_envelope<R>(
    response: JsonRpcResponse<R>,
) -> Result<R, WaxChainError> {
    if let Some(err) = response.error {
        return Err(WaxChainError::JsonRpc {
            code: err.code,
            message: err.message,
        });
    }

    response.result.ok_or(WaxChainError::JsonRpc {
        code: 0,
        message: "JSON-RPC response missing both `result` and `error`".into(),
    })
}

#[cfg(test)]
mod tests {
    use serde_json::{Value, json};

    use super::super::util::test_support::spawn_capture_server;
    use super::*;

    fn client(endpoint: &str) -> JsonRpcClient {
        JsonRpcClient::new(endpoint.to_string(), Duration::from_secs(5))
            .unwrap()
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
