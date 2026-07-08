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

use std::sync::{Arc, Mutex};

use serde::Serialize;
use serde::de::DeserializeOwned;
use serde_json::{Map, Value};

use crate::chain::error::WaxChainError;

use super::braced_strings::extract_braced_strings;
use super::{
    DetailedResponseData, RequestData, RequestHelper, RequestOptions,
    ResponseType, object_to_query_string, stringify,
};

/// Provides a cloneable handle to a chain's REST transport. Typed REST API
/// surfaces hold one and issue requests through [`RestCaller::call`].
///
/// The handle shares the chain's [`ApiCaller`], so a later
/// `set_rest_endpoint_url` on the chain is reflected by API surfaces already
/// handed out.
#[derive(Clone)]
pub struct RestCaller {
    caller: Arc<ApiCaller>,
}

impl RestCaller {
    pub(crate) fn new(caller: Arc<ApiCaller>) -> Self {
        Self { caller }
    }

    /// Returns the id of the underlying REST engine.
    ///
    /// TS NOTE: `apiCallerId`.
    pub fn id(&self) -> &str {
        self.caller.id()
    }

    /// Calls the REST method described by `descriptor` with `params`,
    /// returning the decoded result. See [`ApiCaller::call`].
    pub async fn call<P, R>(
        &self,
        descriptor: &RestCallDescriptor,
        params: P,
    ) -> Result<R, WaxChainError>
    where
        P: Serialize,
        R: DeserializeOwned,
    {
        self.caller.call(descriptor, params).await
    }

    /// Sets (or clears with `None`) the endpoint override for the given
    /// namespace path. See [`ApiCaller::set_endpoint_url_for_path`].
    pub fn set_endpoint_url_for_path(
        &self,
        path: &[&str],
        url: Option<String>,
    ) {
        self.caller.set_endpoint_url_for_path(path, url);
    }
}

/// Provides the REST request engine behind the typed API surfaces produced by
/// `extend_rest`.
///
/// Each generated method holds a static [`RestCallDescriptor`] and delegates
/// to [`ApiCaller::call`], which substitutes path parameters, splits the
/// remaining params into query string or body, performs the request and
/// decodes the typed result.
pub struct ApiCaller {
    helper: RequestHelper,
    /// TS NOTE: `apiCallerId`; TS interceptors use it for originator
    /// identification, the Rust health checker will use it to identify
    /// probes.
    id: String,
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

impl ApiCaller {
    /// Creates a REST caller issuing requests against `endpoint`.
    pub fn new(
        id: String,
        endpoint: String,
        timeout_ms: u64,
        wax_api_caller: Option<String>,
    ) -> Self {
        Self {
            helper: RequestHelper::new(),
            id,
            endpoint: Mutex::new(endpoint),
            timeout_ms,
            wax_api_caller,
            overrides: Mutex::new(Vec::new()),
        }
    }

    pub fn id(&self) -> &str {
        &self.id
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
        let params = to_params_map(params)?;
        let (path, params) =
            substitute_path_params(descriptor.path_template, params)?;
        let (query_string, body) = split_payload(descriptor.method, params);

        let request = self.build_request(descriptor, path, query_string, body);
        let response = self.helper.request(request.clone()).await?;

        extract_result(request, response)
    }

    /// Assembles the request options; TS `api_caller.ts` lines 129-143.
    fn build_request(
        &self,
        descriptor: &RestCallDescriptor,
        path: String,
        query_string: String,
        body: Option<RequestData>,
    ) -> RequestOptions {
        RequestOptions {
            endpoint: self.resolve_endpoint(descriptor.namespace_path),
            url: format!("{path}{query_string}"),
            method: descriptor.method.to_string(),
            timeout: self.timeout_ms,
            data: body,
            response_type: Some(ResponseType::Json),
            wax_api_caller: self.wax_api_caller.clone(),
        }
    }
}

/// Converts the typed request params into a JSON object map; `None` when the
/// params serialize to `null` (e.g. `()` for parameterless methods).
///
/// NOTE: TS constrains params to `object | undefined` at the type level;
/// `P: Serialize` cannot, so any other JSON shape is rejected here.
fn to_params_map<P: Serialize>(
    params: P,
) -> Result<Option<Map<String, Value>>, WaxChainError> {
    match serde_json::to_value(params)? {
        Value::Null => Ok(None),
        Value::Object(map) => Ok(Some(map)),
        _ => Err(WaxChainError::NonObjectParams),
    }
}

/// Substitutes the `{param}` placeholders in the path template from the
/// params, removing each consumed key; the remaining params later become the
/// query string or the request body.
///
/// TS NOTE: `api_caller.ts` lines 105-118. TS silently skips substitution
/// when params is `undefined` and sends the braces verbatim; the Rust port
/// reports the missing parameter instead.
fn substitute_path_params(
    template: &str,
    params: Option<Map<String, Value>>,
) -> Result<(String, Option<Map<String, Value>>), WaxChainError> {
    let names = extract_braced_strings(template);
    if names.is_empty() {
        return Ok((template.to_string(), params));
    }

    let mut path = template.to_string();
    let mut params = params.unwrap_or_default();

    for name in names {
        let value = params.remove(name).ok_or_else(|| {
            WaxChainError::MissingPathParam {
                name: name.to_string(),
            }
        })?;

        path = path.replace(&format!("{{{name}}}"), &stringify(&value));
    }

    Ok((path, Some(params)))
}

/// Splits the request params into the query string (`GET` / `DELETE`) or the
/// JSON body (any other verb); TS `api_caller.ts` lines 120-127.
fn split_payload(
    method: &str,
    params: Option<Map<String, Value>>,
) -> (String, Option<RequestData>) {
    let query_string_only = method == "GET" || method == "DELETE";

    if !query_string_only {
        let body = params.map(|map| RequestData::Json(Value::Object(map)));
        return (String::new(), body);
    }

    match params {
        Some(map) if !map.is_empty() => {
            (format!("?{}", object_to_query_string(&map)), None)
        }
        _ => (String::new(), None),
    }
}

/// Decodes the response body into the typed result.
///
/// TS NOTE: TS only checks that a result is present when the API config
/// declares one (`api_caller.ts` lines 148-151) and returns it untyped; typed
/// deserialization subsumes both the presence check and shape validation.
fn extract_result<R: DeserializeOwned>(
    request: RequestOptions,
    response: DetailedResponseData,
) -> Result<R, WaxChainError> {
    let value = response.response.clone().unwrap_or(Value::Null);

    serde_json::from_value(value).map_err(|source| WaxChainError::ApiResponse {
        request,
        response,
        source,
    })
}

#[cfg(test)]
mod tests {
    use serde::Deserialize;
    use serde_json::json;

