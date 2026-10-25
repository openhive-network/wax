//! A local JSON-RPC node replaying responses recorded from a live chain, so
//! tests whose calls are stable read-only lookups pass or fail independently
//! of the live node's reachability and latency.
//!
//! Fixtures live in `tests/detailed/fixtures/<name>.json`, one JSON array of
//! `{ "method", "params", "result" | "error" }` entries per test; a request
//! is answered by the entry whose method and params equal its own. Run the
//! suite with `WAX_RECORD_FIXTURES=1` to (re)record: requests without an
//! entry are then forwarded to the live upstream and their responses are
//! appended to the fixture file.

use std::net::{TcpListener, TcpStream};
use std::path::PathBuf;
use std::thread;
use std::time::Duration;

use serde_json::{Value, json};

use wax::{HiveChain, HiveChainOptions, create_hive_chain};

use crate::common::{read_json_request, write_json_response};

/// Used to switch recorded nodes from replaying to recording.
const RECORD_ENV: &str = "WAX_RECORD_FIXTURES";

/// Used as the upstream request timeout while recording.
const RECORD_TIMEOUT: Duration = Duration::from_secs(30);

/// Represents the replay state of one fixture file.
struct RecordedNode {
    path: PathBuf,
    entries: Vec<Value>,
    recorder: Option<Recorder>,
}

/// Represents the live upstream a recording node forwards unknown requests
/// to.
struct Recorder {
    upstream: String,
    client: reqwest::Client,
    runtime: tokio::runtime::Runtime,
}

/// Creates a chain configured by `options` whose JSON-RPC calls are answered
/// from the fixture `name`, recorded from `options.api_endpoint`.
///
/// Panics when the fixture file is missing outside recording mode.
pub fn recorded_chain(name: &str, options: HiveChainOptions) -> HiveChain {
    let api_endpoint = spawn_recorded_node(name, &options.api_endpoint);

    create_hive_chain(HiveChainOptions {
        api_endpoint,
        ..options
    })
    .unwrap()
}

/// Starts a local node answering from the fixture `name` and returns its URL.
/// `upstream` is the live endpoint the fixture was (and is re-)recorded from.
fn spawn_recorded_node(name: &str, upstream: &str) -> String {
    let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests/detailed/fixtures")
        .join(format!("{name}.json"));
    let recording = std::env::var_os(RECORD_ENV).is_some();

    let entries = match std::fs::read_to_string(&path) {
        Ok(content) => serde_json::from_str(&content).unwrap(),
        Err(_) if recording => Vec::new(),
        Err(error) => panic!(
            "missing fixture {}: {error}; record it with {RECORD_ENV}=1",
            path.display()
        ),
    };

    let recorder = recording.then(|| Recorder {
        upstream: upstream.to_string(),
        client: reqwest::Client::builder()
            .timeout(RECORD_TIMEOUT)
            .build()
            .unwrap(),
        runtime: tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .unwrap(),
    });

    let mut node = RecordedNode {
        path,
        entries,
        recorder,
    };

    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let url = format!("http://{}", listener.local_addr().unwrap());

    // The thread outlives the test on purpose: it only ever blocks in
    // `accept`, and the test process exits once the suite is done.
    thread::spawn(move || {
        for stream in listener.incoming() {
            node.serve(&mut stream.unwrap());
        }
    });

    url
}

impl RecordedNode {
    fn serve(&mut self, stream: &mut TcpStream) {
        let request = read_json_request(stream);
        let method = &request["method"];
        let params = &request["params"];

        let entry = match self.find(method, params) {
            Some(entry) => entry.clone(),
            None => self.answer_unrecorded(&request),
        };

        let mut response = json!({ "jsonrpc": "2.0", "id": request["id"] });
        for field in ["result", "error"] {
            if let Some(value) = entry.get(field) {
                response[field] = value.clone();
            }
        }

        write_json_response(stream, &response);
    }

    fn find(&self, method: &Value, params: &Value) -> Option<&Value> {
        self.entries.iter().find(|entry| {
            entry["method"] == *method && entry["params"] == *params
        })
    }

    /// Forwards `request` upstream and stores its response; outside
    /// recording mode, answers with a JSON-RPC error naming the missing
    /// entry, which fails the calling test with that message.
    fn answer_unrecorded(&mut self, request: &Value) -> Value {
        let method = &request["method"];
        let params = &request["params"];

        let Some(recorder) = &self.recorder else {
            return json!({
                "error": {
                    "code": -32603,
                    "message": format!(
                        "no recorded response for {method} {params} in {}; \
                         record it with {RECORD_ENV}=1",
                        self.path.display()
                    ),
                },
            });
        };

        let response: Value = recorder.runtime.block_on(async {
            recorder
                .client
                .post(&recorder.upstream)
                .json(request)
                .send()
                .await
                .and_then(|response| response.error_for_status())
                .unwrap_or_else(|error| {
                    panic!(
                        "recording {method} from {}: {error}",
                        recorder.upstream
                    )
                })
                .json()
                .await
                .unwrap()
        });

        let mut entry = json!({ "method": method, "params": params });
        for field in ["result", "error"] {
            if let Some(value) = response.get(field) {
                entry[field] = value.clone();
            }
        }

        self.entries.push(entry.clone());
        std::fs::create_dir_all(self.path.parent().unwrap()).unwrap();
        std::fs::write(
            &self.path,
            serde_json::to_string_pretty(&self.entries).unwrap() + "\n",
        )
        .unwrap();

        entry
    }
}
