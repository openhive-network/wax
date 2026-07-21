// Rust port of `ts/wasm/__tests__/detailed/hive_chain_custom_opts.ts`.
//
// Tests appear in TS source order. Each Rust test has a `// TS line N` comment
// pointing back to the TS original.
//
// The TS suite runs against the proxy mock server (recorded api.hive.blog
// fixtures); the API tests here serve the equivalent canned responses from a
// routing JSON-RPC server instead.

use serde_json::{Value, json};

use wax::api::{
    FindAccountsRequest, GetBlockHeaderRequest, GetBlockRangeRequest,
    GetBlockRequest, GetKeyReferencesRequest, TransactionPackType,
    VerifyAuthorityRequest,
};
use wax::{HiveChain, HiveChainOptions, create_hive_chain};

use crate::common::{chain_at, dgpo_result, spawn_routing_server};

// data.protocol.ts: `serialization_sensitive_transaction` (API JSON form).
const SERIALIZATION_SENSITIVE_TRANSACTION: &str = r#"{
    "ref_block_num": 1959,
    "ref_block_prefix": 3625727107,
    "expiration": "2023-11-09T22:01:24",
    "operations": [
        {
            "type": "transfer_operation",
            "value": {
                "from": "oneplus7",
                "to": "kryptogames",
                "amount": {"amount": "300000", "precision": 3, "nai": "@@000000021"},
                "memo": "Roll under 50 4d434bd943616"
            }
        }
    ],
    "extensions": [],
    "signatures": []
}"#;

// data.protocol.ts: `legacyApiTransaction` — the exact string
// `JSON.stringify` produces there, byte-for-byte.
const LEGACY_API_TRANSACTION: &str = r#"{"ref_block_num":1959,"ref_block_prefix":3625727107,"expiration":"2023-11-09T22:01:24","operations":[["transfer",{"from":"oneplus7","to":"kryptogames","amount":"300.000 HIVE","memo":"Roll under 50 4d434bd943616"}]],"extensions":[],"signatures":[]}"#;

// data.protocol.ts: `signatureTransaction`.
const SIGNATURE_TRANSACTION: &str = r#"{
    "expiration": "2024-02-21T06:55:40",
    "extensions": [],
    "operations": [
        {
            "type": "account_update2_operation",
            "value": {
                "account": "thatcryptodave",
                "extensions": [],
                "json_metadata": "",
                "posting_json_metadata": "{\"name\":\"David P.\",\"about\":\"\",\"website\":\"\",\"location\":\"Ontario, Canada\",\"birthday\":\"03.28.1984\",\"profile\":{\"name\":\"David P.\",\"about\":\"\",\"website\":\"\",\"location\":\"Ontario, Canada\",\"birthday\":\"03.28.1984\",\"profile_image\":\"\",\"cover_image\":\"\"}}"
            }
        }
    ],
    "signatures": [
        "1f6ad21ddf9f57f1a94c1462185744cb0ea779ec1e99899f2556a3ce02b18d1b810fcddaccb349a53037798aea8023909447df756db461235ba5b63984d515c977"
    ],
    "ref_block_num": 26295,
    "ref_block_prefix": 26859167
}"#;

// The full block fixture served for block 26295 (shape from
// `src/chain/api/tests.rs`; ids swapped in per request below).
fn block_json(block_id: &str) -> Value {
    json!({
        "previous": "05c1578d947b2c8db32b1c0d3ad3f4b7ea4bf68e",
        "timestamp": "2025-07-08T12:34:57",
        "witness": "gtg",
        "transaction_merkle_root": "77c5ff89838e11a92d3b0ce6b8d1e9d0f2e0c823",
        "extensions": [],
        "witness_signature": "1f227719b21a238e75c14e88fe442d20a488c1f61e17197a2a3faee7e07db4a3b415d1e224ba641f558a824d1cbcdbe915308c1c88cf35eb32ffdb28f4582d1af0",
        "transactions": [],
        "block_id": block_id,
        "signing_key": "STM5UyJHhrps78HH9dTMQpccHhs1BGnwYYPnobKKLNY6nikp1J1KE",
        "transaction_ids": []
    })
}

fn header_json() -> Value {
    json!({
        "previous": "05c1578d947b2c8db32b1c0d3ad3f4b7ea4bf68e",
        "timestamp": "2025-07-08T12:34:57",
        "witness": "gtg",
        "transaction_merkle_root": "77c5ff89838e11a92d3b0ce6b8d1e9d0f2e0c823",
        "extensions": []
    })
}

