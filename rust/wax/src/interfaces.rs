use wax_core::{proto, RustOperation};

use crate::WaxError;

#[derive(Debug, Clone, Default, PartialEq)]
pub struct RequiredAuthorities {
    pub posting_accounts: Vec<String>,
    pub active_accounts: Vec<String>,
    pub owner_accounts: Vec<String>,
    pub other_authorities: Vec<proto::Authority>,
}

pub trait Transaction {
    fn push_operation(self, op: RustOperation) -> Self;
    fn add_signature(&mut self, signature: &str) -> Result<(), WaxError>;
    fn is_signed(&self) -> bool;
    fn validate(&self) -> Result<(), WaxError>;
    fn sig_digest(&self, chain_id: &str) -> Result<String, WaxError>;
    fn id(&self) -> Result<String, WaxError>;
    fn to_binary_form(&self, strip_to_unsigned: bool) -> Result<String, WaxError>;
    fn to_api(&self) -> Result<String, WaxError>;
    fn signature_keys(&self, chain_id: &str) -> Result<Vec<String>, WaxError>;
    fn impacted_accounts(&self) -> Result<Vec<String>, WaxError>;
    fn required_authorities(&self) -> Result<RequiredAuthorities, WaxError>;
    fn transaction(&self) -> &proto::Transaction;
}
