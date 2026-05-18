use std::collections::HashMap;

use wax::models::authority::{AccountAuthorityInfo, Authorities};
use wax::{AuthorityDataProvider, WaxError};
use wax_core::proto;

/// Test-only in-memory provider. Returns the stored info for known accounts,
/// and a WaxError ("account '<name>' not found") for unknown accounts —
/// mirroring Python's AccountNotFoundError semantics.
struct InMemoryAuthorityDataProvider {
    accounts: HashMap<String, AccountAuthorityInfo>,
}

impl InMemoryAuthorityDataProvider {
    fn new() -> Self {
        Self {
            accounts: HashMap::new(),
        }
    }

    fn insert(&mut self, info: AccountAuthorityInfo) {
        self.accounts.insert(info.account.clone(), info);
    }
}

impl AuthorityDataProvider for InMemoryAuthorityDataProvider {
    fn get_account_authorities(&self, account: &str) -> Result<AccountAuthorityInfo, WaxError> {
        self.accounts
            .get(account)
            .cloned()
            .ok_or_else(|| WaxError::new(format!("account '{account}' not found")))
    }
}

fn authority_with_key(key: &str, weight: u32) -> proto::Authority {
    proto::Authority {
        weight_threshold: weight,
        account_auths: HashMap::new(),
        key_auths: HashMap::from([(key.to_string(), weight)]),
    }
}

fn alice_info() -> AccountAuthorityInfo {
    AccountAuthorityInfo {
        account: "alice".into(),
        authorities: Authorities {
            owner: Some(authority_with_key("STM-owner-key", 1)),
            active: Some(authority_with_key("STM-active-key", 1)),
            posting: Some(authority_with_key("STM-posting-key", 1)),
        },
        memo_key: "STM-memo-key".into(),
    }
}

#[test]
fn returns_stored_authorities_for_known_account() {
    let mut provider = InMemoryAuthorityDataProvider::new();
    let expected = alice_info();
    provider.insert(expected.clone());

    let info = provider
        .get_account_authorities("alice")
        .expect("known account must resolve");

    assert_eq!(info, expected);
}

#[test]
fn errors_for_unknown_account() {
    let provider = InMemoryAuthorityDataProvider::new();

    let err = provider
        .get_account_authorities("ghost")
        .expect_err("unknown account must error");

    assert!(
        err.message().contains("ghost"),
        "error message should mention the account: {}",
        err.message()
    );
}

#[test]
fn supports_sparse_authorities() {
    // Some accounts on chain have only some of the three roles set (e.g., posting-only
    // accounts in older proxies). The Authorities struct must represent that.
    let mut provider = InMemoryAuthorityDataProvider::new();
    provider.insert(AccountAuthorityInfo {
        account: "posting-only".into(),
        authorities: Authorities {
            owner: None,
            active: None,
            posting: Some(authority_with_key("STM-posting-only-key", 1)),
        },
        memo_key: "STM-posting-only-memo-key".into(),
    });

    let info = provider
        .get_account_authorities("posting-only")
        .expect("known account must resolve");

    assert!(info.authorities.owner.is_none());
    assert!(info.authorities.active.is_none());
    let posting = info.authorities.posting.expect("posting present");
    assert_eq!(posting.weight_threshold, 1);
    assert_eq!(posting.key_auths.len(), 1);
}

#[test]
fn empty_authorities_is_default() {
    // An account with no authorities at all is representable. This mostly verifies
    // that Authorities::default() is the "everything None" state, which is what
    // callers will lean on when building up provider state in tests.
    let empty = Authorities::default();
    assert!(empty.owner.is_none());
    assert!(empty.active.is_none());
    assert!(empty.posting.is_none());
}

#[test]
fn trait_is_object_safe() {
    // Future callers will hold this trait as &dyn AuthorityDataProvider (e.g., a
    // complex_operations port that doesn't care which backend is plugged in).
    // If a non-object-safe method ever gets added, this test will fail to compile.
    let mut provider = InMemoryAuthorityDataProvider::new();
    provider.insert(alice_info());

    let dyn_provider: &dyn AuthorityDataProvider = &provider;
    let info = dyn_provider
        .get_account_authorities("alice")
        .expect("known account must resolve through dyn");
    assert_eq!(info.account, "alice");
}
