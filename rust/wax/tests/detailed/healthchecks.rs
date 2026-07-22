// Rust port of `ts/wasm/__tests__/detailed/healthchecks.ts`.
//
// Tests appear in TS source order. Each Rust test has a `// TS line N` comment
// pointing back to the TS original.
//
// TS NOTE: the TS suite probes live nodes (api.hive.blog /
// api.openhive.network) with the default 10 s check interval; the Rust port
// drives the same public `HealthChecker` surface against local mock servers
// with `minimal_check_interval_ms` shrunk to keep multi-round tests fast.
// The "invalid failing endpoint" is an unroutable local port instead of
// `https://1.1.1.1` — same effect (a URL that can never come up) without
// leaving the machine.

use std::io::{Read, Write};
use std::net::TcpListener;
use std::thread;
use std::time::Duration;

use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use tokio::sync::broadcast;
use tokio::time::timeout;

use wax::api::{
    GetBlockHeaderRequest, GetBlockRangeRequest, GetBlockRequest,
    GetBlockResponse,
};
use wax::healthchecker::{
    HealthChecker, HealthCheckerEvent, HealthCheckerOptions,
};
use wax::{HiveChain, hive_api};

use crate::common::{chain_at, spawn_routing_server};

const ZERO_BLOCK_ID: &str = "0000000000000000000000000000000000000000";

/// First mainnet block, `previous` all zeros — the shape every TS validator
/// in this suite checks for.
fn block_one_json() -> Value {
    json!({
        "previous": ZERO_BLOCK_ID,
        "timestamp": "2016-03-24T16:05:00",
        "witness": "initminer",
        "transaction_merkle_root": ZERO_BLOCK_ID,
        "extensions": [],
        "witness_signature": "1f227719b21a238e75c14e88fe442d20a488c1f61e17197a2a3faee7e07db4a3b415d1e224ba641f558a824d1cbcdbe915308c1c88cf35eb32ffdb28f4582d1af0",
        "transactions": [],
        "block_id": "0000000109833ce528d5bbfb3f6225b39ee10086",
        "signing_key": "STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX",
        "transaction_ids": []
    })
}

/// JSON-RPC mock answering every block-api probe of this suite for block 1.
fn spawn_block_server() -> String {
    spawn_routing_server(|method, _params| match method {
        "block_api.get_block" => {
            json!({ "result": { "block": block_one_json() } })
        }
        "block_api.get_block_header" => json!({ "result": { "header": {
            "previous": ZERO_BLOCK_ID,
            "timestamp": "2016-03-24T16:05:00",
            "witness": "initminer",
            "transaction_merkle_root": ZERO_BLOCK_ID,
            "extensions": []
        } } }),
        "block_api.get_block_range" => {
            json!({ "result": { "blocks": [block_one_json()] } })
        }
        other => panic!("unexpected JSON-RPC method: {other}"),
    })
}

/// Minimal REST mock: `GET /hafbe-api/operation-type-counts?...` returns a
/// one-element stats array.
fn spawn_hafbe_rest_server() -> String {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let url = format!("http://{}", listener.local_addr().unwrap());

    thread::spawn(move || {
        while let Ok((mut stream, _)) = listener.accept() {
            let mut buf = [0u8; 4096];
            let mut raw = Vec::new();
            loop {
                let n = stream.read(&mut buf).unwrap();
                raw.extend_from_slice(&buf[..n]);

                if raw.windows(4).any(|w| w == b"\r\n\r\n") {
                    break;
                }
            }

            let request = String::from_utf8_lossy(&raw);
            assert!(
                request.starts_with("GET /hafbe-api/operation-type-counts"),
                "unexpected REST request: {request}",
            );

            let body = r#"[{"block_num":42}]"#;
            let response = format!(
                "HTTP/1.1 200 OK\r\ncontent-type: application/json\r\n\
                 content-length: {}\r\nconnection: close\r\n\r\n{body}",
                body.len(),
            );
            stream.write_all(response.as_bytes()).unwrap();
        }
    });

    url
}

