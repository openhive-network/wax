use wax_core::proto;

use crate::models::basic::AccountName;

#[derive(Debug, Clone, Default, PartialEq)]
pub struct RequiredAuthorities {
    pub posting_accounts: Vec<AccountName>,
    pub active_accounts: Vec<AccountName>,
    pub owner_accounts: Vec<AccountName>,
    pub other_authorities: Vec<proto::Authority>,
}

#[derive(Debug, Clone, Default, PartialEq)]
pub struct Authorities {
    pub owner: Option<proto::Authority>,
    pub active: Option<proto::Authority>,
    pub posting: Option<proto::Authority>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct AccountAuthorityInfo {
    pub account: AccountName,
    pub authorities: Authorities,
}
