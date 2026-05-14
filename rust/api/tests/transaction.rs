use api::RustTransactionApi;
use wax::proto::{operation::Value, Vote};
use wax::{RustOperation, RustTransaction};

fn vote(voter: &str, weight: u32) -> RustOperation {
    RustOperation::new(Value::VoteOperation(Vote {
        voter: voter.into(),
        author: "author".into(),
        permlink: "permlink".into(),
        weight,
    }))
}

#[test]
fn push_operation_appends_op_to_proto_state() {
    let tx = RustTransaction::new(1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new());
    assert!(tx.proto().operations.is_empty());

    let tx = tx.push_operation(vote("alice", 10_000));

    assert_eq!(tx.proto().operations.len(), 1);
    assert_eq!(
        tx.proto().operations[0].value,
        Some(Value::VoteOperation(Vote {
            voter: "alice".into(),
            author: "author".into(),
            permlink: "permlink".into(),
            weight: 10_000,
        }))
    );
}

#[test]
fn validate_passes_for_well_formed_transaction() {
    let tx = RustTransaction::new(1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    tx.validate().expect("well-formed transaction should validate");
}

const MAINNET_CHAIN_ID: &str =
    "beeab0de00000000000000000000000000000000000000000000000000000000";

#[test]
fn sig_digest_returns_hex_for_well_formed_transaction() {
    let tx = RustTransaction::new(1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    let digest = tx
        .sig_digest(MAINNET_CHAIN_ID)
        .expect("sig_digest should succeed for a valid transaction");

    assert_eq!(digest.len(), 64, "sig digest should be 32-byte hex (64 chars)");
    assert!(
        digest.chars().all(|c| c.is_ascii_hexdigit()),
        "sig digest should be lowercase hex: {digest}"
    );
}

#[test]
fn sig_digest_differs_when_operations_differ() {
    let base = || RustTransaction::new(1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new());

    let a = base().push_operation(vote("alice", 10_000));
    let b = base().push_operation(vote("bob", 10_000));

    let da = a.sig_digest(MAINNET_CHAIN_ID).expect("a digest");
    let db = b.sig_digest(MAINNET_CHAIN_ID).expect("b digest");

    assert_ne!(da, db, "different operations must produce different digests");
}

#[test]
fn sig_digest_fails_for_invalid_chain_id() {
    let tx = RustTransaction::new(1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    assert!(
        tx.sig_digest("not-hex").is_err(),
        "non-hex chain_id should fail"
    );
}

#[test]
fn validate_fails_for_invalid_operation() {
    let tx = RustTransaction::new(1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 20_000));

    assert!(
        tx.validate().is_err(),
        "vote with out-of-range weight should fail validation"
    );
}

#[test]
fn push_operation_preserves_order_when_chained() {
    let tx = RustTransaction::new(2, 0xdead_beef, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("first", 1))
        .push_operation(vote("second", 2));

    let voters: Vec<&str> = tx
        .proto()
        .operations
        .iter()
        .map(|op| match op.value.as_ref().expect("op value present") {
            Value::VoteOperation(v) => v.voter.as_str(),
            other => panic!("unexpected op variant: {other:?}"),
        })
        .collect();

    assert_eq!(voters, ["first", "second"]);
}
