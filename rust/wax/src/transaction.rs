use crate::managed_object::RustManagedObject;
use crate::proto;

pub struct RustTransaction {
    inner: proto::Transaction,
}

impl RustTransaction {
    pub fn new(
        ref_block_num: u32,
        ref_block_prefix: u32,
        expiration: impl Into<String>,
        operations: Vec<proto::Operation>,
    ) -> Self {
        Self {
            inner: proto::Transaction {
                ref_block_num,
                ref_block_prefix,
                expiration: expiration.into(),
                operations,
                extensions: Vec::new(),
                signatures: Vec::new(),
            },
        }
    }

    pub fn from_proto(inner: proto::Transaction) -> Self {
        Self { inner }
    }

    pub fn proto(&self) -> &proto::Transaction {
        &self.inner
    }

    pub fn into_proto(self) -> proto::Transaction {
        self.inner
    }

    /// Wrap this transaction as a `RustManagedObject` ready to cross the
    /// cxx bridge into `cpp::rust_protocol::cpp_create_transaction_handle`.
    pub fn to_managed(&self) -> Box<RustManagedObject> {
        RustManagedObject::from_transaction(&self.inner)
    }
}
