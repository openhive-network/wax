use cxx::UniquePtr;
use std::sync::OnceLock;
use wax::{ffi, RustOperation, RustTransaction};

struct SyncProtocol(UniquePtr<ffi::rust_protocol>);
unsafe impl Sync for SyncProtocol {}
unsafe impl Send for SyncProtocol {}

static RUST_PROTOCOL: OnceLock<SyncProtocol> = OnceLock::new();

pub fn rust_protocol() -> &'static ffi::rust_protocol {
    RUST_PROTOCOL
        .get_or_init(|| SyncProtocol(ffi::new_rust_protocol()))
        .0
        .as_ref()
        .expect("new_rust_protocol returned null")
}

pub fn create_transaction_handle(tx: &RustTransaction) -> UniquePtr<ffi::hive_transaction_handle> {
    rust_protocol()
        .cpp_create_transaction_handle(tx.to_managed())
        .expect("failed to create transaction handle")
}

pub fn create_operation_handle(op: &RustOperation) -> UniquePtr<ffi::hive_operation_handle> {
    rust_protocol()
        .cpp_create_operation_handle(op.to_managed())
        .expect("failed to create operation handle")
}
