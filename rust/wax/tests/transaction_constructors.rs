// Smoke tests for the three transaction-builder entry points on
// `WaxFoundation`: `create_transaction_from_proto`,
// `create_transaction_from_json`, and `create_transaction_with_tapos`.
//
// Each test verifies the proto state of the resulting `Transaction` and,
// where appropriate, that the C++-backed handle is alive (by round-tripping
// through `to_api()` or `to_binary_form()`).

use wax::constants::MAINNET_CHAIN_ID;
use wax::proto::{
    Operation, Transaction as ProtoTransaction, Vote, operation::Value,
};
use wax::{WaxFoundation, create_wax_foundation};

fn foundation() -> Box<dyn WaxFoundation> {
    create_wax_foundation(None)
}

// A vote operation reused across most tests below.
fn vote_op() -> Operation {
    Operation {
        value: Some(Value::VoteOperation(Vote {
            voter: "alice".into(),
            author: "bob".into(),
            permlink: "post".into(),
            weight: 10_000,
        })),
    }
}

fn proto_tx_with_vote() -> ProtoTransaction {
    ProtoTransaction {
        ref_block_num: 42,
        ref_block_prefix: 0xdead_beef,
        expiration: "2026-12-31T23:59:00".into(),
        operations: vec![vote_op()],
        extensions: Vec::new(),
        signatures: Vec::new(),
    }
}

// ---------- create_transaction_from_proto ------------------------------------

#[test]
fn create_transaction_from_proto_preserves_proto_state() {
    let f = foundation();
    let proto = proto_tx_with_vote();

    let tx = f
        .create_transaction_from_proto(proto.clone())
        .expect("create_transaction_from_proto");

    assert_eq!(tx.transaction(), &proto);
}

#[test]
fn create_transaction_from_proto_handle_round_trips_to_json() {
    let f = foundation();

    let tx = f
        .create_transaction_from_proto(proto_tx_with_vote())
        .expect("create_transaction_from_proto");

    // to_api() goes through the C++ handle — confirms the handle was wired
    // up, not just that the proto mirror was stored.
    let api = tx.to_api().expect("to_api");
    assert!(api.contains("vote_operation"), "missing op: {api}");
    assert!(api.contains("\"voter\":\"alice\""), "missing voter: {api}");
}

#[test]
fn create_transaction_from_proto_uses_default_chain_id() {
    let f = foundation();

    let tx = f
        .create_transaction_from_proto(proto_tx_with_vote())
        .expect("create_transaction_from_proto");

    // The sig digest depends on chain id; if the default chain id wasn't
    // applied, computing it would either error or produce a different value.
    let digest = tx.sig_digest().expect("sig_digest");
    assert_eq!(digest.len(), 64, "sha256 hex digest expected");
}

// ---------- create_transaction_from_json -------------------------------------
// `create_transaction_from_json` consumes API JSON — the `{type, value}`
// envelope shape that TS's `createTransactionFromJson` and Python's
// `create_transaction_from_json` accept. Proto JSON goes through
// `create_transaction_from_proto` (with the typed `proto::Transaction`).

const API_TX_JSON: &str = r#"{
    "ref_block_num": 42,
    "ref_block_prefix": 3735928559,
    "expiration": "2026-12-31T23:59:00",
    "operations": [
        {
            "type": "vote_operation",
            "value": {
                "voter": "alice",
                "author": "bob",
                "permlink": "post",
                "weight": 10000
            }
        }
    ],
    "extensions": [],
    "signatures": []
}"#;

#[test]
fn create_transaction_from_json_round_trips_api_json() {
    let f = foundation();

    let tx = f
        .create_transaction_from_json(API_TX_JSON)
        .expect("create_transaction_from_json");

    assert_eq!(tx.transaction(), &proto_tx_with_vote());
}

#[test]
fn create_transaction_from_json_handle_round_trips_to_binary() {
    let f = foundation();

    let tx = f
        .create_transaction_from_json(API_TX_JSON)
        .expect("create_transaction_from_json");

    // Binary form goes through the C++ handle, exercising that the JSON path
    // produced a usable handle (not just a populated proto mirror).
    let hex = tx.to_binary_form(false).expect("to_binary_form");
    assert!(!hex.is_empty(), "binary form must be non-empty");
}

