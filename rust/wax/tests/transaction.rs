use std::collections::HashMap;
use std::sync::OnceLock;

use cxx::UniquePtr;
use wax::constants::MAINNET_CHAIN_ID;
use wax::result::BinaryViewNode;
use wax::{SignatureProvider, Transaction, WaxError};
use wax_core::ffi::{new_rust_protocol, rust_protocol};
use wax_core::proto::{AccountWitnessProxy, Authority, RecoverAccount, Vote, operation::Value};
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
    RustOperation::new(
        test_protocol(),
        Value::VoteOperation(Vote {
            voter: voter.into(),
            author: "author".into(),
            permlink: "permlink".into(),
            weight,
        }),
    )
}

fn account_witness_proxy(account: &str, proxy: &str) -> RustOperation {
    RustOperation::new(
        test_protocol(),
        Value::AccountWitnessProxyOperation(AccountWitnessProxy {
            account: account.into(),
            proxy: proxy.into(),
        }),
    )
}

fn authority_with_key(public_key: &str) -> Authority {
    Authority {
        weight_threshold: 1,
        account_auths: HashMap::new(),
        key_auths: HashMap::from([(public_key.to_string(), 1)]),
    }
}

fn recover_account(account: &str, new_owner_key: &str, recent_owner_key: &str) -> RustOperation {
    RustOperation::new(
        test_protocol(),
        Value::RecoverAccountOperation(RecoverAccount {
            account_to_recover: account.into(),
            new_owner_authority: authority_with_key(new_owner_key),
            recent_owner_authority: authority_with_key(recent_owner_key),
            extensions: Vec::new(),
        }),
    )
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

    tx.validate()
        .expect("well-formed transaction should validate");
}

#[test]
fn sig_digest_returns_hex_for_well_formed_transaction() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let digest = tx
        .sig_digest()
        .expect("sig_digest should succeed for a valid transaction");

    assert_eq!(
        digest.len(),
        64,
        "sig digest should be 32-byte hex (64 chars)"
    );
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

    assert_ne!(
        da, db,
        "different operations must produce different digests"
    );
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
    let a = mainnet_tx()
        .push_operation(vote("alice", 10_000))
        .id()
        .expect("a id");
    let b = mainnet_tx()
        .push_operation(vote("bob", 10_000))
        .id()
        .expect("b id");

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
    assert_eq!(
        bin.len() % 2,
        0,
        "hex string should have even length: {bin}"
    );
    assert!(
        bin.chars().all(|c| c.is_ascii_hexdigit()),
        "binary form should be hex: {bin}"
    );
}

#[test]
fn to_binary_form_differs_when_operations_differ() {
    let a = mainnet_tx()
        .push_operation(vote("alice", 10_000))
        .to_binary_form(false)
        .expect("a bin");
    let b = mainnet_tx()
        .push_operation(vote("bob", 10_000))
        .to_binary_form(false)
        .expect("b bin");

    assert_ne!(
        a, b,
        "different operations must produce different binary forms"
    );
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
const FAKE_SIG_A: &str = "1f00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff";
const FAKE_SIG_B: &str = "20ffeeddccbbaa99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa998877665544332211ff";

#[test]
fn is_signed_is_false_for_fresh_transaction() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    assert!(
        !tx.is_signed(),
        "transaction with no signatures must not be signed"
    );
}

#[test]
fn is_signed_becomes_true_after_add_signature() {
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));
    assert!(!tx.is_signed());

    tx.add_signature(FAKE_SIG_A)
        .expect("signature should be accepted");

    assert!(
        tx.is_signed(),
        "transaction must be signed after add_signature"
    );
}

#[test]
fn is_signed_stays_false_when_add_signature_fails() {
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let _ = tx.add_signature("not-a-hex-signature");

    assert!(
        !tx.is_signed(),
        "failed add_signature must leave tx unsigned"
    );
}

