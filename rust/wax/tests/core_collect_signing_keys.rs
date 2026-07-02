use std::collections::HashMap;

use cxx::UniquePtr;
use wax::core::ffi::{
    RustAccountAuthorities, RustAuthEntry, RustWaxAuthorities, RustWaxAuthority,
};
use wax::core::proto::{Operation, Vote, operation::Value};
use wax::core::{
    AuthorityProvider, RustAuthorityProvider, RustTransaction,
    new_rust_protocol, rust_protocol,
};

// Real Hive public keys lifted from the canonical wax fixtures
// (python/wax/tests/wax-local-tools/wax_local_tools/consts.py). They have to
// be valid base58 because the foundation layer routes them through
// hive::protocol::public_key_type, which parses on construction.
const ALICE_POSTING_KEY: &str =
    "STM8MN3FNBa8WbEpxz3wGL3L1mkt6sGnncH8iuto7r8Wa3T9NSSGT";
const BOB_POSTING_KEY: &str =
    "STM8HCf7QLUexogEviN8x1SpKRhFwg2sc8LrWuJqv7QsmWrua6ZyR";

// Maps account name -> posting key. The provider rebuilds a fresh
// `RustWaxAuthorities` on each lookup to sidestep the bridge structs not
// deriving `Clone`.
struct InMemoryAuthorityProvider {
    posting_keys: HashMap<String, String>,
}

impl AuthorityProvider for InMemoryAuthorityProvider {
    fn get_authorities(
        &self,
        accounts: Vec<String>,
    ) -> Vec<RustAccountAuthorities> {
        accounts
            .into_iter()
            .filter_map(|account| {
                self.posting_keys.get(&account).map(|key| {
                    RustAccountAuthorities {
                        account,
                        authorities: posting_only(key),
                    }
                })
            })
            .collect()
    }

    fn get_witness_public_key(&self, _witness: String) -> String {
        String::new()
    }
}

fn empty_authority() -> RustWaxAuthority {
    RustWaxAuthority {
        weight_threshold: 0,
        account_auths: Vec::new(),
        key_auths: Vec::new(),
    }
}

fn single_key_authority(key: &str) -> RustWaxAuthority {
    RustWaxAuthority {
        weight_threshold: 1,
        account_auths: Vec::new(),
        key_auths: vec![RustAuthEntry {
            name: key.into(),
            weight: 1,
        }],
    }
}

fn posting_only(key: &str) -> RustWaxAuthorities {
    RustWaxAuthorities {
        owner: empty_authority(),
        active: empty_authority(),
        posting: single_key_authority(key),
    }
}

fn build_vote_transaction(
    voters: &[&str],
) -> (UniquePtr<rust_protocol>, RustTransaction) {
    let protocol = new_rust_protocol();
    let ops = voters
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
    let tx = RustTransaction::new(
        protocol.as_ref().unwrap(),
        "beeab0de00000000000000000000000000000000000000000000000000000000",
        42,
        0xdead_beef,
        "2026-05-11T12:00:00",
        ops,
    );
    (protocol, tx)
}

fn provider_for(entries: &[(&str, &str)]) -> Box<RustAuthorityProvider> {
    let posting_keys = entries
        .iter()
        .map(|(account, key)| ((*account).to_string(), (*key).to_string()))
        .collect();
    RustAuthorityProvider::new(Box::new(InMemoryAuthorityProvider {
        posting_keys,
    }))
}

#[test]
fn returns_voter_posting_key_for_single_vote() {
    let (protocol, tx) = build_vote_transaction(&["alice"]);
    let provider = provider_for(&[("alice", ALICE_POSTING_KEY)]);

    let keys = protocol
        .cpp_tx_collect_signing_keys(&tx.handle, &provider)
        .expect("collect_signing_keys should succeed for a well-formed vote");

    assert_eq!(keys, vec![ALICE_POSTING_KEY.to_string()]);
}

#[test]
fn returns_distinct_keys_for_multiple_voters() {
    let (protocol, tx) = build_vote_transaction(&["alice", "bob"]);
    let provider =
        provider_for(&[("alice", ALICE_POSTING_KEY), ("bob", BOB_POSTING_KEY)]);

    let mut keys = protocol
        .cpp_tx_collect_signing_keys(&tx.handle, &provider)
        .expect("collect_signing_keys should succeed for two distinct voters");
    keys.sort();

    let mut expected =
        vec![ALICE_POSTING_KEY.to_string(), BOB_POSTING_KEY.to_string()];
    expected.sort();
    assert_eq!(keys, expected);
}

#[test]
fn dedupes_keys_when_same_voter_appears_multiple_times() {
    let (protocol, tx) = build_vote_transaction(&["alice", "alice"]);
    let provider = provider_for(&[("alice", ALICE_POSTING_KEY)]);

    let keys = protocol
        .cpp_tx_collect_signing_keys(&tx.handle, &provider)
        .expect("collect_signing_keys should succeed when the same voter appears twice");

    assert_eq!(keys, vec![ALICE_POSTING_KEY.to_string()]);
}

#[test]
fn surfaces_missing_authority_as_error() {
    // The provider returns nothing for any account; the collector must reject
    // because alice's posting authority is unresolvable.
    let (protocol, tx) = build_vote_transaction(&["alice"]);
    let provider = provider_for(&[]);

    let err = protocol
        .cpp_tx_collect_signing_keys(&tx.handle, &provider)
        .expect_err("collect_signing_keys should fail when no authority data is supplied");
    let msg = err.to_string();
    assert!(
        msg.contains("alice") || msg.to_lowercase().contains("authority"),
        "expected error message to mention the missing authority, got: {msg}"
    );
}
