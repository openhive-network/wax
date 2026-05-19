use cxx::UniquePtr;

use crate::ffi::{hive_operation_handle, rust_protocol};
use crate::managed_object::RustManagedObject;
use crate::proto::{self, operation::Value};

pub struct RustOperation {
    pub inner: proto::Operation,
    pub handle: UniquePtr<hive_operation_handle>,
}

impl RustOperation {
    pub fn new(protocol: &rust_protocol, value: Value) -> Self {
        Self::from_proto(protocol, proto::Operation { value: Some(value) })
    }

    pub fn from_proto(protocol: &rust_protocol, inner: proto::Operation) -> Self {
        let handle = create_handle(protocol, &inner);
        Self { inner, handle }
    }

    pub fn from_json(protocol: &rust_protocol, json: &str) -> Result<Self, String> {
        let inner: proto::Operation = serde_json::from_str(json).map_err(|e| e.to_string())?;
        Ok(Self::from_proto(protocol, inner))
    }

    pub fn proto(&self) -> &proto::Operation {
        &self.inner
    }

    pub fn into_proto(self) -> proto::Operation {
        self.inner
    }

    pub fn to_managed(&self) -> Box<RustManagedObject> {
        RustManagedObject::from_operation(&self.inner)
    }
}

fn create_handle(
    protocol: &rust_protocol,
    op: &proto::Operation,
) -> UniquePtr<hive_operation_handle> {
    protocol
        .cpp_create_operation_handle(RustManagedObject::from_operation(op))
        .expect("failed to create operation handle")
}
