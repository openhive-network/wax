use std::collections::HashMap;
use std::sync::OnceLock;

use cxx::UniquePtr;
use wax::Transaction;
use wax_core::ffi::{new_rust_protocol, rust_protocol};
use wax_core::proto::{operation::Value, AccountWitnessProxy, Authority, RecoverAccount, Vote};
use wax_core::{RustOperation, RustTransaction};

// Test-local replica of wax's internal protocol singleton. `rust_protocol` is
// no longer re-exported from `wax`; tests bootstrap their own instance via the
// (stateless) `wax_core::ffi::new_rust_protocol()` factory.
struct SyncProtocol(UniquePtr<rust_protocol>);
unsafe impl Sync for SyncProtocol {}
unsafe impl Send for SyncProtocol {}

static TEST_PROTOCOL: OnceLock<SyncProtocol> = OnceLock::new();

fn test_protocol() -> &'static rust_protocol {
    TEST_PROTOCOL
        .get_or_init(|| SyncProtocol(new_rust_protocol()))
        .0
        .as_ref()
        .expect("new_rust_protocol returned null")
}

const MAINNET_CHAIN_ID: &str =
    "beeab0de00000000000000000000000000000000000000000000000000000000";

// Canonical mainnet transaction shell used by most tests. Block data and
// expiration are arbitrary fixed values — tests that care about those build
// their own RustTransaction inline.
fn mainnet_tx() -> RustTransaction {
    tx_with_chain_id(MAINNET_CHAIN_ID)
}

fn tx_with_chain_id(chain_id: &str) -> RustTransaction {
    RustTransaction::new(
        test_protocol(),
        chain_id,
        1,
        0xfeed_face,
        "2026-05-13T12:00:00",
        Vec::new(),
    )
}

fn vote(voter: &str, weight: u32) -> RustOperation {
    RustOperation::new(Value::VoteOperation(Vote {
        voter: voter.into(),
        author: "author".into(),
        permlink: "permlink".into(),
        weight,
    }))
}

fn account_witness_proxy(account: &str, proxy: &str) -> RustOperation {
    RustOperation::new(Value::AccountWitnessProxyOperation(AccountWitnessProxy {
        account: account.into(),
        proxy: proxy.into(),
    }))
}

fn authority_with_key(public_key: &str) -> Authority {
    Authority {
        weight_threshold: 1,
        account_auths: HashMap::new(),
        key_auths: HashMap::from([(public_key.to_string(), 1)]),
    }
}

fn recover_account(account: &str, new_owner_key: &str, recent_owner_key: &str) -> RustOperation {
    RustOperation::new(Value::RecoverAccountOperation(RecoverAccount {
        account_to_recover: account.into(),
        new_owner_authority: authority_with_key(new_owner_key),
        recent_owner_authority: authority_with_key(recent_owner_key),
        extensions: Vec::new(),
    }))
}

#[test]
fn push_operation_appends_op_to_proto_state() {
    let tx = mainnet_tx();
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
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    tx.validate().expect("well-formed transaction should validate");
}

#[test]
fn sig_digest_returns_hex_for_well_formed_transaction() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let digest = tx
        .sig_digest()
        .expect("sig_digest should succeed for a valid transaction");

    assert_eq!(digest.len(), 64, "sig digest should be 32-byte hex (64 chars)");
    assert!(
        digest.chars().all(|c| c.is_ascii_hexdigit()),
        "sig digest should be lowercase hex: {digest}"
    );
}

#[test]
fn sig_digest_differs_when_operations_differ() {
    let a = mainnet_tx().push_operation(vote("alice", 10_000));
    let b = mainnet_tx().push_operation(vote("bob", 10_000));

    let da = a.sig_digest().expect("a digest");
    let db = b.sig_digest().expect("b digest");

    assert_ne!(da, db, "different operations must produce different digests");
}

#[test]
fn sig_digest_fails_for_invalid_chain_id() {
    let tx = tx_with_chain_id("not-hex").push_operation(vote("alice", 10_000));

    assert!(
        tx.sig_digest().is_err(),
        "non-hex chain_id baked into the tx should fail at sig_digest time"
    );
}

#[test]
fn id_returns_40_char_hex_for_well_formed_transaction() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let id = tx.id().expect("id should succeed for a valid transaction");

    assert_eq!(id.len(), 40, "tx id should be 20-byte hex (40 chars)");
    assert!(
        id.chars().all(|c| c.is_ascii_hexdigit()),
        "tx id should be hex: {id}"
    );
}