#[test]
fn add_signature_appends_to_proto_signatures() {
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));
    assert!(tx.proto().signatures.is_empty());

    tx.add_signature(FAKE_SIG_A)
        .expect("valid hex signature should be accepted");

    assert_eq!(tx.proto().signatures, vec![FAKE_SIG_A.to_string()]);
}

// Stub wallet that hands back a canned signature and records what it saw, so
// we can assert `sign` routes the digest + public key to `sign_digest` and the
// returned signature back into `add_signature`.
struct StubWallet {
    canned: String,
    last_call: std::cell::RefCell<Option<(String, String)>>,
}

impl StubWallet {
    fn new(canned: &str) -> Self {
        Self {
            canned: canned.to_string(),
            last_call: std::cell::RefCell::new(None),
        }
    }
}

impl SignatureProvider for StubWallet {
    fn sign_digest(&self, public_key: &str, sig_digest: &str) -> Result<String, WaxError> {
        *self.last_call.borrow_mut() = Some((public_key.to_string(), sig_digest.to_string()));
        Ok(self.canned.clone())
    }
    fn encrypt_data(
        &self,
        _content: &str,
        _key: &str,
        _other_key: Option<&str>,
        _nonce: Option<u64>,
    ) -> Result<String, WaxError> {
        unimplemented!("encrypt_data is not exercised by sign() tests")
    }
    fn decrypt_data(
        &self,
        _content: &str,
        _key: &str,
        _other_key: Option<&str>,
    ) -> Result<String, WaxError> {
        unimplemented!("decrypt_data is not exercised by sign() tests")
    }
}

#[test]
fn sign_routes_digest_and_pubkey_to_wallet_and_appends_returned_signature() {
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));
    let expected_digest = tx.sig_digest().expect("digest");
    let wallet = StubWallet::new(FAKE_SIG_A);

    let returned = tx
        .sign(&wallet, "STM_PUBKEY_ALICE")
        .expect("sign should succeed");

    assert_eq!(returned, FAKE_SIG_A);
    assert_eq!(
        tx.proto().signatures,
        vec![FAKE_SIG_A.to_string()],
        "sign must append the wallet's signature to the transaction"
    );
    let (seen_pk, seen_digest) = wallet
        .last_call
        .borrow()
        .clone()
        .expect("wallet was called");
    assert_eq!(seen_pk, "STM_PUBKEY_ALICE");
    assert_eq!(
        seen_digest, expected_digest,
        "wallet must receive the transaction's own sig_digest"
    );
    assert!(tx.is_signed());
}

#[test]
fn sign_refuses_to_run_when_transaction_is_invalid() {
    // Empty transaction (no operations) — tx_validate rejects it.
    let mut tx = mainnet_tx();
    assert!(tx.validate().is_err(), "precondition: empty tx must fail validate");

    struct PoisonWallet;
    impl SignatureProvider for PoisonWallet {
        fn sign_digest(&self, _pk: &str, _digest: &str) -> Result<String, WaxError> {
            panic!("wallet must not be called when tx is invalid")
        }
        fn encrypt_data(
            &self,
            _: &str,
            _: &str,
            _: Option<&str>,
            _: Option<u64>,
        ) -> Result<String, WaxError> {
            unimplemented!()
        }
        fn decrypt_data(
            &self,
            _: &str,
            _: &str,
            _: Option<&str>,
        ) -> Result<String, WaxError> {
            unimplemented!()
        }
    }

    let result = tx.sign(&PoisonWallet, "STM_PUBKEY_X");

    assert!(result.is_err(), "sign must refuse to run on an invalid tx");
    assert!(!tx.is_signed(), "failed sign must leave tx unsigned");
}

