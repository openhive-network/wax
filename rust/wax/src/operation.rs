use crate::managed_object::RustManagedObject;
use crate::proto::{self, operation::Value};

pub struct RustOperation {
    inner: proto::Operation,
}

impl RustOperation {
    pub fn new(value: Value) -> Self {
        Self {
            inner: proto::Operation { value: Some(value) },
        }
    }

    pub fn from_proto(inner: proto::Operation) -> Self {
        Self { inner }
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
