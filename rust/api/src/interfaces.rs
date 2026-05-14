use wax::RustOperation;

use crate::WaxError;

pub trait RustTransactionApi {
    fn push_operation(self, op: RustOperation) -> Self;
    fn validate(&self) -> Result<(), WaxError>;
    fn sig_digest(&self, chain_id: &str) -> Result<String, WaxError>;
    fn id(&self) -> Result<String, WaxError>;
}