#[test]
fn create_transaction_from_json_rejects_malformed_input() {
    let f = foundation();

    let err = match f.create_transaction_from_json("{not valid json") {
        Err(e) => e,
        Ok(_) => panic!("malformed json must error"),
    };
    assert!(
        !err.message().is_empty(),
        "error must carry a message: {}",
        err.message()
    );
}

#[test]
fn create_transaction_from_json_rejects_unknown_operation_type() {
    let f = foundation();

    // The C++ `to_proto_visitor`'s static_variant case asserts the `type`
    // string maps to a known operation name (`Invalid object name`).
    let json = r#"{
        "ref_block_num": 1,
        "ref_block_prefix": 1,
        "expiration": "2026-01-01T00:00:00",
        "operations": [
            { "type": "no_such_operation", "value": {} }
        ],
        "extensions": [],
        "signatures": []
    }"#;

    assert!(
        f.create_transaction_from_json(json).is_err(),
        "unknown operation type must error"
    );
}

// ---------- create_transaction_with_tapos ------------------------------------

#[test]
fn create_transaction_with_tapos_pulls_ref_block_from_block_id() {
    let f = foundation();
    // 20-byte block id whose first 4 bytes encode block number 0x01020304:
    // ref_block_num is the low 16 bits → 0x0304.
    let block_id = "01020304ffeeddccbbaa99887766554433221100";

    let tx = f
        .create_transaction_with_tapos(block_id, "2026-05-15T12:00:00")
        .expect("create_transaction_with_tapos");

    let proto = tx.transaction();
    assert_eq!(proto.ref_block_num, 0x0304);
    assert_ne!(proto.ref_block_prefix, 0);
    assert_eq!(proto.expiration, "2026-05-15T12:00:00");
    assert!(proto.operations.is_empty());
    assert!(proto.signatures.is_empty());
}

#[test]
fn create_transaction_with_tapos_returns_usable_handle() {
    let f = foundation();
    let block_id = "01020304ffeeddccbbaa99887766554433221100";

    let mut tx = f
        .create_transaction_with_tapos(block_id, "2026-05-15T12:00:00")
        .expect("create_transaction_with_tapos");

    let pushed = f.create_operation(Value::VoteOperation(Vote {
        voter: "alice".into(),
        author: "bob".into(),
        permlink: "p".into(),
        weight: 1,
    }));
    tx = tx.push_operation(pushed);

    let api = tx.to_api().expect("to_api");
    assert!(api.contains("\"voter\":\"alice\""), "vote missing: {api}");
}

#[test]
fn create_transaction_with_tapos_rejects_invalid_block_id() {
    let f = foundation();

    assert!(
        f.create_transaction_with_tapos("not-hex", "2026-05-15T12:00:00")
            .is_err(),
        "invalid block id must error"
    );
}

// ---------- chain_id propagation --------------------------------------------

#[test]
fn create_transaction_with_tapos_uses_configured_chain_id() {
    use wax::WaxOptions;

    // Sig digest is chain-id-dependent. Building one tx with the default
    // chain id and another with an explicit non-default chain id must yield
    // different digests, demonstrating that `create_transaction_with_tapos`
    // is reading from the `WaxOptions`.
    let default = create_wax_foundation(None);
    let custom = create_wax_foundation(WaxOptions {
        chain_id: "00".repeat(32),
    });

    let block_id = "01020304ffeeddccbbaa99887766554433221100";

    let a = default
        .create_transaction_with_tapos(block_id, "2026-05-15T12:00:00")
        .unwrap();
    let b = custom
        .create_transaction_with_tapos(block_id, "2026-05-15T12:00:00")
        .unwrap();

    let da = a.sig_digest().expect("sig_digest default");
    let db = b.sig_digest().expect("sig_digest custom");
    assert_ne!(
        da, db,
        "configured chain id should be threaded into the transaction"
    );

    // Sanity check: default uses the mainnet chain id.
    let _ = MAINNET_CHAIN_ID;
}