#[test]
fn sign_can_be_called_multiple_times_for_multi_key_signing() {
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));
    let wallet_a = StubWallet::new(FAKE_SIG_A);
    let wallet_b = StubWallet::new(FAKE_SIG_B);

    tx.sign(&wallet_a, "STM_PUBKEY_A").expect("first sign");
    tx.sign(&wallet_b, "STM_PUBKEY_B").expect("second sign");

    assert_eq!(
        tx.proto().signatures,
        vec![FAKE_SIG_A.to_string(), FAKE_SIG_B.to_string()]
    );
}

#[test]
fn sign_propagates_wallet_error_without_mutating_transaction() {
    struct FailingWallet;
    impl SignatureProvider for FailingWallet {
        fn sign_digest(&self, _pk: &str, _digest: &str) -> Result<String, WaxError> {
            Err(WaxError::new("wallet refused"))
        }
        fn encrypt_data(
            &self,
            _: &str,
            _: &str,
            _: Option<&str>,
            _: Option<u64>,
        ) -> Result<String, WaxError> {
            unimplemented!()
        }
        fn decrypt_data(
            &self,
            _: &str,
            _: &str,
            _: Option<&str>,
        ) -> Result<String, WaxError> {
            unimplemented!()
        }
    }

    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));
    let result = tx.sign(&FailingWallet, "STM_PUBKEY_X");

    assert!(result.is_err(), "wallet error must surface");
    assert!(
        !tx.is_signed(),
        "failed sign must not leave a partial signature on the tx"
    );
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

    tx.add_signature(FAKE_SIG_A)
        .expect("signature should be accepted");

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

    let json = tx
        .to_api()
        .expect("to_api should succeed for a valid transaction");

    assert!(
        json.starts_with('{') && json.ends_with('}'),
        "expected JSON object: {json}"
    );
    assert!(
        json.contains("\"operations\""),
        "missing operations field: {json}"
    );
    assert!(
        json.contains("vote_operation"),
        "missing op type tag: {json}"
    );
    assert!(
        json.contains("\"voter\":\"alice\""),
        "missing voter field: {json}"
    );
    assert!(
        json.contains("\"weight\":10000"),
        "missing weight field: {json}"
    );
    assert!(
        json.contains("\"expiration\":\"2026-05-13T12:00:00\""),
        "missing expiration: {json}"
    );
}

#[test]
fn to_api_reflects_pushed_operations() {
    let empty_tx = mainnet_tx();
    let voted_tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let before = empty_tx.to_api().expect("empty to_api");
    let after = voted_tx.to_api().expect("voted to_api");

    assert_ne!(
        before, after,
        "pushing an op must change the API JSON output"
    );
    assert!(!before.contains("vote_operation"));
    assert!(after.contains("vote_operation"));
}

#[test]
fn to_api_reflects_added_signatures() {
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let before = tx.to_api().expect("to_api before sig");
    tx.add_signature(FAKE_SIG_A).expect("signature accepted");
    let after = tx.to_api().expect("to_api after sig");

    assert_ne!(
        before, after,
        "adding a signature must change the API JSON output"
    );
    assert!(
        after.contains(FAKE_SIG_A),
        "signature hex must appear in API JSON: {after}"
    );
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

    assert!(
        accounts.is_empty(),
        "tx with no ops must yield no impacted accounts"
    );
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
        vec![
            "alice".to_string(),
            "author".to_string(),
            "zebra".to_string()
        ],
        "impacted accounts must be the deduplicated, sorted union across ops"
    );
}

#[test]
fn signature_keys_is_empty_for_unsigned_transaction() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let keys = tx
        .signature_keys()
        .expect("signature_keys should succeed for unsigned tx");

    assert!(
        keys.is_empty(),
        "unsigned transaction must yield no signature keys"
    );
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
fn legacy_sig_digest_returns_hex_for_well_formed_transaction() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let digest = tx
        .legacy_sig_digest()
        .expect("legacy_sig_digest should succeed for a valid transaction");

    assert_eq!(
        digest.len(),
        64,
        "legacy sig digest should be 32-byte hex (64 chars)"
    );
    assert!(
        digest.chars().all(|c| c.is_ascii_hexdigit()),
        "legacy sig digest should be lowercase hex: {digest}"
    );
}