// The REST surface of the TS `chain.extendRest<{"hafbe-api": ...}>()` call.
#[derive(Serialize)]
pub struct OperationTypeCountsParams {
    #[serde(rename = "result-limit")]
    pub result_limit: u32,
}

#[derive(Debug, Deserialize)]
pub struct OperationTypeCount {
    pub block_num: u64,
}

#[hive_api(rest)]
pub trait HafbeApi {
    #[get("/hafbe-api/operation-type-counts")]
    async fn operation_type_counts(
        params: OperationTypeCountsParams,
    ) -> Vec<OperationTypeCount>;
}

fn fast_checker() -> HealthChecker {
    HealthChecker::with_options(HealthCheckerOptions {
        minimal_check_interval_ms: 50,
        ..Default::default()
    })
}

fn fast_checker_with_defaults(endpoints: &[&str]) -> HealthChecker {
    HealthChecker::with_options(HealthCheckerOptions {
        default_endpoints: Some(
            endpoints.iter().map(|url| url.to_string()).collect(),
        ),
        minimal_check_interval_ms: 50,
        ..Default::default()
    })
}

/// Awaits the next event `select` maps to `Some`, failing the test on
/// `Error` events (unless `select` consumed them first) or on a 30 s
/// timeout — the Rust analogue of the TS promise + `hc.on(...)` wiring.
async fn wait_for<T>(
    events: &mut broadcast::Receiver<HealthCheckerEvent>,
    mut select: impl FnMut(HealthCheckerEvent) -> Option<T>,
) -> T {
    timeout(Duration::from_secs(30), async {
        loop {
            let event = events.recv().await.expect("event channel closed");
            if let Some(value) = select(event) {
                return value;
            }
        }
    })
    .await
    .expect("timed out waiting for health checker event")
}

fn block_chain(endpoint: &str) -> HiveChain {
    chain_at(endpoint.to_string())
}

/// The validator every JSON-RPC test uses: block 1 must link to the zero id.
fn first_block_validator(response: &GetBlockResponse) -> Result<(), String> {
    let valid = response
        .block
        .as_ref()
        .is_some_and(|block| block.header.previous == ZERO_BLOCK_ID);

    if valid {
        Ok(())
    } else {
        Err("Malformed first block - may be a fork".into())
    }
}

// TS line 7: "Should be able to create endpoint healthchecker".
#[tokio::test]
async fn creates_endpoint_healthchecker() {
    let endpoint = spawn_block_server();
    let chain = block_chain(&endpoint);

    let checker = fast_checker();
    let mut events = checker.events();
    let _guard = checker.spawn();

    checker.register(
        chain
            .api()
            .block_api
            .get_block_probe(GetBlockRequest { block_num: 1 }),
        vec![endpoint.clone()],
    );

    let best = wait_for(&mut events, |event| match event {
        HealthCheckerEvent::NewBest(scored) => Some(scored.url),
        HealthCheckerEvent::Error(error) => {
            panic!("unexpected health checker error: {error}")
        }
        _ => None,
    })
    .await;
    checker.unregister_all();

    assert_eq!(best, endpoint);
}

// TS line 25: "Should be able to validate response and result with proper
// info".
//
// TS NOTE: the TS validator returns a string on both branches (returning a
// string means rejection), so the check always fails — with the marker
// message exactly when the block data is correct.
#[tokio::test]
async fn validates_response_with_proper_info() {
    let endpoint = spawn_block_server();
    let chain = block_chain(&endpoint);

    let checker = fast_checker();
    let mut events = checker.events();
    let _guard = checker.spawn();

    checker.register_with_validator(
        chain
            .api()
            .block_api
            .get_block_probe(GetBlockRequest { block_num: 1 }),
        |response: &GetBlockResponse| {
            let correct = response
                .block
                .as_ref()
                .is_some_and(|block| block.header.previous == ZERO_BLOCK_ID);

            if correct {
                Err("This message should be thrown".into())
            } else {
                Err("Malformed first block - may be a fork".into())
            }
        },
        vec![endpoint.clone()],
    );

    let failed_reason = wait_for(&mut events, |event| match event {
        HealthCheckerEvent::ValidationError(error) => {
            Some(error.failed_reason.clone())
        }
        // The wrapping `Error` following a `ValidationError` is never
        // reached — the selector returns on the `ValidationError` first —
        // so this arm only fires for transport failures, like the TS
        // `hc.on("error", reject)` wiring.
        HealthCheckerEvent::Error(error) => {
            panic!("unexpected health checker error: {error}")
        }
        _ => None,
    })
    .await;
    checker.unregister_all();

    assert_eq!(failed_reason, "This message should be thrown");
}

