use wax::RustOperation;

use crate::WaxError;

pub trait RustTransactionApi {
    fn push_operation(self, op: RustOperation) -> Self;
    fn validate(&self) -> Result<(), WaxError>;
}
