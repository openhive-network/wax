use crate::core::ffi;
use cxx::UniquePtr;
use std::sync::OnceLock;

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