// TS line 42: "Should be able to create endpoint healthchecker and retrieve
// data 2 times".
#[tokio::test]
async fn retrieves_data_two_times() {
    let endpoint = spawn_block_server();
    let chain = block_chain(&endpoint);

    let checker = fast_checker();
    let mut events = checker.events();
    let _guard = checker.spawn();

    checker.register_with_validator(
        chain
            .api()
            .block_api
            .get_block_probe(GetBlockRequest { block_num: 1 }),
        first_block_validator,
        vec![endpoint.clone()],
    );

    let mut rounds = 0;
    let first_url = wait_for(&mut events, |event| match event {
        HealthCheckerEvent::Data(scored) => {
            rounds += 1;
            (rounds == 2).then(|| scored[0].url.clone())
        }
        HealthCheckerEvent::Error(error) => {
            panic!("unexpected health checker error: {error}")
        }
        _ => None,
    })
    .await;
    checker.unregister_all();

    assert_eq!(first_url, endpoint);
}

// TS line 68: "Should be able to create endpoint healthchecker and retrieve
// data 2 times while having invalid failing endpoint".
#[tokio::test]
async fn retrieves_data_with_invalid_failing_endpoint() {
    let good_one = spawn_block_server();
    let good_two = spawn_block_server();
    // Unroutable local port instead of the TS `https://1.1.1.1`.
    let broken = "http://127.0.0.1:1".to_string();
    let endpoints = vec![good_one.clone(), broken.clone(), good_two.clone()];

    let chain = block_chain(&good_one);
    let checker = fast_checker();
    let mut events = checker.events();
    let _guard = checker.spawn();

    checker.register_with_validator(
        chain
            .api()
            .block_api
            .get_block_probe(GetBlockRequest { block_num: 1 }),
        first_block_validator,
        endpoints,
    );

    let mut rounds = 0;
    let success = wait_for(&mut events, |event| match event {
        HealthCheckerEvent::Data(scored) => {
            rounds += 1;

            // The scoreboard must list every endpoint, the broken one last.
            assert_eq!(scored.len(), 3, "unexpected scoreboard: {scored:?}");
            assert_ne!(
                scored[2].url, good_one,
                "healthy endpoint sorted last: {scored:?}",
            );

            (rounds == 2)
                .then(|| scored[0].url == good_one || scored[0].url == good_two)
        }
        // The broken endpoint reports per-round errors, like in TS where
        // they are only logged.
        _ => None,
    })
    .await;
    checker.unregister_all();

    assert!(success);
}

// TS line 108: "Should be able to create REST call healthchecker (common
// enpdoint)".
#[tokio::test]
async fn rest_call_healthchecker_common_endpoint() {
    let endpoint = spawn_hafbe_rest_server();
    let chain = block_chain(&endpoint);
    let api = chain.extend_rest::<HafbeApi>();

    // TS passes the endpoint via the constructor and registers without an
    // explicit list.
    let checker = fast_checker_with_defaults(&[&endpoint]);
    let mut events = checker.events();
    let _guard = checker.spawn();

    checker.register_with_validator(
        api.operation_type_counts_probe(OperationTypeCountsParams {
            result_limit: 1,
        }),
        |counts: &Vec<OperationTypeCount>| {
            if counts[0].block_num > 1 {
                Ok(())
            } else {
                Err("Should not be a new chain".into())
            }
        },
        Vec::new(),
    );

    let best = wait_for(&mut events, |event| match event {
        HealthCheckerEvent::NewBest(scored) => Some(scored.url),
        HealthCheckerEvent::Error(error) => {
            panic!("unexpected health checker error: {error}")
        }
        _ => None,
    })
    .await;
    checker.unregister_all();

    assert_eq!(best, endpoint);
}

