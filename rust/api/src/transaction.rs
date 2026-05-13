use crate::interfaces::RustTransactionApi;
use wax::{RustOperation, RustTransaction, ffi};
use crate::protocol::rust_protocol;

impl RustTransactionApi for RustTransaction {
    fn push_operation(self, op: RustOperation) -> Self {
        self.inner.operations.push(op.inner);
        //rust_protocol().cpp_tx_add_operation(self.inner, op.inner);
        todo!("fix cpp_tx_add_operation type mismatch");
        self
    }
}