/// Spawns the recorded-fixture router shared by the API tests of this file —
/// the Rust analogue of the proxy mock server responses the TS suite relies
/// on.
fn mock_api_chain() -> HiveChain {
    let route = |method: &str, params: &Value| match method {
        "database_api.get_dynamic_global_properties" => {
            json!({ "result": dgpo_result() })
        }
        "account_by_key_api.get_key_references" => {
            assert_eq!(
                params["keys"],
                json!([
                    "STM5wJarof5LWBiQu2umDUWgg1xD5QHpKQC1Z97sE2aoQdwQ8DwMf"
                ])
            );
            json!({ "result": { "accounts": [["thatcryptodave"]] } })
        }
        "block_api.get_block" => {
            assert_eq!(params["block_num"], json!(26295));
            json!({ "result": {
                "block": block_json("000066b76f6014ae4ab9407552d7859911cf5cad")
            } })
        }
        "block_api.get_block_header" => {
            assert_eq!(params["block_num"], json!(26295));
            json!({ "result": { "header": header_json() } })
        }
        "block_api.get_block_range" => {
            assert_eq!(params["starting_block_num"], json!(26295));
            assert_eq!(params["count"], json!(5));
            let blocks: Vec<Value> = [
                "000066b76f6014ae4ab9407552d7859911cf5cad",
                "000066b8e698e9309f322b1a992b8d09e4a9e4e0",
                "000066b9349f21e0f1e97eaf1f4d0f8686aeb0c9",
                "000066ba32adbcda45f5aaef00b3bbb00a1f8dc0",
                "000066bbd45f0902e0d15423ec2e714f2f6f7d3c",
            ]
            .iter()
            .map(|id| block_json(id))
            .collect();
            json!({ "result": { "blocks": blocks } })
        }
        "database_api.find_accounts" => {
            assert_eq!(params["accounts"], json!(["thatcryptodave"]));
            json!({ "result": { "accounts": [
                crate::common::api_account_json(
                    "thatcryptodave",
                    crate::common::authority_json(
                        1,
                        &[],
                        &[("STM5wJarof5LWBiQu2umDUWgg1xD5QHpKQC1Z97sE2aoQdwQ8DwMf", 1)],
                    ),
                    "STM5wJarof5LWBiQu2umDUWgg1xD5QHpKQC1Z97sE2aoQdwQ8DwMf",
                )
            ] } })
        }
        "database_api.verify_authority" => {
            assert_eq!(params["pack"], json!("hf26"));
            json!({ "result": { "valid": true } })
        }
        "rc_api.find_rc_accounts" => {
            assert_eq!(params["accounts"], json!(["thatcryptodave"]));
            json!({ "result": {
                "rc_accounts": [crate::common::rc_account_json("thatcryptodave")]
            } })
        }
        other => panic!("unexpected JSON-RPC method: {other}"),
    };

    chain_at(spawn_routing_server(route))
}

// TS line 7: "Should be able to use different options".
//
// The config mirrors the `wax_testsuite_custom_chain_options` playwright
// project (`ts/playwright.config.ts`): the mainnet chain id and the endpoint
// WITH its non-standard trailing slash — both TS and Rust keep the
// configured string verbatim.
#[test]
fn uses_different_options() {
    let config = HiveChainOptions {
        chain_id:
            "beeab0de00000000000000000000000000000000000000000000000000000000"
                .into(),
        api_endpoint: "https://api.hive.blog/".into(),
        ..Default::default()
    };

    let my_chain = create_hive_chain(config.clone()).unwrap();
    // TS compares against the suite-wide `chain` fixture built from the same
    // project config.
    let chain = create_hive_chain(config.clone()).unwrap();

    assert_eq!(my_chain.endpoint_url(), "https://api.hive.blog/");
    assert_eq!(
        config.chain_id,
        "beeab0de00000000000000000000000000000000000000000000000000000000"
    );
    assert_eq!(my_chain.endpoint_url(), config.api_endpoint);
    assert_eq!(chain.endpoint_url(), config.api_endpoint);
}

// TS line 28: "Should be able to bidirectional convert legacy api to proto
// using object interface".
#[test]
fn bidirectional_convert_legacy_api_to_proto() {
    let chain = create_hive_chain(None).unwrap();

    let tx = chain
        .create_transaction_from_json(SERIALIZATION_SENSITIVE_TRANSACTION)
        .expect("create_transaction_from_json");

    assert_eq!(
        tx.to_legacy_api().expect("to_legacy_api"),
        LEGACY_API_TRANSACTION
    );
}

// TS line 38: "Should be able to calculate from api properties from hive
// chain interface with signature transaction provided".
#[test]
fn signature_properties_from_signature_transaction() {
    let chain = create_hive_chain(None).unwrap();

    let tx = chain
        .create_transaction_from_json(SIGNATURE_TRANSACTION)
        .expect("create_transaction_from_json");

    assert_eq!(
        tx.signature_keys().expect("signature_keys")[0],
        "STM5wJarof5LWBiQu2umDUWgg1xD5QHpKQC1Z97sE2aoQdwQ8DwMf"
    );
    assert_eq!(
        tx.legacy_signature_keys().expect("legacy_signature_keys")[0],
        "STM5wJarof5LWBiQu2umDUWgg1xD5QHpKQC1Z97sE2aoQdwQ8DwMf"
    );
    assert!(tx.is_signed());
}

