use wax_core::{proto, RustOperation};

use crate::WaxError;

pub trait RustTransactionApi {
    fn push_operation(self, op: RustOperation) -> Self;
    fn add_signature(&mut self, signature: &str) -> Result<(), WaxError>;
    fn validate(&self) -> Result<(), WaxError>;
    fn sig_digest(&self, chain_id: &str) -> Result<String, WaxError>;
    fn id(&self) -> Result<String, WaxError>;
    fn to_binary_form(&self, strip_to_unsigned: bool) -> Result<String, WaxError>;
    fn transaction(&self) -> &proto::Transaction;
}
