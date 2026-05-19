// Rust port of selected tests from
// `ts/wasm/__tests__/detailed/hive_base.ts`.

use wax::{RustOperation, Transaction, WaxFoundation, create_wax_foundation};

fn foundation() -> Box<dyn WaxFoundation> {
    create_wax_foundation(None)
}

// Same shape as the TS `protoVoteOp` fixture
// (ts/wasm/__tests__/assets/data.proto-protocol.ts).
const VOTE_OPERATION_JSON: &str = r#"{
    "vote_operation": {
        "voter": "otom",
        "author": "c0ff33a",
        "permlink": "ewxhnjbj",
        "weight": 2200
    }
}"#;

#[test]
fn create_transaction_using_object_interface() {
    let f = foundation();

    let op = RustOperation::from_json(VOTE_OPERATION_JSON).expect("operation json");

    let tx = f
        .create_transaction_with_tapos(
            "04c1c7a566fc0da66aee465714acee7346b48ac2",
            "2023-08-01T15:38:48",
        )
        .expect("create_transaction_with_tapos")
        .push_operation(op);

    tx.validate().expect("validate");

    let digest = tx.sig_digest().expect("sig_digest");
    assert_eq!(
        digest, "205c79e3d17211882b1a2ba8640ff208413d68cabdca892cf47e9a6ad46e63a1",
        "sig digest must match the value pinned by the TS suite"
    );

    let signees = tx.signature_keys().expect("signature_keys");
    assert!(
        signees.is_empty(),
        "unsigned transaction must yield no signature keys"
    );
}
