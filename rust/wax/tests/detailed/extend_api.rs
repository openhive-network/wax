// Exercises the `extend` / `extend_rest` surface from an external crate — the
// same view user code gets (`#[hive_api]` emits `::wax::` paths, which
// resolve differently here than in the in-crate unit tests). The chain points
// at an unroutable endpoint: each call must reach the transport and fail
// there, proving the whole binding chain without a live node (the wire
// behavior is covered by the in-crate unit tests against a capture server).
//
// The second half ports the response-shape and routing tests of
// `ts/wasm/__tests__/detailed/hive_chain_rest_api.ts` against a local REST
// mock. TS-only members of that suite: the interface-only extension variant
// (TS line 152) is the same surface in Rust (`#[hive_api]` traits ARE the
// interface form; line 123's type-preservation aspect likewise — its
// runtime half is ported below), and the callable top-level `restApi` proxy
// (line 260) has no Rust counterpart. Per-namespace endpoint overrides (TS
// line 285) are covered by the in-crate
// `generated_set_endpoint_url_overrides_namespace_endpoint` test; the
// chain-level setter (line 248) is ported below.

use serde::{Deserialize, Serialize};

use wax::{
    HiveChain, HiveChainOptions, WaxChainError, create_hive_chain, hive_api,
};

#[derive(Serialize)]
pub struct PingRequest {
    pub token: u32,
}

#[derive(Deserialize)]
pub struct PingResponse {}

/// Custom namespace surface as a user crate would declare it.
#[hive_api]
pub trait CustomApi {
    /// Sends a ping.
    async fn ping(params: PingRequest) -> PingResponse;
}

/// Custom REST surface as a user crate would declare it.
#[hive_api(rest)]
pub trait HafahApi {
    /// Returns the head block.
    #[get("/hafah-api/headblock")]
    async fn headblock() -> serde_json::Value;
}

/// Custom surface composed on top of the default one.
#[hive_api]
pub struct ExtendedApi {
    pub custom_api: CustomApi,
    #[hive_api(base)]
    base: wax::DefaultHiveApi,
}

fn unroutable_chain() -> HiveChain {
    create_hive_chain(HiveChainOptions {
        api_endpoint: "http://127.0.0.1:1".into(),
        rest_api_endpoint: "http://127.0.0.1:1".into(),
        ..Default::default()
    })
    .unwrap()
}

#[tokio::test]
async fn extend_binds_custom_api_to_the_chain_transport() {
    let chain = unroutable_chain();
    let api = chain.extend::<CustomApi>();

    let result = api.ping(PingRequest { token: 1 }).await;

    assert!(matches!(result, Err(WaxChainError::Request(_))));
}

#[tokio::test]
async fn composed_api_reaches_default_namespaces_through_deref() {
    let chain = unroutable_chain();
    let api = chain.extend::<ExtendedApi>();

    // Own namespace...
    assert!(api.custom_api.ping(PingRequest { token: 1 }).await.is_err());
    // ...and a `DefaultHiveApi` namespace through `Deref`.
    assert!(
        api.database_api
            .get_dynamic_global_properties(Default::default())
            .await
            .is_err()
    );
}

#[tokio::test]
async fn chain_api_exposes_default_namespaces() {
    let chain = unroutable_chain();

    let result = chain
        .api()
        .block_api
        .get_block(wax::api::GetBlockRequest { block_num: 1 })
        .await;

    assert!(result.is_err());
}

#[tokio::test]
async fn extend_rest_binds_generated_rest_surface() {
    let chain = unroutable_chain();
    let rest = chain.extend_rest::<HafahApi>();

    let result = rest.headblock().await;

    assert!(matches!(result, Err(WaxChainError::Request(_))));
}

// ---------------------------------------------------------------------------
// hive_chain_rest_api.ts ports
// ---------------------------------------------------------------------------

use std::io::{Read, Write};
use std::net::TcpListener;
use std::sync::mpsc;
use std::thread;

/// Serves `count` REST requests: responds to any `GET` with `body`,
/// capturing the request line of each.
fn spawn_rest_server(
    body: &'static str,
    count: usize,
) -> (String, mpsc::Receiver<String>) {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let url = format!("http://{}", listener.local_addr().unwrap());
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        for _ in 0..count {
            let (mut stream, _) = listener.accept().unwrap();
            let mut buf = [0u8; 4096];
            let mut raw = Vec::new();
            loop {
                let n = stream.read(&mut buf).unwrap();
                raw.extend_from_slice(&buf[..n]);

                if raw.windows(4).any(|w| w == b"\r\n\r\n") {
                    break;
                }
            }

            let response = format!(
                "HTTP/1.1 200 OK\r\ncontent-type: application/json\r\n\
                 content-length: {}\r\nconnection: close\r\n\r\n{body}",
                body.len(),
            );
            stream.write_all(response.as_bytes()).unwrap();

            let request_line = String::from_utf8_lossy(&raw)
                .lines()
                .next()
                .unwrap_or_default()
                .to_string();
            tx.send(request_line).unwrap();
        }
    });

    (url, rx)
}

#[derive(Serialize)]
pub struct BlockNumSearchParams {
    #[serde(rename = "result-limit")]
    pub result_limit: u32,
}

#[derive(Debug, Deserialize, PartialEq)]
pub struct OperationTypeCount {
    pub block_num: u64,
    pub op_count: u64,
}

