mod request;

use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use serde::Serialize;
use serde::de::DeserializeOwned;

use crate::chain::error::WaxChainError;

use self::request::{JsonRpcRequest, JsonRpcResponse};

/// Provides a cloneable handle to a chain's JSON-RPC transport. Typed API
/// surfaces produced by [`define_hive_api!`](crate::define_hive_api) hold one
/// and issue requests through [`JsonRpcCaller::call`].
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
}

/// Provides JSON-RPC transport to a Hive node.
///
/// Holds a single `reqwest::Client` (with connection pooling) and a mutable
/// endpoint URL. Per-method DTOs live in `api::*`; this layer only knows
/// envelopes.
pub(crate) struct JsonRpcClient {
    http: reqwest::Client,
    endpoint: Mutex<String>,
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
            endpoint: Mutex::new(endpoint),
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

        if let Some(err) = response.error {
            return Err(WaxChainError::JsonRpc {
                code: err.code,
                message: err.message,
            });
        }

        response.result.ok_or(WaxChainError::JsonRpc {
            code: 0,
            message: "JSON-RPC response missing both `result` and `error`"
                .into(),
        })
    }
}
