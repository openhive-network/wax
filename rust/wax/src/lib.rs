pub mod proto {
    #![allow(clippy::all)]
    include!("../../protobuf_patterns/hive.protocol.buffers.rs");
}

mod managed_object;
mod operation;
mod transaction;

pub use managed_object::{descriptor_pool, RustManagedObject};
pub use operation::RustOperation;
pub use transaction::RustTransaction;

use managed_object::{
    rmo_array_length, rmo_as_bool, rmo_as_i16, rmo_as_i32, rmo_as_i64, rmo_as_i8, rmo_as_string,
    rmo_as_u16, rmo_as_u32, rmo_as_u64, rmo_as_u8, rmo_clone, rmo_get_field, rmo_get_index,
    rmo_is_optional_field_present, rmo_is_string, rmo_is_undefined, rmo_map_keys,
    rmo_oneof_variant,
};

#[cxx::bridge(namespace = "cpp")]
mod ffi {
    extern "Rust" {
        type RustManagedObject;

        fn rmo_clone(obj: &RustManagedObject) -> Box<RustManagedObject>;
        fn rmo_get_field(obj: &RustManagedObject, key: &str) -> Box<RustManagedObject>;
        fn rmo_get_index(obj: &RustManagedObject, idx: usize) -> Box<RustManagedObject>;
        fn rmo_array_length(obj: &RustManagedObject) -> usize;
        fn rmo_is_undefined(obj: &RustManagedObject) -> bool;
        fn rmo_is_string(obj: &RustManagedObject) -> bool;
        fn rmo_is_optional_field_present(obj: &RustManagedObject, name: &str) -> bool;
        fn rmo_oneof_variant(obj: &RustManagedObject) -> String;
        fn rmo_map_keys(obj: &RustManagedObject) -> Vec<String>;

        fn rmo_as_string(obj: &RustManagedObject) -> String;
        fn rmo_as_bool(obj: &RustManagedObject) -> bool;
        fn rmo_as_i64(obj: &RustManagedObject) -> i64;
        fn rmo_as_i32(obj: &RustManagedObject) -> i32;
        fn rmo_as_i16(obj: &RustManagedObject) -> i16;
        fn rmo_as_i8(obj: &RustManagedObject) -> i8;
        fn rmo_as_u64(obj: &RustManagedObject) -> u64;
        fn rmo_as_u32(obj: &RustManagedObject) -> u32;
        fn rmo_as_u16(obj: &RustManagedObject) -> u16;
        fn rmo_as_u8(obj: &RustManagedObject) -> u8;
    }

    #[cfg(feature = "with_cpp_core")]
    unsafe extern "C++" {
        include!("rust_protocol.hpp");
        include!("rust_managed_object.hpp");

        #[namespace = "cpp"]
        type rust_protocol;
        #[namespace = "cpp"]
        type hive_transaction_handle;
        #[namespace = "cpp"]
        type hive_operation_handle;

        fn new_rust_protocol() -> UniquePtr<rust_protocol>;

        fn cpp_create_operation_handle(
            self: &rust_protocol,
            obj: Box<RustManagedObject>,
        ) -> Result<UniquePtr<hive_operation_handle>>;

        fn cpp_create_transaction_handle(
            self: &rust_protocol,
            obj: Box<RustManagedObject>,
        ) -> Result<UniquePtr<hive_transaction_handle>>;

        fn cpp_tx_add_operation(
            self: &rust_protocol,
            tx: Pin<&mut hive_transaction_handle>,
            op: &hive_operation_handle,
        ) -> Result<()>;
    }
}

#[cfg(feature = "with_cpp_core")]
pub use ffi::{hive_operation_handle, hive_transaction_handle, new_rust_protocol, rust_protocol};
