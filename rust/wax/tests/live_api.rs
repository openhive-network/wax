// Live-network round trips through the `extend` / `extend_rest` surface and
// the default typed API, against the public nodes wax defaults to
// (`api.hive.blog` JSON-RPC, `api.syncad.com` REST). Complements
// `detailed/extend_api.rs`, which stops at the transport on purpose: here the
// full path — binding, wire format, node behavior, strict DTO decoding — is
// exercised for real, so node-side schema drift fails loudly.
//
// Every test is `#[ignore]`d: network tests are inherently flaky and must
// stay out of the required CI path. Run them explicitly with:
//
//     cargo test --test live_api -- --ignored

use serde::{Deserialize, Serialize};
use serde_json::{Value, json};

use wax::{HiveChain, WaxChainOptions, create_hive_chain, hive_api};

/// Provides the JSON-RPC introspection namespace served by every Hive node.
#[hive_api(namespace = "jsonrpc")]
pub trait JsonRpcApi {
    /// Returns the parameter/result signature of a JSON-RPC method.
    async fn get_signature(params: GetSignatureRequest)
    -> GetSignatureResponse;
}

/// Provides the HAfAH REST surface served by the default REST node.
#[hive_api(rest)]
pub trait HafahApi {
    /// Returns the current head block number.
    #[get("/hafah-api/headblock")]
    async fn headblock() -> u32;

    /// Fetches a transaction by its id.
    #[get("/hafah-api/transactions/{transactionId}")]
    async fn get_transaction(
        params: GetTransactionRequest,
    ) -> GetTransactionResponse;
}

/// Represents the parameters of `jsonrpc.get_signature`.
#[derive(Serialize)]
pub struct GetSignatureRequest {
    pub method: String,
}

/// Represents the result of `jsonrpc.get_signature`.
#[derive(Deserialize)]
pub struct GetSignatureResponse {
    pub args: Value,
    pub ret: Value,
}

/// Represents the parameters of the HAfAH transaction-by-id endpoint.
#[derive(Serialize)]
pub struct GetTransactionRequest {
    #[serde(rename = "transactionId")]
    pub transaction_id: String,
}

/// Represents the (partially decoded) result of the HAfAH transaction-by-id
/// endpoint.
#[derive(Deserialize)]
pub struct GetTransactionResponse {
    pub transaction_json: Value,
}

/// Used to fetch a known mainnet transaction (same id as the TS test).
const TEST_TRANSACTION_ID: &str = "954f6de36e6715d128fa8eb5a053fc254b05ded0";

fn live_chain() -> HiveChain {
    create_hive_chain(WaxChainOptions {
        // The 2s default is tuned for nearby nodes; give the public ones
        // room to answer before a slow round trip reads as a failure.
        api_timeout_ms: 15_000,
        ..Default::default()
    })
    .unwrap()
}

// TS NOTE: mirrors `ts/wasm/__tests__/detailed/hive_chain.ts` ('Should be
// able to extend hive chain interface by custom definitions using interfaces
// only'), including its expected `{ args: {}, ret: [] }` reflection of
// `jsonrpc.get_methods`.
#[tokio::test]
#[ignore = "live network test against the default public Hive nodes"]
async fn extend_calls_json_rpc_introspection_on_live_node() {
    let chain = live_chain();
    let api = chain.extend::<JsonRpcApi>();

    let signature = api
        .get_signature(GetSignatureRequest {
            method: "jsonrpc.get_methods".into(),
        })
        .await
        .unwrap();

    assert_eq!(signature.args, json!({}));
    assert_eq!(signature.ret, json!([]));
}

// The default typed surface against the real node: strict deserialization
// enforces field presence, so this is the canary catching the node's
// reflects drifting from the `chain/api/` DTOs.
#[tokio::test]
#[ignore = "live network test against the default public Hive nodes"]
async fn default_api_decodes_live_dynamic_global_properties() {
    let chain = live_chain();

    let dgp = chain
        .api()
        .database_api
        .get_dynamic_global_properties(Default::default())
        .await
        .unwrap();

    assert!(dgp.head_block_number > 0);
}

// TS NOTE: mirrors `hive_chain_rest_api.ts` ('Should be able to extend and
// perform REST API calls returning INT').
#[tokio::test]
#[ignore = "live network test against the default public Hive nodes"]
async fn extend_rest_fetches_live_headblock() {
    let chain = live_chain();
    let rest = chain.extend_rest::<HafahApi>();

    let headblock = rest.headblock().await.unwrap();

    assert!(headblock > 0);
}

// TS NOTE: mirrors `hive_chain_rest_api.ts` ('Should be able to extend and
// perform REST API calls') — same transaction id; `{transactionId}` must be
// substituted into the live URL.
#[tokio::test]
#[ignore = "live network test against the default public Hive nodes"]
async fn extend_rest_fetches_live_transaction_by_path_param() {
    let chain = live_chain();
    let rest = chain.extend_rest::<HafahApi>();

    let tx = rest
        .get_transaction(GetTransactionRequest {
            transaction_id: TEST_TRANSACTION_ID.into(),
        })
        .await
        .unwrap();

    assert!(tx.transaction_json.is_object());
}