// TS line 56: "Should be able to calculate from api properties from hive
// chain interface with serialization sensitive transaction provided".
#[test]
fn digests_from_serialization_sensitive_transaction() {
    let chain = create_hive_chain(None).unwrap();

    let tx = chain
        .create_transaction_from_json(SERIALIZATION_SENSITIVE_TRANSACTION)
        .expect("create_transaction_from_json");

    assert_eq!(
        tx.sig_digest().expect("sig_digest"),
        "8758db23c6aea40564697620ff61625b45c3b538cda21ded9fd6ec229caa1ee9"
    );
    assert_eq!(
        tx.legacy_sig_digest().expect("legacy_sig_digest"),
        "7fbd09ff2c3a90acfc59adce5abffdaa3fc95e33160c5ac237f0f4366f90e2fe"
    );
    assert_eq!(
        tx.id().expect("id"),
        "3725c81634f152011e2043eb7119911b953d4267"
    );
    assert_eq!(
        tx.legacy_id().expect("legacy_id"),
        "7f34699e9eea49d1bcc10c88f96e38897839ece3"
    );
}

// TS line 74: "Should be able to get transaction key references from hive
// chain interafce".
#[tokio::test]
async fn get_transaction_key_references() {
    let chain = mock_api_chain();

    let response = chain
        .api()
        .account_by_key_api
        .get_key_references(GetKeyReferencesRequest {
            keys: vec![
                "STM5wJarof5LWBiQu2umDUWgg1xD5QHpKQC1Z97sE2aoQdwQ8DwMf".into(),
            ],
        })
        .await
        .expect("get_key_references");

    assert_eq!(response.accounts, vec![vec!["thatcryptodave".to_string()]]);
}

// TS line 82: "Should be able to get transaction block from hive chain
// interafce".
#[tokio::test]
async fn get_transaction_block() {
    let chain = mock_api_chain();

    let response = chain
        .api()
        .block_api
        .get_block(GetBlockRequest { block_num: 26295 })
        .await
        .expect("get_block");

    assert!(response.block.is_some());
}

// TS line 90: "Should be able to get transaction block header from hive
// chain interafce".
#[tokio::test]
async fn get_transaction_block_header() {
    let chain = mock_api_chain();

    let response = chain
        .api()
        .block_api
        .get_block_header(GetBlockHeaderRequest { block_num: 26295 })
        .await
        .expect("get_block_header");

    assert!(response.header.is_some());
}

// TS line 98: "Should be able to get transaction block range from hive chain
// interafce".
#[tokio::test]
async fn get_transaction_block_range() {
    let chain = mock_api_chain();

    let response = chain
        .api()
        .block_api
        .get_block_range(GetBlockRangeRequest {
            starting_block_num: 26295,
            count: 5,
        })
        .await
        .expect("get_block_range");

    assert_eq!(response.blocks.len(), 5);
    assert_eq!(
        response.blocks[0].block_id,
        "000066b76f6014ae4ab9407552d7859911cf5cad"
    );
}

// TS line 107: "Should be able to find accounts from hive chain interafce".
//
// TS NOTE: TS asserts the presence of the `active` / `owner` / `posting`
// properties on the loose JSON; typed deserialization already guarantees
// presence, so the Rust port checks their contents instead.
#[tokio::test]
async fn find_accounts_from_chain_interface() {
    let chain = mock_api_chain();

    let response = chain
        .api()
        .database_api
        .find_accounts(FindAccountsRequest {
            accounts: vec!["thatcryptodave".into()],
            delayed_votes_active: Some(true),
        })
        .await
        .expect("find_accounts");

    let account = &response.accounts[0];
    assert_eq!(account.owner.weight_threshold, 1);
    assert_eq!(
        account.active.key_auths[0].0,
        "STM5wJarof5LWBiQu2umDUWgg1xD5QHpKQC1Z97sE2aoQdwQ8DwMf"
    );
    assert_eq!(account.posting.weight_threshold, 1);
}

// TS line 117: "Should be able to get dynamic global properties from hive
// chain interafce".
#[tokio::test]
async fn get_dynamic_global_properties() {
    let chain = mock_api_chain();

    let response = chain
        .api()
        .database_api
        .get_dynamic_global_properties(Default::default())
        .await
        .expect("get_dynamic_global_properties");

    assert_eq!(response.id, 0);
}

// TS line 125: "Should be able to get verify authority from hive chain
// interafce".
#[tokio::test]
async fn get_verify_authority() {
    let chain = mock_api_chain();

    let trx = serde_json::from_str(SIGNATURE_TRANSACTION)
        .expect("parse signature transaction");
    let response = chain
        .api()
        .database_api
        .verify_authority(VerifyAuthorityRequest {
            trx,
            pack: TransactionPackType::Hf26,
        })
        .await
        .expect("verify_authority");

    assert!(response.valid);
}

// TS line 133: "Should be able to find rc accounts from hive chain
// interafce".
#[tokio::test]
async fn find_rc_accounts_from_chain_interface() {
    let chain = mock_api_chain();

    let response = chain
        .api()
        .rc_api
        .find_rc_accounts(wax::api::FindRcAccountsRequest {
            accounts: vec!["thatcryptodave".into()],
        })
        .await
        .expect("find_rc_accounts");

    assert_eq!(response.rc_accounts[0].account, "thatcryptodave");
}
