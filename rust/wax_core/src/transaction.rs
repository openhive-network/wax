use cxx::UniquePtr;

use crate::ffi::{hive_transaction_handle, rust_protocol};
use crate::managed_object::RustManagedObject;
use crate::proto;

/// Represents a half-open encryption range over
/// `RustTransaction::inner.operations`. `end == None` while a `start_encrypt`
/// has not yet been matched by a `stop_encrypt`.
#[derive(Debug, Clone)]
pub struct EncryptionIndex {
    pub main_key: String,
    pub other_key: Option<String>,
    pub begin: usize,
    pub end: Option<usize>,
}

/// Represents a transaction together with its C++ handle and the chain id it
/// is bound to, keeping the Rust-side proto and the C++ representation in sync.
pub struct RustTransaction {
    pub inner: proto::Transaction,
    pub handle: UniquePtr<hive_transaction_handle>,
    pub chain_id: String,
    /// Pending encryption ranges populated by `start_encrypt` / `stop_encrypt`.
    /// Cleared after a successful `perform_operation_encryption`.
    pub encryption_indices: Vec<EncryptionIndex>,
}

impl RustTransaction {
    /// Creates a transaction from its TaPoS data, expiration and operations.
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
        Self {
            inner,
            handle,
            chain_id: chain_id.into(),
            encryption_indices: Vec::new(),
        }
    }

    /// Creates a transaction from an existing [`proto::Transaction`], building
    /// its C++ handle.
    pub fn from_proto(
        protocol: &rust_protocol,
        chain_id: impl Into<String>,
        inner: proto::Transaction,
    ) -> Self {
        let handle = create_handle(protocol, &inner);
        Self {
            inner,
            handle,
            chain_id: chain_id.into(),
            encryption_indices: Vec::new(),
        }
    }

    /// Rebuild the C++ handle from the (mutated) Rust-side proto. Call after
    /// any in-place mutation of `inner.operations` that bypasses the existing
    /// `cpp_tx_*` mutators (e.g. memo encryption rewrites).
    pub fn refresh_handle(&mut self, protocol: &rust_protocol) {
        self.handle = create_handle(protocol, &self.inner);
    }

    /// Creates a transaction by deserializing its proto-shape JSON.
    pub fn from_json(
        protocol: &rust_protocol,
        chain_id: impl Into<String>,
        json: &str,
    ) -> Result<Self, String> {
        let inner: proto::Transaction =
            serde_json::from_str(json).map_err(|e| e.to_string())?;
        Ok(Self::from_proto(protocol, chain_id, inner))
    }

    /// Returns a reference to the wrapped [`proto::Transaction`].
    pub fn proto(&self) -> &proto::Transaction {
        &self.inner
    }

    /// Consumes the wrapper and returns the inner [`proto::Transaction`].
    pub fn into_proto(self) -> proto::Transaction {
        self.inner
    }

    /// Converts the transaction into a managed object for the C++ visitors.
    pub fn to_managed(&self) -> Box<RustManagedObject> {
        RustManagedObject::from_transaction(&self.inner)
    }
}

/// Converts a transaction into its canonical JSON representation.
pub fn transaction_to_canonical_json(tx: &proto::Transaction) -> String {
    serde_json::to_string(tx)
        .expect("pbjson Serialize impl must produce valid JSON")
}

fn create_handle(
    protocol: &rust_protocol,
    tx: &proto::Transaction,
) -> UniquePtr<hive_transaction_handle> {
    protocol
        .cpp_create_transaction_handle(RustManagedObject::from_transaction(tx))
        .expect("failed to create transaction handle")
}
