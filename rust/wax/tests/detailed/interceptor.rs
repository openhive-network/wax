//! Integration coverage for the interceptor callbacks installed through
//! [`HiveChainOptions`]: a chain built with both callbacks set must run them
//! on JSON-RPC and REST calls alike — header asserted off the wire, caller
//! kind recorded.
//!
//! TS NOTE: mirrors `ts/wasm/__tests__/detailed/wax_api_caller_header.ts`
//! for the new seam — that suite observes chain requests through the
//! `withProxy` interceptor pair; here the pair is installed at chain
//! construction and additionally injects a header TS interceptors cannot
//! (`extra_headers` is a deliberate Rust extension).

use std::io::{Read, Write};
use std::net::TcpListener;
use std::sync::mpsc;
use std::sync::{Arc, Mutex};
use std::thread;

use serde::{Deserialize, Serialize};

use wax::interceptor::ApiCallerKind;
use wax::{HiveChainOptions, capture, create_hive_chain, hive_api};

/// Serves a single request with a canned 200 JSON body, returning the
/// server URL and a receiver yielding the raw captured request (the
/// integration-test twin of `src/chain/transport/test_support.rs`).
fn spawn_capture_server(
    body: &'static str,
) -> (String, mpsc::Receiver<String>) {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let url = format!("http://{}", listener.local_addr().unwrap());
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let (mut stream, _) = listener.accept().unwrap();
        let mut raw = Vec::new();
        let mut buf = [0u8; 4096];

        let head_end = loop {
            let n = stream.read(&mut buf).unwrap();
            raw.extend_from_slice(&buf[..n]);

            if let Some(pos) = raw.windows(4).position(|w| w == b"\r\n\r\n") {
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
    raw.lines()
        .take_while(|line| !line.is_empty())
        .find_map(|line| {
            let (key, value) = line.split_once(':')?;

            key.eq_ignore_ascii_case(name)
                .then(|| value.trim().to_string())
        })
}

#[derive(Serialize)]
pub struct PingRequest {
    pub token: u32,
}

#[derive(Deserialize)]
pub struct PingResponse {}

/// Minimal JSON-RPC surface driving the standard-API call.
#[hive_api]
pub trait CustomApi {
    /// Sends a ping.
    async fn ping(params: PingRequest) -> PingResponse;
}

/// Minimal REST surface driving the REST call.
#[hive_api(rest)]
pub trait HeadblockApi {
    /// Returns the head block.
    #[get("/headblock")]
    async fn headblock() -> serde_json::Value;
}

#[tokio::test]
async fn chain_interceptors_run_on_json_rpc_and_rest_calls() {
    let (api_endpoint, rpc_captured) =
        spawn_capture_server(r#"{"jsonrpc":"2.0","id":1,"result":{}}"#);
    let (rest_api_endpoint, rest_captured) =
        spawn_capture_server(r#"{"ok":true}"#);

    let kinds = Arc::new(Mutex::new(Vec::new()));
    let statuses = Arc::new(Mutex::new(Vec::new()));

    let chain = create_hive_chain(
        HiveChainOptions {
            api_endpoint,
            rest_api_endpoint,
            ..Default::default()
        }
        .with_request_interceptor(capture!([kinds] |mut data| {
            kinds.lock().unwrap().push(data.caller);
            data.options
                .extra_headers
                .push(("authorization".into(), "Bearer s3cr3t".into()));

            Ok(data.options)
        }))
        .with_response_interceptor(capture!(
            [statuses] | data,
            request | {
                statuses.lock().unwrap().push((request.caller, data.status));

                Ok(data)
            }
        )),
    )
    .unwrap();

    chain
        .extend::<CustomApi>()
        .ping(PingRequest { token: 1 })
        .await
        .unwrap();
    chain
        .extend_rest::<HeadblockApi>()
        .headblock()
        .await
        .unwrap();

    // The injected header reached both wires...
    for captured in [rpc_captured, rest_captured] {
        let raw = captured.recv().unwrap();

        assert_eq!(
            header_value(&raw, "authorization").as_deref(),
            Some("Bearer s3cr3t")
        );
    }

    // ...and both callbacks saw both transports, correctly attributed.
    assert_eq!(
        *kinds.lock().unwrap(),
        vec![ApiCallerKind::JsonRpc, ApiCallerKind::Rest]
    );
    assert_eq!(
        *statuses.lock().unwrap(),
        vec![
            (ApiCallerKind::JsonRpc, Some(200)),
            (ApiCallerKind::Rest, Some(200)),
        ]
    );
}
