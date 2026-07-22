//! Timed HTTP request helper backing the health checker and the online API
//! callers.

use std::time::{Duration, Instant};

use reqwest::header::CONTENT_TYPE;
use reqwest::{Client, Method, RequestBuilder, Response};
use serde_json::Value;

use crate::chain::healthchecker::RequestError;
use crate::chain::interceptor::{
    ApiCallerKind, InterceptorRequestOptions, RequestInterceptor,
    ResponseInterceptor,
};

/// Represents the timing, status, headers and decoded body captured for a
/// request.
#[derive(Debug, Clone)]
pub struct DetailedResponseData {
    pub start: Instant,
    pub end: Option<Instant>,
    pub status: Option<u16>,
    pub headers: Option<reqwest::header::HeaderMap>,
    pub response: Option<Value>,
}

impl DetailedResponseData {
    /// Creates the running data with `start` stamped and everything else unset.
    fn started() -> Self {
        Self {
            start: Instant::now(),
            end: None,
            status: None,
            headers: None,
            response: None,
        }
    }
}

/// Represents the options describing a single request.
#[derive(Debug, Clone)]
pub struct RequestOptions {
    pub endpoint: String,
    pub url: String,
    pub method: String,
    /// Request timeout in milliseconds; `0` disables it.
    pub timeout: u64,
    pub data: Option<RequestData>,
    pub response_type: Option<ResponseType>,
    /// `X-Wax-Api-Caller` header value for the request.
    pub wax_api_caller: Option<String>,
    /// Additional headers appended after the built-in ones.
    pub extra_headers: Vec<(String, String)>,
}

/// Represents the request body payload.
#[derive(Debug, Clone, PartialEq)]
pub enum RequestData {
    Text(String),
    Json(Value),
}

/// Represents the requested decoding of the response body.
#[derive(Debug, Clone, Copy)]
pub enum ResponseType {
    Text,
    Json,
}

/// Converts a `reqwest` transport error into the matching [`RequestError`],
/// attaching the originating request and the partial response.
fn reqwest_error(
    err: reqwest::Error,
    request: RequestOptions,
    response: DetailedResponseData,
) -> RequestError {
    if err.is_timeout() {
        return RequestError::Timeout { request, response };
    }

    RequestError::Unknown {
        request,
        response,
        source: Some(Box::new(err)),
    }
}

/// Provides timed HTTP requests over a shared, connection-pooled client.
pub struct RequestHelper {
    client: Client,
    /// Which transport this helper serves; reported to interceptors as
    /// [`InterceptorRequestOptions::caller`].
    caller: ApiCallerKind,
    request_interceptor: Option<RequestInterceptor>,
    response_interceptor: Option<ResponseInterceptor>,
}

impl RequestHelper {
    /// Creates a request helper with a default HTTP client and no
    /// interceptors.
    pub fn new(caller: ApiCallerKind) -> Self {
        Self {
            client: Client::new(),
            caller,
            request_interceptor: None,
            response_interceptor: None,
        }
    }

    /// Creates a request helper invoking the given interceptor callbacks
    /// around every request (see [`crate::chain::interceptor`]).
    pub fn with_interceptors(
        caller: ApiCallerKind,
        request_interceptor: Option<RequestInterceptor>,
        response_interceptor: Option<ResponseInterceptor>,
    ) -> Self {
        Self {
            request_interceptor,
            response_interceptor,
            ..Self::new(caller)
        }
    }

    /// Requests the given resource, recording start/end timings, the HTTP
    /// status, the response headers and the decoded body. The interceptor
    /// callbacks (when set) run first on the request options and last on
    /// the finalized success response.
    pub async fn request(
        &self,
        config: RequestOptions,
    ) -> Result<DetailedResponseData, RequestError> {
        let config = self.run_request_interceptor(config)?;

        let mut state = DetailedResponseData::started();

        let method = match Method::from_bytes(config.method.as_bytes()) {
            Ok(v) => v,
            Err(e) => {
                return Err(RequestError::Unknown {
                    request: config,
                    response: state,
                    source: Some(Box::new(e)),
                });
            }
        };

        let builder = self.init_builder(method, &config);

        let response = match builder.send().await {
            Ok(v) => v,
            Err(e) => return Err(reqwest_error(e, config, state)),
        };

        let status = Self::fill_status(&response, &mut state).await;

        // Cloned only when the response interceptor needs the request data.
        let request_copy =
            self.response_interceptor.is_some().then(|| config.clone());
        let state =
            Self::finalize_response(response, status, config, state).await?;

        match request_copy {
            Some(request) => self.run_response_interceptor(state, request),
            None => Ok(state),
        }
    }

    /// Runs the request interceptor (when set) on the incoming options; an
    /// `Err` fails the request before anything is sent, carrying the
    /// untouched request and blank running data.
    fn run_request_interceptor(
        &self,
        config: RequestOptions,
    ) -> Result<RequestOptions, RequestError> {
        let Some(callback) = &self.request_interceptor else {
            return Ok(config);
        };

        let original = config.clone();
        let data = InterceptorRequestOptions {
            options: config,
            caller: self.caller,
        };

        callback(data).map_err(|source| RequestError::Interceptor {
            request: original,
            response: DetailedResponseData::started(),
            source,
        })
    }