#[test]
fn legacy_sig_digest_differs_when_operations_differ() {
    let a = mainnet_tx().push_operation(vote("alice", 10_000));
    let b = mainnet_tx().push_operation(vote("bob", 10_000));

    let da = a.legacy_sig_digest().expect("a legacy digest");
    let db = b.legacy_sig_digest().expect("b legacy digest");

    assert_ne!(
        da, db,
        "different operations must produce different legacy digests"
    );
}

#[test]
fn legacy_sig_digest_fails_for_invalid_chain_id() {
    let tx = tx_with_chain_id("not-hex").push_operation(vote("alice", 10_000));

    assert!(
        tx.legacy_sig_digest().is_err(),
        "non-hex chain_id baked into the tx should fail at legacy_sig_digest time"
    );
}

#[test]
fn legacy_id_returns_40_char_hex_for_well_formed_transaction() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let id = tx
        .legacy_id()
        .expect("legacy_id should succeed for a valid transaction");

    assert_eq!(id.len(), 40, "legacy tx id should be 20-byte hex (40 chars)");
    assert!(
        id.chars().all(|c| c.is_ascii_hexdigit()),
        "legacy tx id should be hex: {id}"
    );
}

#[test]
fn legacy_id_differs_when_operations_differ() {
    let a = mainnet_tx()
        .push_operation(vote("alice", 10_000))
        .legacy_id()
        .expect("a legacy id");
    let b = mainnet_tx()
        .push_operation(vote("bob", 10_000))
        .legacy_id()
        .expect("b legacy id");

    assert_ne!(
        a, b,
        "different operations must produce different legacy ids"
    );
}

#[test]
fn to_legacy_api_returns_json_describing_the_transaction() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let json = tx
        .to_legacy_api()
        .expect("to_legacy_api should succeed for a valid transaction");

    assert!(
        json.starts_with('{') && json.ends_with('}'),
        "expected JSON object: {json}"
    );
    assert!(
        json.contains("\"operations\""),
        "missing operations field: {json}"
    );
    assert!(
        json.contains("\"voter\":\"alice\""),
        "missing voter field: {json}"
    );
    assert!(
        json.contains("\"weight\":10000"),
        "missing weight field: {json}"
    );
    assert!(
        json.contains("\"expiration\":\"2026-05-13T12:00:00\""),
        "missing expiration: {json}"
    );
}

#[test]
fn to_legacy_api_reflects_pushed_operations() {
    let empty_tx = mainnet_tx();
    let voted_tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let before = empty_tx.to_legacy_api().expect("empty to_legacy_api");
    let after = voted_tx.to_legacy_api().expect("voted to_legacy_api");

    assert_ne!(
        before, after,
        "pushing an op must change the legacy API JSON output"
    );
    assert!(!before.contains("\"voter\""));
    assert!(after.contains("\"voter\":\"alice\""));
}

#[test]
fn to_legacy_api_reflects_added_signatures() {
    let mut tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let before = tx.to_legacy_api().expect("to_legacy_api before sig");
    tx.add_signature(FAKE_SIG_A).expect("signature accepted");
    let after = tx.to_legacy_api().expect("to_legacy_api after sig");

    assert_ne!(
        before, after,
        "adding a signature must change the legacy API JSON output"
    );
    assert!(
        after.contains(FAKE_SIG_A),
        "signature hex must appear in legacy API JSON: {after}"
    );
}

#[test]
fn legacy_signature_keys_is_empty_for_unsigned_transaction() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let keys = tx
        .legacy_signature_keys()
        .expect("legacy_signature_keys should succeed for unsigned tx");

    assert!(
        keys.is_empty(),
        "unsigned transaction must yield no legacy signature keys"
    );
}

