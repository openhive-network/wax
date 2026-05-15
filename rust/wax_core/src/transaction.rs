use cxx::UniquePtr;

use crate::ffi::{hive_transaction_handle, rust_protocol};
use crate::managed_object::RustManagedObject;
use crate::proto;

pub struct RustTransaction {
    pub inner: proto::Transaction,
    pub handle: UniquePtr<hive_transaction_handle>,
    pub chain_id: String,
}

impl RustTransaction {
    pub fn new(
        protocol: &rust_protocol,
        chain_id: impl Into<String>,
        ref_block_num: u32,
        ref_block_prefix: u32,
        expiration: impl Into<String>,
        operations: Vec<proto::Operation>,
    ) -> Self {
        let inner = proto::Transaction {
            ref_block_num,
            ref_block_prefix,
            expiration: expiration.into(),
            operations,
            extensions: Vec::new(),
            signatures: Vec::new(),
        };
        let handle = create_handle(protocol, &inner);
        Self { inner, handle, chain_id: chain_id.into() }
    }

    pub fn from_proto(
        protocol: &rust_protocol,
        chain_id: impl Into<String>,
        inner: proto::Transaction,
    ) -> Self {
        let handle = create_handle(protocol, &inner);
        Self { inner, handle, chain_id: chain_id.into() }
    }

    pub fn proto(&self) -> &proto::Transaction {
        &self.inner
    }

    pub fn into_proto(self) -> proto::Transaction {
        self.inner
    }

    pub fn to_managed(&self) -> Box<RustManagedObject> {
        RustManagedObject::from_transaction(&self.inner)
    }
}

fn create_handle(
    protocol: &rust_protocol,
    tx: &proto::Transaction,
) -> UniquePtr<hive_transaction_handle> {
    protocol
        .cpp_create_transaction_handle(RustManagedObject::from_transaction(tx))
        .expect("failed to create transaction handle")
}
