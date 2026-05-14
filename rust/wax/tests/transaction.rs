use wax::{rust_protocol, Transaction};
use wax_core::proto::{operation::Value, Vote};
use wax_core::{RustOperation, RustTransaction};

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
    let tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new());
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
    let tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    tx.validate().expect("well-formed transaction should validate");
}

const MAINNET_CHAIN_ID: &str =
    "beeab0de00000000000000000000000000000000000000000000000000000000";

#[test]
fn sig_digest_returns_hex_for_well_formed_transaction() {
    let tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
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
    let base = || RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new());

    let a = base().push_operation(vote("alice", 10_000));
    let b = base().push_operation(vote("bob", 10_000));

    let da = a.sig_digest(MAINNET_CHAIN_ID).expect("a digest");
    let db = b.sig_digest(MAINNET_CHAIN_ID).expect("b digest");

    assert_ne!(da, db, "different operations must produce different digests");
}

#[test]
fn sig_digest_fails_for_invalid_chain_id() {
    let tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    assert!(
        tx.sig_digest("not-hex").is_err(),
        "non-hex chain_id should fail"
    );
}

#[test]
fn id_returns_40_char_hex_for_well_formed_transaction() {
    let tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    let id = tx.id().expect("id should succeed for a valid transaction");

    assert_eq!(id.len(), 40, "tx id should be 20-byte hex (40 chars)");
    assert!(
        id.chars().all(|c| c.is_ascii_hexdigit()),
        "tx id should be hex: {id}"
    );
}

#[test]
fn id_differs_when_operations_differ() {
    let base = || RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new());

    let a = base().push_operation(vote("alice", 10_000)).id().expect("a id");
    let b = base().push_operation(vote("bob", 10_000)).id().expect("b id");

    assert_ne!(a, b, "different operations must produce different ids");
}

#[test]
fn id_is_independent_of_chain_id() {
    let tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    let id_via_self = tx.id().expect("id should succeed");
    let digest_main = tx.sig_digest(MAINNET_CHAIN_ID).expect("digest should succeed");

    assert_ne!(
        id_via_self, digest_main,
        "tx id and sig digest are different hashes and should not collide"
    );
    assert_eq!(id_via_self.len(), 40);
    assert_eq!(digest_main.len(), 64);
}

#[test]
fn to_binary_form_returns_hex_for_well_formed_transaction() {
    let tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    let bin = tx
        .to_binary_form(false)
        .expect("to_binary_form should succeed for a valid transaction");

    assert!(!bin.is_empty(), "binary form should not be empty");
    assert_eq!(bin.len() % 2, 0, "hex string should have even length: {bin}");
    assert!(
        bin.chars().all(|c| c.is_ascii_hexdigit()),
        "binary form should be hex: {bin}"
    );
}

#[test]
fn to_binary_form_differs_when_operations_differ() {
    let base = || RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new());

    let a = base().push_operation(vote("alice", 10_000)).to_binary_form(false).expect("a bin");
    let b = base().push_operation(vote("bob", 10_000)).to_binary_form(false).expect("b bin");

    assert_ne!(a, b, "different operations must produce different binary forms");
}

#[test]
fn to_binary_form_stripped_is_no_longer_than_full() {
    let tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    let full = tx.to_binary_form(false).expect("full bin");
    let stripped = tx.to_binary_form(true).expect("stripped bin");

    assert!(
        stripped.len() <= full.len(),
        "stripped form (len={}) must not exceed full form (len={})",
        stripped.len(),
        full.len()
    );
}

#[test]
fn validate_fails_for_invalid_operation() {
    let tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 20_000));

    assert!(
        tx.validate().is_err(),
        "vote with out-of-range weight should fail validation"
    );
}

// 65-byte (130 hex char) compact ECDSA signature. Contents are not a real
// signature — cpp_tx_add_signature only hex-decodes the input, it doesn't
// verify the signature against the digest.
const FAKE_SIG_A: &str =
    "1f00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff";
const FAKE_SIG_B: &str =
    "20ffeeddccbbaa99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa998877665544332211ff";

#[test]
fn is_signed_is_false_for_fresh_transaction() {
    let tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    assert!(!tx.is_signed(), "transaction with no signatures must not be signed");
}

#[test]
fn is_signed_becomes_true_after_add_signature() {
    let mut tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));
    assert!(!tx.is_signed());

    tx.add_signature(FAKE_SIG_A).expect("signature should be accepted");

    assert!(tx.is_signed(), "transaction must be signed after add_signature");
}

#[test]
fn is_signed_stays_false_when_add_signature_fails() {
    let mut tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    let _ = tx.add_signature("not-a-hex-signature");

    assert!(!tx.is_signed(), "failed add_signature must leave tx unsigned");
}