    use super::super::test_support::{header_value, spawn_capture_server};
    use super::*;

    fn map(value: Value) -> Option<Map<String, Value>> {
        match value {
            Value::Object(map) => Some(map),
            _ => panic!("fixture must be a JSON object"),
        }
    }

    #[test]
    fn substitutes_and_consumes_path_params() {
        let params = map(json!({ "id": "954f", "limit": 10 }));

        let (path, rest) =
            substitute_path_params("/transactions/{id}", params).unwrap();

        assert_eq!(path, "/transactions/954f");
        assert_eq!(rest, map(json!({ "limit": 10 })));
    }

    // Covers the JS `String()` coercion: a numeric param must not be
    // JSON-quoted in the path.
    #[test]
    fn stringifies_non_string_path_params() {
        let params = map(json!({ "typeId": 1 }));

        let (path, _) =
            substitute_path_params("/operation-types/{typeId}/keys", params)
                .unwrap();

        assert_eq!(path, "/operation-types/1/keys");
    }

    #[test]
    fn passes_params_through_without_placeholders() {
        let (path, rest) = substitute_path_params("/headblock", None).unwrap();

        assert_eq!(path, "/headblock");
        assert_eq!(rest, None);
    }

    #[test]
    fn errors_on_missing_path_param() {
        for params in [None, map(json!({ "other": 1 }))] {
            let error = substitute_path_params("/tx/{id}", params).unwrap_err();

            assert!(matches!(
                error,
                WaxChainError::MissingPathParam { ref name } if name == "id"
            ));
        }
    }

    #[test]
    fn splits_get_params_into_query_string() {
        let params = map(json!({ "a": 1, "b": "text" }));

        let (query_string, body) = split_payload("GET", params);

        assert_eq!(query_string, "?a=1&b=text");
        assert!(body.is_none());
    }

    #[test]
    fn omits_query_string_without_params() {
        assert_eq!(split_payload("GET", None), (String::new(), None));
        assert_eq!(
            split_payload("DELETE", map(json!({}))),
            (String::new(), None)
        );
    }

    #[test]
    fn splits_post_params_into_json_body() {
        let params = map(json!({ "a": 1 }));

        let (query_string, body) = split_payload("POST", params);

        assert!(query_string.is_empty());
        assert!(matches!(
            body,
            Some(RequestData::Json(value)) if value == json!({ "a": 1 })
        ));
    }

    #[test]
    fn rejects_non_object_params() {
        assert!(matches!(
            to_params_map(42).unwrap_err(),
            WaxChainError::NonObjectParams
        ));
        assert_eq!(to_params_map(()).unwrap(), None);
    }

    // TS NOTE: 'No result found in the Hive API response' — a missing or
    // mismatching body must surface as `ApiResponse`, not a panic or a bare
    // deserialization error.
    #[test]
    fn reports_undecodable_result() {
        let request = RequestOptions {
            endpoint: "http://localhost".into(),
            url: "/headblock".into(),
            method: "GET".into(),
            timeout: 0,
            data: None,
            response_type: Some(ResponseType::Json),
            wax_api_caller: None,
        };
        let response = DetailedResponseData {
            start: std::time::Instant::now(),
            end: None,
            status: Some(200),
            headers: None,
            response: None,
        };

        let error = extract_result::<u64>(request, response).unwrap_err();

        assert!(matches!(error, WaxChainError::ApiResponse { .. }));
    }

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

        let caller = ApiCaller::new(
            "rest".into(),
            endpoint,
            0,
            Some("test-wax-client-v1.0".into()),
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

        let caller = ApiCaller::new("rest".into(), endpoint, 0, None);

        let _: Value = caller
            .call(&DESC, json!({ "id": 7, "name": "widget" }))
            .await
            .unwrap();

        let raw = captured.recv().unwrap();

        assert!(raw.starts_with("POST /items/7 HTTP/1.1"));
        assert!(raw.ends_with(r#"{"name":"widget"}"#));
    }

    fn caller_with_default(endpoint: &str) -> ApiCaller {
        ApiCaller::new("rest".into(), endpoint.into(), 0, None)
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
