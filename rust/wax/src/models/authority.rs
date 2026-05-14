use wax_core::proto;

#[derive(Debug, Clone, Default, PartialEq)]
pub struct RequiredAuthorities {
    pub posting_accounts: Vec<String>,
    pub active_accounts: Vec<String>,
    pub owner_accounts: Vec<String>,
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
    pub account: String,
    pub authorities: Authorities,
}
