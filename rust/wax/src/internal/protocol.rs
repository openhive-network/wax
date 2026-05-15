use core::pin::Pin;
use cxx::UniquePtr;
use std::sync::{Mutex, OnceLock};
use wax_core::{ffi, RustOperation};

struct SyncProtocol(UniquePtr<ffi::rust_protocol>);
unsafe impl Sync for SyncProtocol {}
unsafe impl Send for SyncProtocol {}

static RUST_PROTOCOL: OnceLock<SyncProtocol> = OnceLock::new();

pub(crate) fn rust_protocol() -> &'static ffi::rust_protocol {
    RUST_PROTOCOL
        .get_or_init(|| SyncProtocol(ffi::new_rust_protocol()))
        .0
        .as_ref()
        .expect("new_rust_protocol returned null")
}

struct SyncMutProtocol(Mutex<UniquePtr<ffi::rust_protocol>>);
unsafe impl Sync for SyncMutProtocol {}
unsafe impl Send for SyncMutProtocol {}

static RUST_PROTOCOL_MUT: OnceLock<SyncMutProtocol> = OnceLock::new();

pub(crate) fn with_protocol_mut<F, R>(f: F) -> R
where
    F: FnOnce(Pin<&mut ffi::rust_protocol>) -> R,
{
    let mut guard = RUST_PROTOCOL_MUT
        .get_or_init(|| SyncMutProtocol(Mutex::new(ffi::new_rust_protocol())))
        .0
        .lock()
        .expect("rust_protocol mutex poisoned");
    f(guard.pin_mut())
}

pub(crate) fn create_operation_handle(op: &RustOperation) -> UniquePtr<ffi::hive_operation_handle> {
    rust_protocol()
        .cpp_create_operation_handle(op.to_managed())
        .expect("failed to create operation handle")
}
