use wax_core::{proto, RustOperation};

use crate::WaxError;

pub trait Transaction {
    fn push_operation(self, op: RustOperation) -> Self;
    fn add_signature(&mut self, signature: &str) -> Result<(), WaxError>;
    fn is_signed(&self) -> bool;
    fn validate(&self) -> Result<(), WaxError>;
    fn sig_digest(&self, chain_id: &str) -> Result<String, WaxError>;
    fn id(&self) -> Result<String, WaxError>;
    fn to_binary_form(&self, strip_to_unsigned: bool) -> Result<String, WaxError>;
    fn signature_keys(&self, chain_id: &str) -> Result<Vec<String>, WaxError>;
    fn transaction(&self) -> &proto::Transaction;
}
