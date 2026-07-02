//! Timed HTTP request helper backing the health checker and the online API
//! callers.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/util/request_helper.ts`. The TS
//! version wraps the global `fetch` and an `AbortController` for timeouts; the
//! Rust version wraps a pooled `reqwest::Client` and uses `reqwest`'s per-request
//! timeout instead. The TS `request<T>` is generic over the parsed body type;
//! since the only in-tree consumer (the health checker) treats the body as
//! `any`, the Rust port decodes into a dynamic [`serde_json::Value`] and drops
//! the generic.

// The request layer is fully ported, but its only consumer (the health-checker
// probe loop) is not yet in place, so most items are currently unused.
#![allow(dead_code)]

use std::time::{Duration, Instant};

use reqwest::header::CONTENT_TYPE;
use reqwest::{Client, Method, RequestBuilder, Response};
use serde_json::Value;

use crate::chain::healthchecker::RequestError;

/// Represents the timing, status, headers and decoded body captured for a
/// request.
///
/// TS NOTE: `IDetailedResponseData<T>`. TS also uses this shape as the
/// `Partial<>` "running data" that is filled in as the request progresses and
/// attached to errors; the Rust port keeps that single-type approach by making
/// every field that is only known after completion an [`Option`]. On the success
/// path returned by [`RequestHelper::request`] all of them are populated.
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
///
/// TS NOTE: `IRequestOptions`.
#[derive(Debug, Clone)]
pub struct RequestOptions {
    pub endpoint: String,
    pub url: String,
    pub method: String,
    /// Request timeout in milliseconds; `0` disables it.
    pub timeout: u64,
    pub data: Option<RequestData>,
    /// TS NOTE: declared as `responseType` in TS but ignored by the request
    /// logic there (the body is always JSON-decoded); kept for parity and left
    /// unused here as well.
    pub response_type: Option<ResponseType>,
    /// `X-Wax-Api-Caller` header value for the request.
    pub wax_api_caller: Option<String>,
}

/// Represents the request body payload.
///
/// TS NOTE: `data?: string | object`.
#[derive(Debug, Clone)]
pub enum RequestData {
    Text(String),
    Json(Value),
}

/// Represents the requested decoding of the response body.
///
/// TS NOTE: `responseType?: "text" | "json"`.
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
///
/// TS NOTE: the TS `RequestHelper` is stateless and calls the global `fetch`;
/// the Rust port owns a [`reqwest::Client`] so connections are reused.
pub struct RequestHelper {
    client: Client,
}

impl RequestHelper {
    /// Creates a request helper with a default HTTP client.
    pub fn new() -> Self {
        Self {
            client: Client::new(),
        }
    }

    /// Requests the given resource, recording start/end timings, the HTTP
    /// status, the response headers and the decoded body.
    pub async fn request(
        &self,
        config: RequestOptions,
    ) -> Result<DetailedResponseData, RequestError> {
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

        let builder = self.init_bulider(method, &config);

        let response = match builder.send().await {
            Ok(v) => v,
            Err(e) => return Err(reqwest_error(e, config, state)),
        };

        let status = Self::fill_status(&response, &mut state).await;

        Self::finalize_response(response, status, config, state).await
    }

    fn init_bulider(
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

impl Default for RequestHelper {
    fn default() -> Self {
        Self::new()
    }
}