    /// Runs the response interceptor (when set) on the finalized success
    /// response; an `Err` discards the response, which is attached in full
    /// to the error.
    fn run_response_interceptor(
        &self,
        state: DetailedResponseData,
        request: RequestOptions,
    ) -> Result<DetailedResponseData, RequestError> {
        let Some(callback) = &self.response_interceptor else {
            return Ok(state);
        };

        let request_data = InterceptorRequestOptions {
            options: request,
            caller: self.caller,
        };

        callback(state.clone(), &request_data).map_err(|source| {
            RequestError::Interceptor {
                request: request_data.options,
                response: state,
                source,
            }
        })
    }

    fn init_builder(
        &self,
        method: Method,
        config: &RequestOptions,
    ) -> RequestBuilder {
        let final_url = format!("{}{}", config.endpoint, config.url);
        let mut builder = self.client.request(method, &final_url);

        if config.timeout != 0 {
            builder = builder.timeout(Duration::from_millis(config.timeout));
        }

        if let Some(caller) = &config.wax_api_caller {
            builder = builder.header("x-wax-api-caller", caller);
        }

        if let Some(data) = &config.data {
            builder = builder.header(CONTENT_TYPE, "application/json").body(
                match data {
                    RequestData::Text(text) => text.clone(),
                    RequestData::Json(value) => value.to_string(),
                },
            );
        }

        for (name, value) in &config.extra_headers {
            builder = builder.header(name, value);
        }

        builder
    }

    async fn fill_status(
        response: &Response,
        state: &mut DetailedResponseData,
    ) -> u16 {
        let status = response.status().as_u16();

        state.status = Some(status);
        state.headers = Some(response.headers().clone());

        status
    }

    async fn finalize_response(
        response: Response,
        status: u16,
        config: RequestOptions,
        mut state: DetailedResponseData,
    ) -> Result<DetailedResponseData, RequestError> {
        let text = match response.text().await {
            Ok(v) => v,
            Err(e) => return Err(reqwest_error(e, config, state)),
        };
        state.response = Some(Value::String(text.clone()));

        // 204 No Content responses have no body.
        if !text.is_empty() && status != 204 {
            match serde_json::from_str::<Value>(&text) {
                Ok(value) => state.response = Some(value),
                Err(_) => {
                    return Err(RequestError::MalformedJson {
                        request: config,
                        response: state,
                    });
                }
            }
        }

        state.end = Some(Instant::now());

        if !(200..=399).contains(&status) {
            return Err(RequestError::NonSuccessResponseCode {
                request: config,
                response: state,
            });
        }

        Ok(state)
    }
}

#[cfg(test)]
mod tests {

    use std::sync::{Arc, Mutex};

    use super::super::test_support::{header_value, spawn_capture_server};
    use super::*;
    use crate::capture;

    /// `waxApiCaller` fixture pinned by the TS suite.
    const WAX_API_CALLER: &str = "test-wax-client-v1.0";

    /// A bodiless GET against `endpoint`; the base request of the
    /// interceptor tests.
    fn get_options(endpoint: String) -> RequestOptions {
        RequestOptions {
            endpoint,
            url: "/".into(),
            method: "GET".into(),
            timeout: 0,
            data: None,
            response_type: None,
            wax_api_caller: None,
            extra_headers: Vec::new(),
        }
    }