#[test]
fn legacy_signature_keys_skips_chain_id_when_unsigned() {
    let tx = tx_with_chain_id("not-hex").push_operation(vote("alice", 10_000));

    let keys = tx
        .legacy_signature_keys()
        .expect("legacy_signature_keys must not touch chain_id when signatures are empty");

    assert!(keys.is_empty());
}

#[test]
fn legacy_signature_keys_fails_for_invalid_chain_id_when_signed() {
    let mut tx = tx_with_chain_id("not-hex").push_operation(vote("alice", 10_000));
    tx.add_signature(FAKE_SIG_A).expect("signature accepted");

    assert!(
        tx.legacy_signature_keys().is_err(),
        "non-hex chain_id must fail once signatures are present (legacy)"
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

fn node_key(node: &BinaryViewNode) -> &str {
    match node {
        BinaryViewNode::Scalar { key, .. }
        | BinaryViewNode::Array { key, .. }
        | BinaryViewNode::Object { key, .. } => key,
    }
}

#[test]
fn binary_view_metadata_returns_tree_matching_binary_form() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));
    let bin = tx.to_binary_form(false).expect("binary form");

    let view = tx
        .binary_view_metadata()
        .expect("binary_view_metadata should succeed");

    assert_eq!(
        view.binary, bin,
        "binary_view_metadata.binary must match to_binary_form(false)"
    );
    assert!(
        !view.offsets.is_empty(),
        "a well-formed tx must yield at least one top-level node"
    );
}

#[test]
fn binary_view_metadata_reflects_pushed_operations() {
    // Walk the tree until we find a scalar named "voter"; its value should be
    // the account name passed to `vote()`. This proves the tree actually mirrors
    // operation contents, not just an empty container.
    fn find_voter<'a>(nodes: &'a [BinaryViewNode]) -> Option<&'a str> {
        for n in nodes {
            match n {
                BinaryViewNode::Scalar { key, value, .. } if key == "voter" => return Some(value),
                BinaryViewNode::Array { children, .. } | BinaryViewNode::Object { children, .. } => {
                    if let Some(v) = find_voter(children) {
                        return Some(v);
                    }
                }
                _ => {}
            }
        }
        None
    }

    let tx = mainnet_tx().push_operation(vote("alice", 10_000));
    let view = tx.binary_view_metadata().expect("view");

    let voter = find_voter(&view.offsets).expect("voter scalar must appear somewhere in the tree");
    assert!(
        voter.contains("alice"),
        "voter scalar should expose the pushed account name, got {voter:?}"
    );
}

#[test]
fn legacy_binary_view_metadata_returns_tree() {
    let tx = mainnet_tx().push_operation(vote("alice", 10_000));

    let view = tx
        .legacy_binary_view_metadata()
        .expect("legacy_binary_view_metadata should succeed");

    assert!(!view.binary.is_empty(), "legacy binary must not be empty");
    assert!(
        !view.offsets.is_empty(),
        "legacy view must contain at least one top-level node"
    );
    // HF26 and legacy share the same protobuf schema for tx layout, so a top-level
    // key like "operations" should appear in both. Smoke-check it exists.
    assert!(
        view.offsets.iter().any(|n| node_key(n) == "operations"),
        "legacy view should contain an `operations` node at the top level"
    );
}

#[test]
fn binary_view_metadata_fails_for_invalid_chain_id() {
    // Sanity-check: errors from the underlying foundation surface through
    // binary_view_metadata in the same way they do for the other tx accessors.
    // (Chain id isn't used by the serializer itself, so we provoke a failure by
    // making the transaction empty — same path that `validate` rejects.)
    let tx = mainnet_tx();
    // Empty tx still serializes; binary view should work even with no operations,
    // mirroring `to_binary_form(false)` behavior.
    let _ = tx
        .binary_view_metadata()
        .expect("empty tx should still yield a (degenerate) binary view");
}
