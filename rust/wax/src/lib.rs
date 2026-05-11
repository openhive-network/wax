mod operation;
mod transaction;

pub use operation::RustOperation;
pub use transaction::RustTransaction;

#[cxx::bridge(namespace = "cpp")]
mod ffi {
    extern "Rust" {
        type RustTransaction;
        fn ref_block_num(self: &RustTransaction) -> u32;
        fn ref_block_prefix(self: &RustTransaction) -> u32;
        fn expiration(self: &RustTransaction) -> String;
        fn operation_count(self: &RustTransaction) -> usize;
        fn operation_at(self: &RustTransaction, idx: usize) -> String;

        type RustOperation;
        fn op_type(self: &RustOperation) -> String;
        fn field_count(self: &RustOperation) -> usize;
        fn field_key_at(self: &RustOperation, idx: usize) -> String;
        fn field_value_at(self: &RustOperation, idx: usize) -> String;
    }

    unsafe extern "C++" {
        include!("foundation.h");
        include!("transaction.h");
        include!("operation.h");

        type Foundation;
        type HiveTransactionHandle;
        type HiveOperationHandle;

        fn new_foundation() -> UniquePtr<Foundation>;

        fn cpp_create_transaction_handle(
            self: &Foundation,
            tx: &RustTransaction,
            is_protobuf: bool,
        ) -> Result<UniquePtr<HiveTransactionHandle>>;

        fn cpp_create_operation_handle(
            self: &Foundation,
            op: &RustOperation,
            is_protobuf: bool,
        ) -> Result<UniquePtr<HiveOperationHandle>>;

        fn cpp_tx_add_operation(
            self: &Foundation,
            tx_handle: Pin<&mut HiveTransactionHandle>,
            op_handle: &HiveOperationHandle,
        ) -> Result<()>;

        fn transaction_id(self: &HiveTransactionHandle) -> String;
        fn operation_count(self: &HiveTransactionHandle) -> usize;

        fn kind(self: &HiveOperationHandle) -> String;
        fn description(self: &HiveOperationHandle) -> String;
    }
}

pub use ffi::{new_foundation, Foundation, HiveOperationHandle, HiveTransactionHandle};
