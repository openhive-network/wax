use crate::interfaces::RustTransactionApi;
use crate::protocol::{create_operation_handle, rust_protocol};
use crate::WaxError;
use wax_core::{proto, RustOperation, RustTransaction};

impl RustTransactionApi for RustTransaction {
    fn push_operation(mut self, op: RustOperation) -> Self {
        let op_handle = create_operation_handle(&op);

        rust_protocol()
            .cpp_tx_add_operation(self.handle.pin_mut(), &op_handle)
            .expect("failed to add operation to transaction");

        self.inner.operations.push(op.inner);

        self
    }

    fn validate(&self) -> Result<(), WaxError> {
        rust_protocol().cpp_tx_validate(&self.handle).map_err(WaxError::from)
    }

    fn sig_digest(&self, chain_id: &str) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_tx_sig_digest(&self.handle, chain_id)
            .map_err(WaxError::from)
    }

    fn id(&self) -> Result<String, WaxError> {
        rust_protocol().cpp_tx_id(&self.handle).map_err(WaxError::from)
    }

    fn to_binary_form(&self, strip_to_unsigned: bool) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_tx_to_binary(&self.handle, strip_to_unsigned)
            .map_err(WaxError::from)
    }

    fn transaction(&self) -> &proto::Transaction {
        self.proto()
    }
}