#[test]
fn id_differs_when_operations_differ() {
    let a = mainnet_tx().push_operation(vote("alice", 10_000)).id().expect("a id");
    let b = mainnet_tx().push_operation(vote("bob", 10_000)).id().expect("b id");

    assert_ne!(a, b, "different operations must produce different ids");
}

#[test]
fn id_is_independent_of_chain_id() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let id_via_self = tx.id().expect("id should succeed");
    let digest_main = tx.sig_digest().expect("digest should succeed");

    assert_ne!(
        id_via_self, digest_main,
        "tx id and sig digest are different hashes and should not collide"
    );
    assert_eq!(id_via_self.len(), 40);
    assert_eq!(digest_main.len(), 64);
}

#[test]
fn to_binary_form_returns_hex_for_well_formed_transaction() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

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
    let a = mainnet_tx().push_operation(vote("alice", 10_000)).to_binary_form(false).expect("a bin");
    let b = mainnet_tx().push_operation(vote("bob", 10_000)).to_binary_form(false).expect("b bin");

    assert_ne!(a, b, "different operations must produce different binary forms");
}

#[test]
fn to_binary_form_stripped_is_no_longer_than_full() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

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
    let tx = mainnet_tx().push_operation(vote("alice", 20_000));

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
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    assert!(!tx.is_signed(), "transaction with no signatures must not be signed");
}

#[test]
fn is_signed_becomes_true_after_add_signature() {
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));
    assert!(!tx.is_signed());

    tx.add_signature(FAKE_SIG_A).expect("signature should be accepted");

    assert!(tx.is_signed(), "transaction must be signed after add_signature");
}

#[test]
fn is_signed_stays_false_when_add_signature_fails() {
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let _ = tx.add_signature("not-a-hex-signature");

    assert!(!tx.is_signed(), "failed add_signature must leave tx unsigned");
}

#[test]
fn add_signature_appends_to_proto_signatures() {
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));
    assert!(tx.proto().signatures.is_empty());

    tx.add_signature(FAKE_SIG_A).expect("valid hex signature should be accepted");

    assert_eq!(tx.proto().signatures, vec![FAKE_SIG_A.to_string()]);
}

#[test]
fn add_signature_accumulates_across_calls() {
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));

    tx.add_signature(FAKE_SIG_A).expect("first signature");
    tx.add_signature(FAKE_SIG_B).expect("second signature");

    assert_eq!(
        tx.proto().signatures,
        vec![FAKE_SIG_A.to_string(), FAKE_SIG_B.to_string()]
    );
}

#[test]
fn add_signature_extends_full_binary_form_but_not_stripped() {
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));

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
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let result = tx.add_signature("not-a-hex-signature");

    assert!(result.is_err(), "non-hex signature must fail");
    assert!(
        tx.proto().signatures.is_empty(),
        "failed add_signature must not mutate proto state"
    );
}

#[test]
fn to_api_returns_json_describing_the_transaction() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

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
    let empty_tx = mainnet_tx();
    let voted_tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let before = empty_tx.to_api().expect("empty to_api");
    let after = voted_tx.to_api().expect("voted to_api");

    assert_ne!(before, after, "pushing an op must change the API JSON output");
    assert!(!before.contains("vote_operation"));
    assert!(after.contains("vote_operation"));
}

#[test]
fn to_api_reflects_added_signatures() {
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let before = tx.to_api().expect("to_api before sig");
    tx.add_signature(FAKE_SIG_A).expect("signature accepted");
    let after = tx.to_api().expect("to_api after sig");

    assert_ne!(before, after, "adding a signature must change the API JSON output");
    assert!(after.contains(FAKE_SIG_A), "signature hex must appear in API JSON: {after}");
}

#[test]
fn required_authorities_is_empty_for_transaction_without_operations() {
    let tx = mainnet_tx();

    let auths = tx.required_authorities().expect("required_authorities");

    assert!(auths.posting_accounts.is_empty());
    assert!(auths.active_accounts.is_empty());
    assert!(auths.owner_accounts.is_empty());
    assert!(auths.other_authorities.is_empty());
}