// TS line 142: "Should be able to create REST endpoint healthchecker
// (explicit endpoint)".
#[tokio::test]
async fn rest_endpoint_healthchecker_explicit_endpoint() {
    let endpoint = spawn_hafbe_rest_server();
    let chain = block_chain(&endpoint);
    let api = chain.extend_rest::<HafbeApi>();

    let checker = fast_checker();
    let mut events = checker.events();
    let _guard = checker.spawn();

    checker.register_with_validator(
        api.operation_type_counts_probe(OperationTypeCountsParams {
            result_limit: 1,
        }),
        |counts: &Vec<OperationTypeCount>| {
            if counts[0].block_num > 1 {
                Ok(())
            } else {
                Err("Should not be a new chain".into())
            }
        },
        vec![endpoint.clone()],
    );

    let best = wait_for(&mut events, |event| match event {
        HealthCheckerEvent::NewBest(scored) => Some(scored.url),
        HealthCheckerEvent::Error(error) => {
            panic!("unexpected health checker error: {error}")
        }
        _ => None,
    })
    .await;
    checker.unregister_all();

    assert_eq!(best, endpoint);
}

// TS line 176: "Should be able to handle multithreaded calls - should not
// exceed the timeout".
#[tokio::test]
async fn handles_multithreaded_calls() {
    let endpoint = spawn_block_server();
    let chain = block_chain(&endpoint);

    let checker = fast_checker_with_defaults(&[&endpoint]);
    let mut events = checker.events();
    let _guard = checker.spawn();

    checker.register_with_validator(
        chain
            .api()
            .block_api
            .get_block_probe(GetBlockRequest { block_num: 1 }),
        first_block_validator,
        vec![endpoint.clone()],
    );
    checker.register_with_validator(
        chain
            .api()
            .block_api
            .get_block_header_probe(GetBlockHeaderRequest { block_num: 1 }),
        |response: &wax::api::GetBlockHeaderResponse| {
            let valid = response
                .header
                .as_ref()
                .is_some_and(|header| header.previous == ZERO_BLOCK_ID);

            if valid {
                Ok(())
            } else {
                Err("Malformed first block - may be a fork".into())
            }
        },
        vec![endpoint.clone()],
    );
    checker.register_with_validator(
        chain
            .api()
            .block_api
            .get_block_range_probe(GetBlockRangeRequest {
                starting_block_num: 1,
                count: 1,
            }),
        |response: &wax::api::GetBlockRangeResponse| {
            let valid = response
                .blocks
                .first()
                .is_some_and(|block| block.header.previous == ZERO_BLOCK_ID);

            if valid {
                Ok(())
            } else {
                Err("Malformed first block - may be a fork".into())
            }
        },
        vec![endpoint.clone()],
    );

    // First round with all three probes registered.
    wait_for(&mut events, |event| match event {
        HealthCheckerEvent::Data(_) => Some(()),
        HealthCheckerEvent::Error(error) => {
            panic!("unexpected health checker error: {error}")
        }
        _ => None,
    })
    .await;

    // Let a few more rounds pass, then unregister everything (repeatedly —
    // must be idempotent, like the TS triple `unregisterAll()`).
    tokio::time::sleep(Duration::from_millis(300)).await;
    checker.unregister_all();
    checker.unregister_all();
    checker.unregister_all();

    // Register again and wait for fresh data.
    checker.register_with_validator(
        chain
            .api()
            .block_api
            .get_block_probe(GetBlockRequest { block_num: 1 }),
        first_block_validator,
        vec![endpoint.clone()],
    );

    // The original receiver stays subscribed across the quiet window, so
    // errors emitted there would still be observed — like the TS listener
    // that stays live for the whole test.
    let first_url = wait_for(&mut events, |event| match event {
        HealthCheckerEvent::Data(scored) => Some(scored[0].url.clone()),
        HealthCheckerEvent::Error(error) => {
            panic!("unexpected health checker error: {error}")
        }
        _ => None,
    })
    .await;
    checker.unregister_all();

    assert_eq!(first_url, endpoint);
}
