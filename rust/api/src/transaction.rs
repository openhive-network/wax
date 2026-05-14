use crate::interfaces::RustTransactionApi;
use crate::protocol::rust_protocol;
use crate::WaxError;
use wax::{RustOperation, RustTransaction};

impl RustTransactionApi for RustTransaction {
    fn push_operation(mut self, op: RustOperation) -> Self {
        let op_handle = rust_protocol()
            .cpp_create_operation_handle(op.to_managed())
            .expect("failed to create operation handle");

        let mut tx_handle = rust_protocol()
            .cpp_create_transaction_handle(self.to_managed())
            .expect("failed to create transaction handle");

        rust_protocol()
            .cpp_tx_add_operation(tx_handle.pin_mut(), &op_handle)
            .expect("failed to add operation to transaction");

        self.inner.operations.push(op.inner);

        self
    }

    fn validate(&self) -> Result<(), WaxError> {
        let tx_handle = rust_protocol()
            .cpp_create_transaction_handle(self.to_managed())
            .expect("failed to create transaction handle");

        rust_protocol().cpp_tx_validate(&tx_handle).map_err(WaxError::from)
    }

    fn sig_digest(&self, chain_id: &str) -> Result<String, WaxError> {
        let tx_handle = rust_protocol()
            .cpp_create_transaction_handle(self.to_managed())
            .expect("failed to create transaction handle");

        rust_protocol()
            .cpp_tx_sig_digest(&tx_handle, chain_id)
            .map_err(WaxError::from)
    }

    fn id(&self) -> Result<String, WaxError> {
        let tx_handle = rust_protocol()
            .cpp_create_transaction_handle(self.to_managed())
            .expect("failed to create transaction handle");

        rust_protocol().cpp_tx_id(&tx_handle).map_err(WaxError::from)
    }
}