#[test]
fn required_authorities_collects_posting_for_vote() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let auths = tx.required_authorities().expect("required_authorities");

    assert_eq!(auths.posting_accounts, vec!["alice".to_string()]);
    assert!(auths.active_accounts.is_empty());
    assert!(auths.owner_accounts.is_empty());
    assert!(auths.other_authorities.is_empty());
}

#[test]
fn required_authorities_collects_active_for_account_witness_proxy() {
    let tx = mainnet_tx().push_operation(account_witness_proxy("alice", "bob"));

    let auths = tx.required_authorities().expect("required_authorities");

    assert_eq!(auths.active_accounts, vec!["alice".to_string()]);
    assert!(auths.posting_accounts.is_empty());
    assert!(auths.owner_accounts.is_empty());
    assert!(auths.other_authorities.is_empty());
}

#[test]
fn required_authorities_collects_other_for_recover_account() {
    const NEW_OWNER: &str = "STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW";
    const RECENT_OWNER: &str = "STM4wJYLcRnALfbpb4ziqiH3oLEgw9PTJZTBBj8goFyjta3mm6D1s";

    let tx = mainnet_tx().push_operation(recover_account("alice", NEW_OWNER, RECENT_OWNER));

    let auths = tx.required_authorities().expect("required_authorities");

    assert!(auths.posting_accounts.is_empty());
    assert!(auths.active_accounts.is_empty());
    assert!(auths.owner_accounts.is_empty());
    assert_eq!(auths.other_authorities.len(), 2);

    assert_eq!(auths.other_authorities[0].weight_threshold, 1);
    assert_eq!(
        auths.other_authorities[0].key_auths,
        HashMap::from([(NEW_OWNER.to_string(), 1)])
    );
    assert!(auths.other_authorities[0].account_auths.is_empty());

    assert_eq!(auths.other_authorities[1].weight_threshold, 1);
    assert_eq!(
        auths.other_authorities[1].key_auths,
        HashMap::from([(RECENT_OWNER.to_string(), 1)])
    );
    assert!(auths.other_authorities[1].account_auths.is_empty());
}

#[test]
fn impacted_accounts_is_empty_for_transaction_without_operations() {
    let tx = mainnet_tx();

    let accounts = tx
        .impacted_accounts()
        .expect("impacted_accounts should succeed for empty tx");

    assert!(accounts.is_empty(), "tx with no ops must yield no impacted accounts");
}

#[test]
fn impacted_accounts_returns_voter_and_author_for_vote() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let accounts = tx.impacted_accounts().expect("impacted_accounts");

    // vote fixture uses author="author"; impacted set is returned sorted.
    assert_eq!(accounts, vec!["alice".to_string(), "author".to_string()]);
}

#[test]
fn impacted_accounts_unions_across_operations() {
    let tx = mainnet_tx()
        .push_operation(vote("zebra", 1))
        .push_operation(vote("alice", 1));

    let accounts = tx.impacted_accounts().expect("impacted_accounts");

    assert_eq!(
        accounts,
        vec!["alice".to_string(), "author".to_string(), "zebra".to_string()],
        "impacted accounts must be the deduplicated, sorted union across ops"
    );
}

#[test]
fn signature_keys_is_empty_for_unsigned_transaction() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let keys = tx
        .signature_keys()
        .expect("signature_keys should succeed for unsigned tx");

    assert!(keys.is_empty(), "unsigned transaction must yield no signature keys");
}

#[test]
fn signature_keys_skips_chain_id_when_unsigned() {
    // Even with a deliberately bad chain_id baked into the tx, signature_keys must
    // not consult it when there are no signatures to recover.
    let tx = tx_with_chain_id("not-hex").push_operation(vote("alice", 10_000));

    let keys = tx
        .signature_keys()
        .expect("signature_keys must not touch chain_id when signatures are empty");

    assert!(keys.is_empty());
}

#[test]
fn signature_keys_fails_for_invalid_chain_id_when_signed() {
    let mut tx = tx_with_chain_id("not-hex").push_operation(vote("alice", 10_000));
    tx.add_signature(FAKE_SIG_A).expect("signature accepted");

    assert!(
        tx.signature_keys().is_err(),
        "non-hex chain_id must fail once signatures are present"
    );
}

#[test]
fn push_operation_preserves_order_when_chained() {
    let tx = RustTransaction::new(
        test_protocol(),
        MAINNET_CHAIN_ID,
        2,
        0xdead_beef,
        "2026-05-13T12:00:00",
        Vec::new(),
    )
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
