//! Authority models: the role authorities of an account and the set of
//! authorities a transaction requires.

use std::collections::HashMap;

use crate::core::proto;

use crate::base::models::basic::{AccountName, HiveDateTime, PublicKey};

/// Represents an authority (weight threshold with key and account auths).
pub type WaxAuthority = proto::Authority;
/// Represents a map from public key to signing weight.
pub type KeyAuths = HashMap<PublicKey, u32>;
/// Represents a map from account name to signing weight.
pub type AccountAuths = HashMap<AccountName, u32>;

/// Represents the accounts and authorities required to sign a transaction,
/// grouped by role.
#[derive(Debug, Clone, Default, PartialEq)]
pub struct RequiredAuthorities {
    pub posting_accounts: Vec<AccountName>,
    pub active_accounts: Vec<AccountName>,
    pub owner_accounts: Vec<AccountName>,
    pub other_authorities: Vec<WaxAuthority>,
}

/// Represents the optional owner, active and posting authorities of an account.
#[derive(Debug, Clone, Default, PartialEq)]
pub struct Authorities {
    pub owner: Option<WaxAuthority>,
    pub active: Option<WaxAuthority>,
    pub posting: Option<WaxAuthority>,
}

/// Represents an account's full authority state: its role authorities, memo
/// key and owner-authority update history.
#[derive(Debug, Clone, PartialEq)]
pub struct AccountAuthorityInfo {
    pub account: AccountName,
    pub authorities: Authorities,
    pub memo_key: PublicKey,
    /// Last time the owner authority was changed. Used by the offline
    /// `AccountAuthorityUpdateOperation` builder to decide whether a recent
    /// owner update would expose a stale-key window (mirrors Python's
    /// `last_owner_update` on `AccountAuthorityInfo`).
    pub last_owner_update: HiveDateTime,
    /// The owner authority's previous update timestamp, kept as a fallback
    /// for the same recovery-window check.
    pub previous_owner_update: HiveDateTime,
}
