//! REST request engine behind the typed API surfaces.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/util/api_caller.ts`. The TS
//! `ApiCaller` is a `Proxy` that accumulates the URL path at property-access
//! time and carries two interceptor chains; neither survives the port:
//!
//! - the constructor-injected "static" pair exists only to bend the one
//!   generic engine into a JSON-RPC transport (`chain_api.ts` rewrites the
//!   request into an envelope and unwraps the response); Rust has the
//!   dedicated `JsonRpcClient` instead, so this engine is REST-only,
//! - the user pair (`withProxy`) exists to redirect a call to a probed
//!   endpoint and to smuggle timings out of the fixed `(params) => result`
//!   proxy signature; the Rust health checker gets both through plain
//!   arguments and the [`DetailedResponseData`] return value of
//!   [`RequestHelper::request`].
//!
//! With the proxy and the interceptors gone, the TS per-call mutable state
//! (`paths` / `realPaths` / `lastMethod` / `config`) disappears as well:
//! callers pass an immutable [`RestCallDescriptor`] instead.

mod braced_strings;
mod payload;
mod query_string;

use std::sync::{Arc, Mutex};

use serde::Serialize;
use serde::de::DeserializeOwned;

use crate::chain::error::WaxChainError;
use crate::chain::util::{
    DetailedResponseData, RequestData, RequestHelper, RequestOptions,
    ResponseType,
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
    /// TS NOTE: `defaultEndpointUrl`. Mutable behind a shared reference so an
    /// endpoint change on the chain is reflected by API handles already
    /// handed out, like the live TS proxy.
    endpoint: Mutex<String>,
    /// Request timeout in milliseconds; `0` disables it.
    timeout_ms: u64,
    /// `X-Wax-Api-Caller` header value attached to every request.
    wax_api_caller: Option<String>,
    /// Per-namespace endpoint overrides; the deepest matching prefix wins.
    ///
    /// TS NOTE: TS scatters `endpointUrl` keys across the `localTypes` tree
    /// (`getEndpointUrlForRestApi` / `setEndpointUrlForPath`); the Rust port
    /// keeps a flat prefix list instead.
    overrides: Mutex<Vec<EndpointOverride>>,
}

/// Represents a single per-namespace endpoint override: calls whose namespace
/// path starts with `path` are routed to `url`.
struct EndpointOverride {
    path: Vec<String>,
    url: String,
}

/// Represents one REST method as emitted by
/// [`#[hive_api(rest)]`](crate::hive_api) — the static analog of the call
/// the TS proxy assembles at property-access time (`paths`, `lastMethod` and
/// `config.urlPath`).
pub struct RestCallDescriptor {
    /// HTTP verb of the method.
    ///
    /// TS NOTE: `TWaxApiRequest.method`, defaulted to `GET` for REST callers.
    pub method: &'static str,
    /// URL path with `{param}` placeholders filled from the request params.
    pub path_template: &'static str,
    /// Logical path of the method within the API surface; feeds the
    /// per-namespace endpoint overrides (TS `realPaths`).
    pub namespace_path: &'static [&'static str],
}

impl RestClient {
    /// Creates a REST caller issuing requests against `endpoint`.
    pub fn new(
        endpoint: String,
        timeout_ms: u64,
        wax_api_caller: Option<String>,
    ) -> Self {
        Self {
            helper: RequestHelper::new(),
            endpoint: Mutex::new(endpoint),
            timeout_ms,
            wax_api_caller,
            overrides: Mutex::new(Vec::new()),
        }
    }

    pub fn endpoint(&self) -> String {
        self.endpoint
            .lock()
            .expect("endpoint mutex poisoned")
            .clone()
    }

    pub fn set_endpoint(&self, url: String) {
        *self.endpoint.lock().expect("endpoint mutex poisoned") = url;
    }

    /// Sets (or clears with `None`) the endpoint override for the given
    /// namespace path; an empty path overrides every call of this caller.
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
        let mut overrides =
            self.overrides.lock().expect("overrides mutex poisoned");

        overrides.retain(|o| o.path != path);