/// REST surface mirroring the `hafbe-api` extension the TS suite declares.
#[hive_api(rest)]
pub trait HafbeExtension {
    /// Array-of-objects result (TS line 8).
    #[get("/hafbe-api/operation-type-counts")]
    async fn operation_type_counts(
        params: BlockNumSearchParams,
    ) -> Vec<OperationTypeCount>;

    /// Array-of-arrays result (TS line 40).
    #[get("/hafbe-api/pairs")]
    async fn pairs() -> Vec<Vec<u64>>;

    /// Plain integer result (TS line 71).
    #[get("/hafbe-api/last-synced-block")]
    async fn last_synced_block() -> u64;

    /// Trailing-slash path (TS line 216) — the slash must survive into the
    /// request URL.
    #[get("/hivesense-api/")]
    async fn hivesense_root() -> serde_json::Value;
}

fn rest_chain(endpoint: String) -> HiveChain {
    create_hive_chain(HiveChainOptions {
        rest_api_endpoint: endpoint,
        ..Default::default()
    })
    .unwrap()
}

// TS line 8: "Should be able to extend and perform REST API calls".
#[tokio::test]
async fn extend_and_perform_rest_api_calls() {
    let (endpoint, captured) =
        spawn_rest_server(r#"[{"block_num":5,"op_count":10}]"#, 1);
    let rest = rest_chain(endpoint).extend_rest::<HafbeExtension>();

    let result = rest
        .operation_type_counts(BlockNumSearchParams { result_limit: 1 })
        .await
        .expect("operation_type_counts");

    assert_eq!(
        result,
        [OperationTypeCount {
            block_num: 5,
            op_count: 10
        }]
    );
    assert!(
        captured
            .recv()
            .unwrap()
            .starts_with("GET /hafbe-api/operation-type-counts?result-limit=1")
    );
}

// TS line 40: "Should be able to extend and perform REST API calls returning
// array of array".
#[tokio::test]
async fn rest_api_call_returning_array_of_arrays() {
    let (endpoint, _captured) = spawn_rest_server(r#"[[1,2],[3,4]]"#, 1);
    let rest = rest_chain(endpoint).extend_rest::<HafbeExtension>();

    let result = rest.pairs().await.expect("pairs");

    assert_eq!(result, [vec![1, 2], vec![3, 4]]);
}

// TS line 71: "Should be able to extend and perform REST API calls returning
// INT".
#[tokio::test]
async fn rest_api_call_returning_int() {
    let (endpoint, _captured) = spawn_rest_server("94609576", 1);
    let rest = rest_chain(endpoint).extend_rest::<HafbeExtension>();

    let result = rest.last_synced_block().await.expect("last_synced_block");

    assert_eq!(result, 94609576);
}

// TS line 90: "Should be able to call concurrently same REST API multiple
// times with same URL".
#[tokio::test]
async fn concurrent_rest_calls_to_the_same_url() {
    let (endpoint, captured) = spawn_rest_server("94609576", 3);
    let rest = rest_chain(endpoint).extend_rest::<HafbeExtension>();

    let (first, second, third) = tokio::join!(
        rest.last_synced_block(),
        rest.last_synced_block(),
        rest.last_synced_block(),
    );

    assert_eq!(first.expect("first"), 94609576);
    assert_eq!(second.expect("second"), 94609576);
    assert_eq!(third.expect("third"), 94609576);
    for _ in 0..3 {
        assert!(
            captured
                .recv()
                .unwrap()
                .starts_with("GET /hafbe-api/last-synced-block")
        );
    }
}

// TS line 123: "Should be able to extend REST API, then extend standard API
// and keep all of the types" — both extensions must coexist on one chain.
#[tokio::test]
async fn extend_rest_then_standard_api_coexist() {
    let (endpoint, _captured) = spawn_rest_server("94609576", 1);
    let chain = rest_chain(endpoint);

    let rest = chain.extend_rest::<HafbeExtension>();
    let api = chain.extend::<CustomApi>();

    assert_eq!(rest.last_synced_block().await.expect("rest call"), 94609576);
    // The JSON-RPC side still routes to the (unroutable) default endpoint.
    assert!(api.ping(PingRequest { token: 1 }).await.is_err());
}

// TS line 216: "Should be able to properly override using urlPath for
// trailing slash URL".
//
// TS NOTE: TS overrides the generated path with `urlPath: 'hivesense-api/'`
// and asserts the composed URL keeps the non-standard trailing slash; the
// Rust path comes from the `#[get("/hivesense-api/")]` attribute, and the
// same property holds on the wire.
#[tokio::test]
async fn trailing_slash_url_path_is_preserved() {
    let (endpoint, captured) = spawn_rest_server("true", 1);
    let rest = rest_chain(endpoint).extend_rest::<HafbeExtension>();

    rest.hivesense_root().await.expect("hivesense_root");

    let request_line = captured.recv().unwrap();
    assert!(
        request_line.starts_with("GET /hivesense-api/ HTTP"),
        "trailing slash lost: {request_line}",
    );
}

// TS line 248: "Should be able to set REST API endpoint URL".
#[test]
fn sets_rest_api_endpoint_url() {
    let chain = unroutable_chain();

    chain
        .set_rest_endpoint_url("https://best.honey.provider")
        .expect("set_rest_endpoint_url");

    assert_eq!(chain.rest_endpoint_url(), "https://best.honey.provider");
}
