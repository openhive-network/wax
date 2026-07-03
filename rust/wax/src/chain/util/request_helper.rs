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

#[cfg(test)]
mod tests {
    //! TS NOTE: mirrors `ts/wasm/__tests__/detailed/wax_api_caller_header.ts`.
    //! The TS tests intercept the chain's request data via `withProxy` and
    //! assert the `waxApiCaller` option is propagated down to the request
    //! layer. The Rust port has no `ApiCaller` layer yet, so `RequestOptions`
    //! is built directly in the test and asserting `wax_api_caller` on it
    //! would be vacuous; the observable equivalent at this layer is the
    //! `x-wax-api-caller` header that `init_bulider` emits from that option
    //! (the TS counterpart is `request_helper.ts` lines 58-59), captured here
    //! off the wire by a local server.

    use std::io::{Read, Write};
    use std::net::TcpListener;
    use std::sync::mpsc;
    use std::thread;

    use super::*;

    /// `waxApiCaller` fixture pinned by the TS suite.
    const WAX_API_CALLER: &str = "test-wax-client-v1.0";

    /// Serves a single request with a canned 200 JSON body, returning the
    /// server URL and a receiver yielding the raw captured request.
    fn spawn_capture_server(
        body: &'static str,
    ) -> (String, mpsc::Receiver<String>) {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let url = format!("http://{}", listener.local_addr().unwrap());
        let (tx, rx) = mpsc::channel();

        thread::spawn(move || {
            let (mut stream, _) = listener.accept().unwrap();
            let mut raw = Vec::new();
            let mut buf = [0u8; 1024];

            let head_end = loop {
                let n = stream.read(&mut buf).unwrap();
                raw.extend_from_slice(&buf[..n]);

                if let Some(pos) = raw.windows(4).position(|w| w == b"\r\n\r\n")
                {
                    break pos + 4;
                }
            };

            let head = String::from_utf8_lossy(&raw[..head_end]).to_lowercase();
            let content_length = head
                .lines()
                .find_map(|line| line.strip_prefix("content-length:"))
                .map_or(0, |value| value.trim().parse::<usize>().unwrap());

            while raw.len() < head_end + content_length {
                let n = stream.read(&mut buf).unwrap();
                raw.extend_from_slice(&buf[..n]);
            }

            let response = format!(
                "HTTP/1.1 200 OK\r\ncontent-type: application/json\r\n\
                 content-length: {}\r\nconnection: close\r\n\r\n{body}",
                body.len(),
            );
            stream.write_all(response.as_bytes()).unwrap();

            tx.send(String::from_utf8_lossy(&raw).into_owned()).unwrap();
        });

        (url, rx)
    }

    /// Extracts a header value from the captured raw request; header names
    /// are case-insensitive per HTTP.
    fn header_value(raw: &str, name: &str) -> Option<String> {
        raw.lines().take_while(|line| !line.is_empty()).find_map(
            |line| {
                let (key, value) = line.split_once(':')?;

                key.eq_ignore_ascii_case(name)
                    .then(|| value.trim().to_string())
            },
        )
    }

    // TS line 10: 'Should set x-wax-api-caller header in REST API requests
    // when configured'. The REST caller issues a bodiless GET with the query
    // already encoded in the URL.
    #[tokio::test]
    async fn sets_wax_api_caller_header_on_rest_api_requests() {
        let (endpoint, captured) =
            spawn_capture_server(r#"[{"block_num":1}]"#);

        RequestHelper::new()
            .request(RequestOptions {
                endpoint,
                url: "/hafbe-api/operation-type-counts?result-limit=1".into(),
                method: "GET".into(),
                timeout: 0,
                data: None,
                response_type: None,
                wax_api_caller: Some(WAX_API_CALLER.into()),
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

        RequestHelper::new()
            .request(RequestOptions {
                endpoint,
                url: String::new(),
                method: "POST".into(),
                timeout: 0,
                data: Some(RequestData::Json(data)),
                response_type: None,
                wax_api_caller: Some(WAX_API_CALLER.into()),
            })
            .await
            .unwrap();

        let raw = captured.recv().unwrap();

        assert_eq!(
            header_value(&raw, "x-wax-api-caller").as_deref(),
            Some(WAX_API_CALLER)
        );
    }
}