    // TS line 10: 'Should set x-wax-api-caller header in REST API requests
    // when configured'. The REST caller issues a bodiless GET with the query
    // already encoded in the URL.
    //
    // NOTE: together with the standard-API twin below, this also guards the
    // no-behavior-change claim for unset interceptors — both helpers run
    // with `None` callbacks.
    #[tokio::test]
    async fn sets_wax_api_caller_header_on_rest_api_requests() {
        let (endpoint, captured) = spawn_capture_server(r#"[{"block_num":1}]"#);

        RequestHelper::new(ApiCallerKind::Rest)
            .request(RequestOptions {
                endpoint,
                url: "/hafbe-api/operation-type-counts?result-limit=1".into(),
                method: "GET".into(),
                timeout: 0,
                data: None,
                response_type: None,
                wax_api_caller: Some(WAX_API_CALLER.into()),
                extra_headers: Vec::new(),
            })
            .await
            .unwrap();

        let raw = captured.recv().unwrap();

        assert_eq!(
            header_value(&raw, "x-wax-api-caller").as_deref(),
            Some(WAX_API_CALLER)
        );
    }

    // TS line 45: 'Should set x-wax-api-caller header in standard API
    // requests when configured'. The JSON-RPC caller posts to the endpoint
    // root (`url: ""` after the TS request rewrite in `chain_api.ts`).
    #[tokio::test]
    async fn sets_wax_api_caller_header_on_standard_api_requests() {
        let (endpoint, captured) =
            spawn_capture_server(r#"{"jsonrpc":"2.0","result":{},"id":1}"#);

        let data = serde_json::json!({
            "jsonrpc": "2.0",
            "method": "database_api.get_dynamic_global_properties",
            "params": {},
            "id": 1
        });

        RequestHelper::new(ApiCallerKind::JsonRpc)
            .request(RequestOptions {
                endpoint,
                url: String::new(),
                method: "POST".into(),
                timeout: 0,
                data: Some(RequestData::Json(data)),
                response_type: None,
                wax_api_caller: Some(WAX_API_CALLER.into()),
                extra_headers: Vec::new(),
            })
            .await
            .unwrap();

        let raw = captured.recv().unwrap();

        assert_eq!(
            header_value(&raw, "x-wax-api-caller").as_deref(),
            Some(WAX_API_CALLER)
        );
    }

    // The auth-header use case: an `extra_headers` entry pushed by the
    // request interceptor must reach the wire, after the built-in headers.
    #[tokio::test]
    async fn request_interceptor_injects_extra_header() {
        let (endpoint, captured) = spawn_capture_server(r#"{"ok":true}"#);

        let helper = RequestHelper::with_interceptors(
            ApiCallerKind::Rest,
            Some(Arc::new(|mut data: InterceptorRequestOptions| {
                data.options
                    .extra_headers
                    .push(("authorization".into(), "Bearer s3cr3t".into()));

                Ok(data.options)
            })),
            None,
        );

        helper.request(get_options(endpoint)).await.unwrap();

        let raw = captured.recv().unwrap();

        assert_eq!(
            header_value(&raw, "authorization").as_deref(),
            Some("Bearer s3cr3t")
        );
    }

    #[tokio::test]
    async fn failing_request_interceptor_prevents_the_send() {
        let (endpoint, captured) = spawn_capture_server(r#"{"ok":true}"#);

        let helper = RequestHelper::with_interceptors(
            ApiCallerKind::Rest,
            Some(Arc::new(|_| Err("token expired".into()))),
            None,
        );

        let error = helper.request(get_options(endpoint)).await.unwrap_err();

        match error {
            RequestError::Interceptor {
                request, response, ..
            } => {
                // The untouched request and blank running data.
                assert_eq!(request.method, "GET");
                assert_eq!(response.status, None);
            }
            other => panic!("expected Interceptor error, got: {other}"),
        }
        // The request never hit the server.
        assert!(
            captured
                .recv_timeout(std::time::Duration::from_millis(200))
                .is_err()
        );
    }

    // Decoded-response transformation: the value the response interceptor
    // returns is what the caller sees, with timings already stamped.
    #[tokio::test]
    async fn response_interceptor_transforms_the_decoded_body() {
        let (endpoint, _captured) = spawn_capture_server(r#"{"ok":true}"#);

        let helper = RequestHelper::with_interceptors(
            ApiCallerKind::Rest,
            None,
            Some(Arc::new(
                |mut data: DetailedResponseData,
                 _: &InterceptorRequestOptions| {
                    assert!(data.end.is_some(), "timings not yet stamped");
                    data.response =
                        Some(serde_json::json!({ "scrubbed": true }));

                    Ok(data)
                },
            )),
        );

        let response = helper.request(get_options(endpoint)).await.unwrap();

        assert_eq!(
            response.response,
            Some(serde_json::json!({ "scrubbed": true }))
        );
    }

    #[tokio::test]
    async fn failing_response_interceptor_discards_the_response() {
        let (endpoint, _captured) = spawn_capture_server(r#"{"ok":true}"#);

        let helper = RequestHelper::with_interceptors(
            ApiCallerKind::Rest,
            None,
            Some(Arc::new(|_, _: &InterceptorRequestOptions| {
                Err("scrub failed".into())
            })),
        );

        let error = helper.request(get_options(endpoint)).await.unwrap_err();

        match error {
            RequestError::Interceptor { response, .. } => {
                assert_eq!(response.status, Some(200));
                assert!(response.end.is_some());
            }
            other => panic!("expected Interceptor error, got: {other}"),
        }
    }

    // Originator parity: `InterceptorRequestOptions::caller` must report
    // the kind the helper was constructed with (TS `apiCallerId`). The
    // capture pattern is written with `capture!`, doubling as the macro's
    // integration test.
    #[tokio::test]
    async fn interceptor_reports_the_originating_caller_kind() {
        let seen = Arc::new(Mutex::new(Vec::new()));

        for kind in [ApiCallerKind::JsonRpc, ApiCallerKind::Rest] {
            let (endpoint, _captured) = spawn_capture_server(r#"{"ok":true}"#);
            let helper = RequestHelper::with_interceptors(
                kind,
                Some(Arc::new(capture!(
                    [seen] | data | {
                        seen.lock().unwrap().push(data.caller);

                        Ok(data.options)
                    }
                ))),
                None,
            );

            helper.request(get_options(endpoint)).await.unwrap();
        }

        assert_eq!(
            *seen.lock().unwrap(),
            vec![ApiCallerKind::JsonRpc, ApiCallerKind::Rest]
        );
    }
}
