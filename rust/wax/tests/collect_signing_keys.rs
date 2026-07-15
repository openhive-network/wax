use std::collections::HashMap;

use wax::models::authority::{AccountAuthorityInfo, Authorities};
use wax::models::basic::HiveDateTime;
use wax::proto::{
    Operation, Transaction as ProtoTransaction, Vote, operation::Value,
};
use wax::{
    AuthorityDataProvider, Transaction, WaxError, create_wax_foundation,
};

fn placeholder_timestamp() -> HiveDateTime {
    // collect_signing_keys ignores owner-update recency, so any valid
    // timestamp will do — mirrors the helper in tests/authority_data_provider.rs.
    HiveDateTime::parse("2020-01-01T00:00:00")
        .expect("static HiveDateTime literal must parse")
}

// Real Hive public keys lifted from canonical wax fixtures
// (python/wax/tests/wax-local-tools/wax_local_tools/consts.py). They must be
// valid base58 because the foundation layer parses them via
// hive::protocol::public_key_type on construction.
const ALICE_POSTING_KEY: &str =
    "STM8MN3FNBa8WbEpxz3wGL3L1mkt6sGnncH8iuto7r8Wa3T9NSSGT";
const BOB_POSTING_KEY: &str =
    "STM8HCf7QLUexogEviN8x1SpKRhFwg2sc8LrWuJqv7QsmWrua6ZyR";

struct InMemoryAuthorityDataProvider {
    accounts: HashMap<String, AccountAuthorityInfo>,
}

impl InMemoryAuthorityDataProvider {
    fn from_posting(entries: &[(&str, &str)]) -> Self {
        let accounts = entries
            .iter()
            .map(|(account, key)| {
                let info = AccountAuthorityInfo {
                    account: (*account).into(),
                    authorities: posting_only(key),
                    memo_key: String::new(),
                    last_owner_update: placeholder_timestamp(),
                    previous_owner_update: placeholder_timestamp(),
                };
                (info.account.clone(), info)
            })
            .collect();
        Self { accounts }
    }
}

impl AuthorityDataProvider for InMemoryAuthorityDataProvider {
    fn get_account_authorities(
        &self,
        account: &str,
    ) -> Result<AccountAuthorityInfo, WaxError> {
        self.accounts.get(account).cloned().ok_or_else(|| {
            WaxError::new(format!("account '{account}' not found"))
        })
    }
}

fn posting_only(key: &str) -> Authorities {
    Authorities {
        owner: None,
        active: None,
        posting: Some(wax::proto::Authority {
            weight_threshold: 1,
            account_auths: HashMap::new(),
            key_auths: HashMap::from([(key.to_string(), 1)]),
        }),
    }
}

fn vote_op(voter: &str) -> Box<dyn wax::Operation> {
    create_wax_foundation(None).create_operation(Value::VoteOperation(Vote {
        voter: voter.into(),
        author: "anyone".into(),
        permlink: "p".into(),
        weight: 10_000,
    }))
}

fn vote_tx(voters: &[&str]) -> Transaction {
    let operations = voters
        .iter()
        .map(|voter| Operation {
            value: Some(Value::VoteOperation(Vote {
                voter: (*voter).into(),
                author: "anyone".into(),
                permlink: "p".into(),
                weight: 10_000,
            })),
        })
        .collect();
    create_wax_foundation(None)
        .create_transaction_from_proto(ProtoTransaction {
            ref_block_num: 42,
            ref_block_prefix: 0xdead_beef,
            expiration: "2026-05-11T12:00:00".into(),
            operations,
            extensions: Vec::new(),
            signatures: Vec::new(),
        })
        .expect("create_transaction_from_proto")
}

#[test]
fn returns_voter_posting_key_for_single_vote() {
    let tx = vote_tx(&["alice"]);
    let provider = InMemoryAuthorityDataProvider::from_posting(&[(
        "alice",
        ALICE_POSTING_KEY,
    )]);

    let keys = tx
        .collect_signing_keys(&provider)
        .expect("collect_signing_keys should succeed for a well-formed vote");

    assert_eq!(keys, vec![ALICE_POSTING_KEY.to_string()]);
}

#[test]
fn returns_distinct_keys_for_multiple_voters() {
    let tx = vote_tx(&["alice", "bob"]);
    let provider = InMemoryAuthorityDataProvider::from_posting(&[
        ("alice", ALICE_POSTING_KEY),
        ("bob", BOB_POSTING_KEY),
    ]);

    let mut keys = tx
        .collect_signing_keys(&provider)
        .expect("collect_signing_keys should succeed for two distinct voters");
    keys.sort();

    let mut expected =
        vec![ALICE_POSTING_KEY.to_string(), BOB_POSTING_KEY.to_string()];
    expected.sort();
    assert_eq!(keys, expected);
}

#[test]
fn dedupes_keys_when_same_voter_appears_multiple_times() {
    let tx = vote_tx(&["alice", "alice"]);
    let provider = InMemoryAuthorityDataProvider::from_posting(&[(
        "alice",
        ALICE_POSTING_KEY,
    )]);

    let keys = tx.collect_signing_keys(&provider).expect(
        "collect_signing_keys should succeed when the same voter appears twice",
    );

    assert_eq!(keys, vec![ALICE_POSTING_KEY.to_string()]);
}

#[test]
fn surfaces_missing_authority_as_error() {
    // The provider knows nothing about alice; the collector must reject
    // because her posting authority is unresolvable.
    let tx = vote_tx(&["alice"]);
    let provider = InMemoryAuthorityDataProvider::from_posting(&[]);

    let err = tx.collect_signing_keys(&provider).expect_err(
        "collect_signing_keys should fail when no authority data is supplied",
    );
    let msg = err.message();
    assert!(
        msg.contains("alice") || msg.to_lowercase().contains("authority"),
        "expected error message to mention the missing authority, got: {msg}"
    );
}

#[test]
fn empty_transaction_has_no_signing_keys() {
    let tx = vote_tx(&[]);
    let provider = InMemoryAuthorityDataProvider::from_posting(&[]);

    let keys = tx.collect_signing_keys(&provider).expect(
        "collect_signing_keys should succeed for tx with no operations",
    );

    assert!(keys.is_empty(), "no ops must yield no signing keys");
}

#[test]
fn provider_can_be_passed_as_trait_object() {
    // Mirrors the AuthorityDataProvider object-safety test — callers that
    // hold the provider behind `dyn` should also work end-to-end.
    let provider = InMemoryAuthorityDataProvider::from_posting(&[(
        "alice",
        ALICE_POSTING_KEY,
    )]);
    let dyn_provider: &dyn AuthorityDataProvider = &provider;

    let mut tx = vote_tx(&[]);
    tx.push_operation(vote_op("alice"));
    let keys = tx
        .collect_signing_keys(dyn_provider)
        .expect("dyn AuthorityDataProvider must work");

    assert_eq!(keys, vec![ALICE_POSTING_KEY.to_string()]);
}