        if let Some(url) = url {
            overrides.push(EndpointOverride {
                path: path.iter().map(ToString::to_string).collect(),
                url,
            });
        }
    }

    /// Resolves the endpoint for a call: the deepest override whose path
    /// prefixes the namespace path, or the caller-wide endpoint.
    ///
    /// TS NOTE: `getEndpointUrlForRestApi` — TS walks the `localTypes` tree
    /// keeping the deepest `endpointUrl` seen on the way; the flat
    /// equivalent is the longest matching prefix.
    fn resolve_endpoint(&self, namespace_path: &[&str]) -> String {
        let overrides =
            self.overrides.lock().expect("overrides mutex poisoned");

        overrides
            .iter()
            .filter(|o| {
                o.path.len() <= namespace_path.len()
                    && o.path.iter().zip(namespace_path).all(|(a, b)| a == b)
            })
            .max_by_key(|o| o.path.len())
            .map(|o| o.url.clone())
            .unwrap_or_else(|| self.endpoint())
    }

    /// Calls the REST method described by `descriptor` with `params`,
    /// returning the decoded result.
    ///
    /// TS NOTE: the body of the TS `callFn` (`api_caller.ts` lines 104-154)
    /// minus the interceptor chain, which has no Rust counterpart (see the
    /// module docs).
    pub async fn call<P, R>(
        &self,
        descriptor: &RestCallDescriptor,
        params: P,
    ) -> Result<R, WaxChainError>
    where
        P: Serialize,
        R: DeserializeOwned,
    {
        let endpoint = self.resolve_endpoint(descriptor.namespace_path);
        let (result, _) = self.call_at(&endpoint, descriptor, params).await?;

        Ok(result)
    }

    /// Calls the REST method described by `descriptor` against an explicit
    /// `endpoint` (ignoring the caller's endpoint and overrides), returning
    /// the decoded result together with the raw response data (timings,
    /// status, headers). Used by health-check probes.
    ///
    /// TS NOTE: the capability behind `withProxy` — the TS health checker
    /// redirects a call through a request interceptor rewriting
    /// `data.endpoint` and captures the timings through a response
    /// interceptor; Rust takes the endpoint as an argument and returns the
    /// timings instead.
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
        }
    }
}

#[cfg(test)]
mod tests {
    use serde::Deserialize;
    use serde_json::{Value, json};

    use super::super::util::test_support::{
        header_value, spawn_capture_server,
    };
    use super::*;

    // TS NOTE: mirrors the REST case of
    // `ts/wasm/__tests__/detailed/wax_api_caller_header.ts` plus the path
    // substitution of `hive_chain_rest_api.ts` ('Should be able to extend and
    // perform REST API calls') — one GET with a path param, a query param and
    // the `x-wax-api-caller` header, asserted off the wire.
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

        let caller =
            RestClient::new(endpoint, 0, Some("test-wax-client-v1.0".into()));

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

        let caller = RestClient::new(endpoint, 0, None);

        let _: Value = caller
            .call(&DESC, json!({ "id": 7, "name": "widget" }))
            .await
            .unwrap();

        let raw = captured.recv().unwrap();

        assert!(raw.starts_with("POST /items/7 HTTP/1.1"));
        assert!(raw.ends_with(r#"{"name":"widget"}"#));
    }

    fn caller_with_default(endpoint: &str) -> RestClient {
        RestClient::new(endpoint.into(), 0, None)
    }

    // TS NOTE: mirrors the per-path `endpointUrl` semantics asserted in
    // `hive_chain_rest_api.ts` ('extended.restApi.a.endpointUrl = url1;
    // extended.restApi.a.b.endpointUrl = url2') — the deepest override wins
    // and siblings fall back to the shallower one.
    #[test]
    fn resolves_endpoint_from_longest_matching_override() {
        let caller = caller_with_default("http://default");

        caller.set_endpoint_url_for_path(&["a"], Some("http://a".into()));
        caller.set_endpoint_url_for_path(&["a", "b"], Some("http://ab".into()));

        assert_eq!(caller.resolve_endpoint(&["a", "b", "c"]), "http://ab");
        assert_eq!(caller.resolve_endpoint(&["a", "x"]), "http://a");
        assert_eq!(caller.resolve_endpoint(&["z"]), "http://default");
    }

    // TS NOTE: `chain.restApi.endpointUrl = url` — a root-level override
    // applies to every namespace of the caller.
    #[test]
    fn root_override_applies_to_every_path() {
        let caller = caller_with_default("http://default");

        caller.set_endpoint_url_for_path(&[], Some("http://root".into()));

        assert_eq!(caller.resolve_endpoint(&["any", "path"]), "http://root");
        assert_eq!(caller.resolve_endpoint(&[]), "http://root");
    }

    #[test]
    fn replaces_existing_override_for_same_path() {
        let caller = caller_with_default("http://default");

        caller.set_endpoint_url_for_path(&["a"], Some("http://old".into()));
        caller.set_endpoint_url_for_path(&["a"], Some("http://new".into()));

        assert_eq!(caller.resolve_endpoint(&["a"]), "http://new");
    }

    // Documents the intentional TS divergence: clearing an override follows
    // the live default instead of pinning the default current at clear time.
    #[test]
    fn clearing_override_restores_live_default() {
        let caller = caller_with_default("http://default");

        caller.set_endpoint_url_for_path(&["a"], Some("http://a".into()));
        caller.set_endpoint_url_for_path(&["a"], None);
        caller.set_endpoint(String::from("http://changed"));

        assert_eq!(caller.resolve_endpoint(&["a"]), "http://changed");
    }

    // TS NOTE: the health-checker seam — `withProxy`'s endpoint rewrite and
    // timings capture become an explicit argument and a returned value. The
    // caller-wide default is unroutable, so `call_at` must hit the given
    // endpoint.
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