#[test]
fn add_signature_appends_to_proto_signatures() {
    let mut tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));
    assert!(tx.proto().signatures.is_empty());

    tx.add_signature(FAKE_SIG_A).expect("valid hex signature should be accepted");

    assert_eq!(tx.proto().signatures, vec![FAKE_SIG_A.to_string()]);
}

#[test]
fn add_signature_accumulates_across_calls() {
    let mut tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    tx.add_signature(FAKE_SIG_A).expect("first signature");
    tx.add_signature(FAKE_SIG_B).expect("second signature");

    assert_eq!(
        tx.proto().signatures,
        vec![FAKE_SIG_A.to_string(), FAKE_SIG_B.to_string()]
    );
}

#[test]
fn add_signature_extends_full_binary_form_but_not_stripped() {
    let mut tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    let full_before = tx.to_binary_form(false).expect("full bin pre-sig");
    let stripped_before = tx.to_binary_form(true).expect("stripped bin pre-sig");

    tx.add_signature(FAKE_SIG_A).expect("signature should be accepted");

    let full_after = tx.to_binary_form(false).expect("full bin post-sig");
    let stripped_after = tx.to_binary_form(true).expect("stripped bin post-sig");

    assert!(
        full_after.len() > full_before.len(),
        "adding a signature should grow the full binary form ({} -> {})",
        full_before.len(),
        full_after.len()
    );
    assert_eq!(
        stripped_before, stripped_after,
        "stripped binary form must ignore signatures"
    );
}

#[test]
fn add_signature_rejects_non_hex_input() {
    let mut tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    let result = tx.add_signature("not-a-hex-signature");

    assert!(result.is_err(), "non-hex signature must fail");
    assert!(
        tx.proto().signatures.is_empty(),
        "failed add_signature must not mutate proto state"
    );
}

#[test]
fn to_api_returns_json_describing_the_transaction() {
    let tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    let json = tx.to_api().expect("to_api should succeed for a valid transaction");

    assert!(json.starts_with('{') && json.ends_with('}'), "expected JSON object: {json}");
    assert!(json.contains("\"operations\""), "missing operations field: {json}");
    assert!(json.contains("vote_operation"), "missing op type tag: {json}");
    assert!(json.contains("\"voter\":\"alice\""), "missing voter field: {json}");
    assert!(json.contains("\"weight\":10000"), "missing weight field: {json}");
    assert!(json.contains("\"expiration\":\"2026-05-13T12:00:00\""), "missing expiration: {json}");
}

#[test]
fn to_api_reflects_pushed_operations() {
    let empty_tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new());
    let voted_tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    let before = empty_tx.to_api().expect("empty to_api");
    let after = voted_tx.to_api().expect("voted to_api");

    assert_ne!(before, after, "pushing an op must change the API JSON output");
    assert!(!before.contains("vote_operation"));
    assert!(after.contains("vote_operation"));
}

#[test]
fn to_api_reflects_added_signatures() {
    let mut tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    let before = tx.to_api().expect("to_api before sig");
    tx.add_signature(FAKE_SIG_A).expect("signature accepted");
    let after = tx.to_api().expect("to_api after sig");

    assert_ne!(before, after, "adding a signature must change the API JSON output");
    assert!(after.contains(FAKE_SIG_A), "signature hex must appear in API JSON: {after}");
}

#[test]
fn signature_keys_is_empty_for_unsigned_transaction() {
    let tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    let keys = tx
        .signature_keys(MAINNET_CHAIN_ID)
        .expect("signature_keys should succeed for unsigned tx");

    assert!(keys.is_empty(), "unsigned transaction must yield no signature keys");
}

#[test]
fn signature_keys_skips_chain_id_when_unsigned() {
    let tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    // With no signatures, sig_digest is never computed, so chain_id is not consulted.
    let keys = tx
        .signature_keys("not-hex")
        .expect("signature_keys must not touch chain_id when signatures are empty");

    assert!(keys.is_empty());
}

#[test]
fn signature_keys_fails_for_invalid_chain_id_when_signed() {
    let mut tx = RustTransaction::new(rust_protocol(), 1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));
    tx.add_signature(FAKE_SIG_A).expect("signature accepted");

    assert!(
        tx.signature_keys("not-hex").is_err(),
        "non-hex chain_id must fail once signatures are present"
    );
}

#[test]
fn push_operation_preserves_order_when_chained() {
    let tx = RustTransaction::new(rust_protocol(), 2, 0xdead_beef, "2026-05-13T12:00:00", Vec::new())
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
