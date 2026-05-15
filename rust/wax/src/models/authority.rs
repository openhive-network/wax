use std::collections::HashMap;

use wax_core::proto;

use crate::models::basic::{AccountName, PublicKey};

pub type WaxAuthority = proto::Authority;
pub type KeyAuths = HashMap<PublicKey, u32>;
pub type AccountAuths = HashMap<AccountName, u32>;

#[derive(Debug, Clone, Default, PartialEq)]
pub struct RequiredAuthorities {
    pub posting_accounts: Vec<AccountName>,
    pub active_accounts: Vec<AccountName>,
    pub owner_accounts: Vec<AccountName>,
    pub other_authorities: Vec<WaxAuthority>,
}

#[derive(Debug, Clone, Default, PartialEq)]
pub struct Authorities {
    pub owner: Option<WaxAuthority>,
    pub active: Option<WaxAuthority>,
    pub posting: Option<WaxAuthority>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct AccountAuthorityInfo {
    pub account: AccountName,
    pub authorities: Authorities,
    pub memo_key: PublicKey,
    // TODO: add `last_owner_update`, `previous_owner_update`
}
